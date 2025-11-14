// Application Configuration
const CONFIG = {
  // Google Earth Engine API credentials
  GOOGLE_EARTH_ENGINE: {
    client_email: import.meta.env.VITE_GOOGLE_EARTH_ENGINE_CLIENT_EMAIL,
    client_id: import.meta.env.VITE_GOOGLE_EARTH_ENGINE_CLIENT_ID,
    private_key: import.meta.env.VITE_GOOGLE_EARTH_ENGINE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  
  // Database connection
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  
  // Cloudflare R2 Storage
  R2: {
    account_id: import.meta.env.VITE_R2_ACCOUNT_ID,
    s3_api_key: import.meta.env.VITE_R2_S3_API_KEY,
    bucket_name: import.meta.env.VITE_R2_BUCKET_NAME
  },
  
  // Payment Gateway - Paystack
  PAYSTACK: {
    public_key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    secret_key: import.meta.env.VITE_PAYSTACK_SECRET_KEY
  },
  
  // Email Service - Brevo
  BREVO: {
    api_key: import.meta.env.VITE_BREVO_API_KEY
  },
  
  // Map configuration
  MAP: {
    defaultCenter: [9.0820, 8.6753], // Nigeria center coordinates
    defaultZoom: 6,
    maxZoom: 18
  },
  
  // Admin credentials
  ADMIN: {
    email: 'ikewisdom92@gmail.com',
    password: 'password'
  }
};

// Export config for module usage
export default CONFIG;