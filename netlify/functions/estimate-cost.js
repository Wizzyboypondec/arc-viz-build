// Cost Estimation API
import { Client } from 'pg';
import * as turf from '@turf/turf';

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
    if (!body.cad_json || !body.land_area) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          message: 'cad_json and land_area are required'
        })
      };
    }

    // Initialize database client
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    // Fetch materials and their composition from database
    const materialsResult = await client.query(`
      SELECT 
        m.id,
        m.name,
        m.base_cost,
        m.measurement_unit,
        m.consumption_formula_json,
        json_agg(
          json_build_object(
            'component_name', mc.component_name,
            'component_cost', mc.component_cost,
            'required_quantity', mc.required_quantity
          )
        ) as composition
      FROM materials m
      LEFT JOIN material_composition mc ON m.id = mc.material_id
      GROUP BY m.id, m.name, m.base_cost, m.measurement_unit, m.consumption_formula_json
    `);
    
    const materials = materialsResult.rows;
    
    // Deserialize CAD JSON
    const cadData = JSON.parse(body.cad_json);
    
    // Extract building elements from CAD data
    const walls = [];
    const rooms = [];
    const doors = [];
    const windows = [];
    
    // Process CAD layers to extract elements
    // This is a simplified example - actual implementation would depend on your CAD data structure
    if (cadData && cadData.children) {
      cadData.children.forEach(layer => {
        if (layer.children) {
          layer.children.forEach(shape => {
            if (shape.className === 'Line' && shape.attrs.name && shape.attrs.name.includes('wall')) {
              // Calculate wall length from points
              const points = shape.attrs.points;
              let length = 0;
              for (let i = 0; i < points.length - 2; i += 2) {
                const dx = points[i + 2] - points[i];
                const dy = points[i + 3] - points[i + 1];
                length += Math.sqrt(dx * dx + dy * dy);
              }
              walls.push({ id: shape.attrs.id, length: length / 50 }); // Convert pixels to meters (assuming 50px per meter)
            }
            
            if (shape.className === 'Rect' && shape.attrs.name && shape.attrs.name.includes('room')) {
              // Calculate room area
              const area = (shape.attrs.width * shape.attrs.height) / (50 * 50); // Convert pixels to m²
              rooms.push({ id: shape.attrs.id, area: area });
            }
            
            if (shape.className === 'Circle' && shape.attrs.name && shape.attrs.name.includes('door')) {
              doors.push({ id: shape.attrs.id });
            }
            
            if (shape.className === 'Circle' && shape.attrs.name && shape.attrs.name.includes('window')) {
              windows.push({ id: shape.attrs.id });
            }
          });
        }
      });
    }
    
    // Calculate quantities based on geometric measurements
    let totalWallLength = walls.reduce((sum, wall) => sum + wall.length, 0);
    let totalRoomArea = rooms.reduce((sum, room) => sum + room.area, 0);
    
    // Apply consumption formulas from database
    // For blocks: typically 60 blocks per m² of wall area
    // Wall area = perimeter * height (assuming standard height of 3m)
    const wallHeight = 3; // meters
    const wallArea = totalWallLength * wallHeight;
    
    // Find blocks material
    const blocksMaterial = materials.find(m => m.name.toLowerCase().includes('block') || m.name.toLowerCase().includes('brick'));
    
    let blocksNeeded = 0;
    let blockCost = 0;
    
    if (blocksMaterial) {
      // Use formula from database if available, otherwise use default
      if (blocksMaterial.consumption_formula_json) {
        // Parse formula and calculate
        // This would contain logic like "area * 60" for blocks per m²
        // For now, we'll use a simple calculation
        blocksNeeded = Math.ceil(wallArea * 60); // 60 blocks per m²
      } else {
        blocksNeeded = Math.ceil(wallArea * 60);
      }
      
      blockCost = blocksNeeded * blocksMaterial.base_cost;
    }
    
    // Calculate other material costs based on composition
    let totalMaterialCost = blockCost;
    
    // If blocks have composition (cement, sand, etc.), calculate component costs
    if (blocksMaterial && blocksMaterial.composition) {
      const composition = Array.isArray(blocksMaterial.composition) ? blocksMaterial.composition : [];
      
      composition.forEach(component => {
        if (component.component_name && component.component_cost && component.required_quantity) {
          const componentCost = blocksNeeded * component.required_quantity * component.component_cost;
          totalMaterialCost += componentCost;
          
          console.log(`Component ${component.component_name}: ${componentCost} (${blocksNeeded} blocks * ${component.required_quantity} units * ₦${component.component_cost})`);
        }
      });
    }
    
    // Add costs for doors and windows
    const doorMaterial = materials.find(m => m.name.toLowerCase().includes('door'));
    const windowMaterial = materials.find(m => m.name.toLowerCase().includes('window'));
    
    const doorCost = doors.length * (doorMaterial?.base_cost || 45000);
    const windowCost = windows.length * (windowMaterial?.base_cost || 35000);
    
    totalMaterialCost += doorCost + windowCost;
    
    // Calculate labor costs (simplified)
    const laborCost = totalRoomArea * 2500; // ₦2,500 per m²
    
    // Calculate overhead and contingency
    const overhead = totalMaterialCost * 0.1; // 10%
    const contingency = (totalMaterialCost + laborCost) * 0.05; // 5%
    
    // Calculate total cost
    const totalCost = totalMaterialCost + laborCost + overhead + contingency;
    
    // Prepare response
    const response = {
      success: true,
      estimated_cost: totalCost,
      breakdown: {
        materials: {
          total: totalMaterialCost,
          items: [
            { name: 'Blocks', quantity: blocksNeeded, unit_cost: blocksMaterial?.base_cost || 0, total_cost: blockCost },
            { name: 'Doors', quantity: doors.length, unit_cost: doorMaterial?.base_cost || 45000, total_cost: doorCost },
            { name: 'Windows', quantity: windows.length, unit_cost: windowMaterial?.base_cost || 35000, total_cost: windowCost }
          ]
        },
        labor: {
          total: laborCost,
          rate_per_sqm: 2500,
          total_area: totalRoomArea
        },
        overhead: {
          percentage: 10,
          amount: overhead
        },
        contingency: {
          percentage: 5,
          amount: contingency
        },
        totals: {
          subtotal: totalMaterialCost + laborCost,
          total: totalCost
        }
      },
      calculations: {
        wall_length: totalWallLength,
        wall_area: wallArea,
        room_area: totalRoomArea,
        number_of_walls: walls.length,
        number_of_rooms: rooms.length,
        number_of_doors: doors.length,
        number_of_windows: windows.length
      }
    };
    
    await client.end();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error estimating cost:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to estimate cost',
        message: error.message
      })
    };
  }
}