// Send Email via Brevo API
import axios from 'axios';

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
    if (!body.to || !body.subject || !body.html_content) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          message: 'to, subject, and html_content are required'
        })
      };
    }

    // Brevo API configuration
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    if (!BREVO_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Brevo API key not configured'
        })
      };
    }

    // Prepare email data
    const emailData = {
      sender: {
        name: body.from_name || 'Idi UBC LTD',
        email: body.from_email || 'no-reply@idiubc.com'
      },
      to: [
        {
          email: body.to,
          name: body.to_name || ''
        }
      ],
      subject: body.subject,
      htmlContent: body.html_content,
      params: body.params || {}
    };

    // Add CC if provided
    if (body.cc) {
      emailData.cc = [{
        email: body.cc,
        name: body.cc_name || ''
      }];
    }

    // Add BCC if provided
    if (body.bcc) {
      emailData.bcc = [{
        email: body.bcc,
        name: body.bcc_name || ''
      }];
    }

    // Send email via Brevo API
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message_id: response.data.id,
        message: 'Email sent successfully'
      })
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Handle specific Brevo API errors
    if (error.response) {
      return {
        statusCode: error.response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Failed to send email',
          message: error.response.data.message || error.message
        })
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to send email',
        message: error.message
      })
    };
  }
}