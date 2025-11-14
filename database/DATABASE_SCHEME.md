This is the complete PostgreSQL SQL database with all necessary tables, roles, and RLS (Row Level Security) policies for a multi-tenant construction app.
Required Tables:
users: (id, email, password_hash, first_name, last_name, created_at)
admins: (id, user_id, role) - Link to users table.
site_settings: (id, site_name, main_theme_color, logo_url, contact_email, contact_phone, address)
cms_content: (id, page_slug, section_slug, content_json, is_visible)
materials: (id, name, svg_icon, model_3d_url, base_cost, measurement_unit)
material_composition: (id, material_id, component_name, component_cost, required_quantity) - This links components (cement, sand) to a main material (block).
projects: (id, user_id, project_name, land_area_sqm, map_coords_json, cad_design_json, gee_data_json, status, total_cost)
project_files: (id, project_id, file_name, file_url, file_type) - Stores R2 links.
templates: (id, name, description, image_url, cad_design_json, base_cost)
testimonials: (id, client_name, project_desc, video_url, image_url)
Initial Data:
Insert the default admin user: email: 'ikewisdom92@gmail.com', password: 'password' (hash this).
Insert the default site settings: site_name: 'Idi UBC LTD'.