// Get Materials from Neon DB
import { Client } from 'pg';
import { DATABASE_URL } from '../js/config.js';

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

  try {
    // Initialize database client
    const client = new Client({
      connectionString: process.env.DATABASE_URL || DATABASE_URL
    });
    
    await client.connect();
    
    // Query materials with composition
    const result = await client.query(`
      SELECT 
        m.id,
        m.name,
        m.svg_icon,
        m.model_3d_url,
        m.base_cost,
        m.measurement_unit,
        json_agg(
          json_build_object(
            'component_name', mc.component_name,
            'component_cost', mc.component_cost,
            'required_quantity', mc.required_quantity
          )
        ) as composition
      FROM materials m
      LEFT JOIN material_composition mc ON m.id = mc.material_id
      GROUP BY m.id, m.name, m.svg_icon, m.model_3d_url, m.base_cost, m.measurement_unit
      ORDER BY m.name
    `);
    
    await client.end();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.rows)
    };
    
  } catch (error) {
    console.error('Error fetching materials:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch materials',
        message: error.message
      })
    };
  }
}