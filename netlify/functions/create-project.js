// Create Project in Neon DB
import { Client } from 'pg';

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
    if (!body.user_id || !body.project_name || !body.land_area_sqm) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          message: 'user_id, project_name, and land_area_sqm are required'
        })
      };
    }

    // Initialize database client
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    // Insert project
    const result = await client.query(
      `INSERT INTO projects 
       (user_id, project_name, land_area_sqm, map_coords_json, cad_design_json, gee_data_json, status, total_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.user_id,
        body.project_name,
        body.land_area_sqm,
        body.map_coords_json || null,
        body.cad_design_json || null,
        body.gee_data_json || null,
        body.status || 'draft',
        body.total_cost || 0
      ]
    );
    
    await client.end();
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.rows[0])
    };
    
  } catch (error) {
    console.error('Error creating project:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to create project',
        message: error.message
      })
    };
  }
}