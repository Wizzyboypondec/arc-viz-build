-- Complete PostgreSQL Database Schema for Web CAD & Cost Estimator
-- Generated from DATABASE_SCHEME.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Site Settings Table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) NOT NULL DEFAULT 'Idi UBC LTD',
  main_theme_color VARCHAR(7) NOT NULL DEFAULT '#6366f1', -- HEX color
  logo_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address TEXT,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Content Table
CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug VARCHAR(100) NOT NULL,
  section_slug VARCHAR(100) NOT NULL,
  content_json JSONB NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_slug, section_slug)
);

-- Materials Table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  svg_icon TEXT, -- URL or base64 encoded SVG
  model_3d_url TEXT, -- URL to 3D model
  base_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  measurement_unit VARCHAR(50), -- e.g., 'kg', 'm', 'unit', 'm²'
  consumption_formula_json JSONB, -- Stores formula for calculating usage (e.g., {"per_area": 60} for blocks per m²)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material Composition Table
CREATE TABLE material_composition (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  component_name VARCHAR(255) NOT NULL, -- e.g., 'Cement', 'Sand'
  component_cost DECIMAL(10,2) NOT NULL, -- Cost of this component
  required_quantity DECIMAL(10,4) NOT NULL, -- Quantity needed per unit of parent material
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_id, component_name)
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  land_area_sqm DECIMAL(15,4) NOT NULL,
  map_coords_json JSONB, -- GeoJSON coordinates of the selected land area
  cad_design_json JSONB, -- Serialized Konva.js stage data
  gee_data_json JSONB, -- Google Earth Engine data (soil, climate, etc.)
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'archived')),
  total_cost DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Project Files Table
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL, -- Presigned URL from Cloudflare R2
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('blueprint', 'quotation', 'site_plan', 'elevation', 'cross_section', 'specification', 'other')),
  file_size BIGINT, -- in bytes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Templates Table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT, -- Thumbnail image
  cad_design_json JSONB NOT NULL, -- Pre-designed CAD template
  base_cost DECIMAL(15,2), -- Estimated base cost
  category VARCHAR(100), -- e.g., 'residential', 'commercial'
  style VARCHAR(100), -- e.g., 'modern', 'traditional'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  project_desc TEXT,
  video_url TEXT,
  image_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_files_type ON project_files(file_type);
CREATE INDEX idx_materials_name ON materials(name);
CREATE INDEX idx_cms_content_page_section ON cms_content(page_slug, section_slug);

-- Insert default admin user (password hash would be generated in real app)
-- Note: In production, use a secure password hashing function like bcrypt
INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'ikewisdom92@gmail.com', 'hashed_password_placeholder', 'Wisdom', 'Ike');

INSERT INTO admins (user_id, role) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'super_admin');

-- Insert default site settings
INSERT INTO site_settings (site_name, main_theme_color, contact_email, contact_phone, address) VALUES 
  ('Idi UBC LTD', '#6366f1', 'info@idiubc.com', '+234 800 000 0000', 'Lagos, Nigeria');

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for projects table
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (user_id = auth.uid());

-- Create policies for project_files table
CREATE POLICY "Users can view project files"
  ON project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_files.project_id
    AND p.user_id = auth.uid()
  ));

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_composition_updated_at BEFORE UPDATE ON material_composition FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();