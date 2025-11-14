// Generate Blueprint API
import { Client } from 'pg';
import * as svg2pdf from 'svg2pdf.js';
import * as AWS from 'aws-sdk';

// Configure AWS S3 for Cloudflare R2
AWS.config.update({
  accessKeyId: process.env.R2_S3_API_KEY,
  secretAccessKey: process.env.R2_S3_SECRET_KEY,
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  s3ForcePathStyle: true
});

const s3 = new AWS.S3();

export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      }
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    
    // Validate required fields
    if (!body.project_id || !body.cad_json) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          message: 'project_id and cad_json are required'
        })
      };
    }

    // Initialize database client
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    // Get project data
    const projectResult = await client.query('SELECT * FROM projects WHERE id = $1', [body.project_id]);
    
    if (projectResult.rows.length === 0) {
      await client.end();
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Project not found'
        })
      };
    }
    
    const project = projectResult.rows[0];
    
    // Generate SVG from CAD JSON
    const svgContent = generateSVGFromCAD(body.cad_json);
    
    // Convert SVG to PDF
    const pdfBuffer = await convertSVGToPDF(svgContent);
    
    // Upload to Cloudflare R2
    const fileName = `blueprint-project-${body.project_id}-${Date.now()}.pdf`;
    
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `blueprints/${fileName}`,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      Metadata: {
        'project-id': body.project_id.toString(),
        'file-type': 'blueprint',
        'generated-at': new Date().toISOString()
      }
    };
    
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Generate presigned URL for download
    const presignedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `blueprints/${fileName}`,
      Expires: 3600 // URL expires in 1 hour
    });
    
    // Save file reference to database
    await client.query(
      `INSERT INTO project_files 
       (project_id, file_name, file_url, file_type)
       VALUES ($1, $2, $3, $4)`,
      [
        body.project_id,
        fileName,
        presignedUrl,
        'blueprint'
      ]
    );
    
    await client.end();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        file_name: fileName,
        download_url: presignedUrl,
        message: 'Blueprint generated and uploaded successfully'
      })
    };
    
  } catch (error) {
    console.error('Error generating blueprint:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to generate blueprint',
        message: error.message
      })
    };
  }
}

function generateSVGFromCAD(cadJson) {
  // Deserialize CAD JSON
  const cadData = typeof cadJson === 'string' ? JSON.parse(cadJson) : cadJson;
  
  // Extract width and height from stage
  const width = cadData.attrs.width || 800;
  const height = cadData.attrs.height || 600;
  
  // Start SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#f8f9fa">\n`;
  svg += `  <style>\n`;
  svg += `    .grid { stroke: #e0e0e0; stroke-width: 1; stroke-dasharray: 20,20; }\n`;
  svg += `    .wall { stroke: #333; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; fill: none; }\n`;
  svg += `    .room { fill: rgba(255,255,255,0.7); stroke: #333; stroke-width: 2; }\n`;
  svg += `    .label { font-family: Calibri, sans-serif; font-size: 12px; fill: #333; }\n`;
  svg += `    .dimension { font-family: Calibri, sans-serif; font-size: 14px; fill: #666; font-style: italic; }\n`;
  svg += `  </style>\n`;
  
  // Add grid
  const gridSize = 20;
  for (let x = 0; x <= width; x += gridSize) {
    svg += `  <line class="grid" x1="${x}" y1="0" x2="${x}" y2="${height}" />\n`;
  }
  for (let y = 0; y <= height; y += gridSize) {
    svg += `  <line class="grid" x1="0" y1="${y}" x2="${width}" y2="${y}" />\n`;
  }
  
  // Process layers and shapes
  if (cadData.children) {
    cadData.children.forEach(layer => {
      if (layer.children) {
        layer.children.forEach(shape => {
          if (shape.className === 'Line' && shape.attrs.name && shape.attrs.name.includes('wall')) {
            const points = shape.attrs.points;
            if (points && points.length >= 4) {
              svg += `  <polyline class="wall" points="`;
              for (let i = 0; i < points.length; i += 2) {
                svg += `${points[i]},${points[i+1]} `;
              }
              svg += `" />\n`;
              
              // Add length label
              const length = calculateLineLength(points) / 50; // Convert pixels to meters
              const midX = (points[0] + points[points.length - 2]) / 2;
              const midY = (points[1] + points[points.length - 1]) / 2 - 15;
              svg += `  <text class="label" x="${midX}" y="${midY}">${length.toFixed(2)}m</text>\n`;
            }
          }
          
          if (shape.className === 'Rect' && shape.attrs.name && shape.attrs.name.includes('room')) {
            const x = shape.attrs.x || 0;
            const y = shape.attrs.y || 0;
            const width = shape.attrs.width || 0;
            const height = shape.attrs.height || 0;
            
            svg += `  <rect class="room" x="${x}" y="${y}" width="${width}" height="${height}" />\n`;
            
            // Add area label
            const area = (width * height) / (50 * 50); // Convert pixels to m²
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            svg += `  <text class="label" x="${centerX}" y="${centerY}" text-anchor="middle">${area.toFixed(2)}m²</text>\n`;
          }
          
          if (shape.className === 'Text' && shape.attrs.text) {
            const x = shape.attrs.x || 0;
            const y = shape.attrs.y || 0;
            const fontSize = shape.attrs.fontSize || 12;
            const text = shape.attrs.text;
            
            svg += `  <text class="label" x="${x}" y="${y}" font-size="${fontSize}px">${text}</text>\n`;
          }
        });
      }
    });
  }
  
  // Add title block
  svg += `  <rect x="20" y="${height - 80}" width="300" height="60" fill="white" stroke="#333" stroke-width="1" />\n`;
  svg += `  <text class="dimension" x="30" y="${height - 60}">Project: ${project?.project_name || 'Untitled'}</text>\n`;
  svg += `  <text class="dimension" x="30" y="${height - 40}">Date: ${new Date().toLocaleDateString()}</text>\n`;
  svg += `  <text class="dimension" x="30" y="${height - 20}">Scale: 1:50</text>\n`;
  
  // Close SVG
  svg += `</svg>`;
  
  return svg;
}

function calculateLineLength(points) {
  let length = 0;
  for (let i = 0; i < points.length - 2; i += 2) {
    const dx = points[i + 2] - points[i];
    const dy = points[i + 3] - points[i + 1];
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

async function convertSVGToPDF(svgContent) {
  // In a real implementation, we would use svg2pdf.js to convert SVG to PDF
  // For this example, we'll simulate the conversion with a simple PDF
  
  // Create a simple PDF with the SVG content
  const pdfContent = `%PDF-1.4\n`
    + `1 0 obj
`
    + `<< /Type /Catalog /Pages 2 0 R >>
`
    + `endobj
`
    + `2 0 obj
`
    + `<< /Type /Pages /Kids [3 0 R] /Count 1 >>
`
    + `endobj
`
    + `3 0 obj
`
    + `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
`
    + `endobj
`
    + `4 0 obj
`
    + `<< /Length 100 >>
`
    + `stream
`
    + `BT /F1 24 Tf 100 700 Td (Construction Blueprint) Tj ET
`
    + `endstream
`
    + `endobj
`
    + `5 0 obj
`
    + `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
`
    + `endobj
`
    + `xref
`
    + `0 6
`
    + `0000000000 65535 f 
`
    + `0000000010 00000 n 
`
    + `0000000060 00000 n 
`
    + `0000000120 00000 n 
`
    + `0000000250 00000 n 
`
    + `0000000350 00000 n 
`
    + `trailer
`
    + `<< /Size 6 /Root 1 0 R >>
`
    + `startxref
`
    + `${600 + Math.floor(Math.random() * 100)}
`
    + `%%EOF`;
  
  return Buffer.from(pdfContent);
}