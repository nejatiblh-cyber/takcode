/*
  # Portfolio Website Schema

  ## New Tables
  
  1. `services`
    - `id` (uuid, primary key)
    - `title` (text) - Service name
    - `description` (text) - Service description
    - `icon` (text) - Icon name
    - `display_order` (integer) - Order of display
    - `created_at` (timestamp)
  
  2. `projects`
    - `id` (uuid, primary key)
    - `title` (text) - Project name
    - `description` (text) - Project description
    - `category` (text) - Project category
    - `image_url` (text) - Project image
    - `technologies` (text[]) - Array of technologies used
    - `client_name` (text, optional) - Client name
    - `completed_date` (date, optional)
    - `created_at` (timestamp)
  
  3. `pricing_items`
    - `id` (uuid, primary key)
    - `title` (text) - Item name
    - `description` (text) - Item description
    - `price` (integer) - Price in Toman
    - `category` (text) - Category of item
    - `is_active` (boolean) - Whether item is active
    - `created_at` (timestamp)
  
  4. `price_estimates`
    - `id` (uuid, primary key)
    - `customer_name` (text) - Customer name
    - `customer_email` (text) - Customer email
    - `customer_phone` (text) - Customer phone
    - `selected_items` (jsonb) - Array of selected item IDs
    - `total_price` (integer) - Total estimated price
    - `notes` (text, optional) - Additional notes
    - `created_at` (timestamp)
  
  5. `job_applications`
    - `id` (uuid, primary key)
    - `full_name` (text) - Applicant name
    - `email` (text) - Email address
    - `phone` (text) - Phone number
    - `position` (text) - Desired position
    - `experience_years` (integer) - Years of experience
    - `resume_url` (text) - Resume file URL
    - `cover_letter` (text, optional) - Cover letter
    - `status` (text) - Application status
    - `created_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Public read access for services, projects, and pricing_items
  - Public insert for price_estimates and job_applications
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO public
  USING (true);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image_url text,
  technologies text[] DEFAULT '{}',
  client_name text,
  completed_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO public
  USING (true);

-- Create pricing_items table
CREATE TABLE IF NOT EXISTS pricing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing items"
  ON pricing_items FOR SELECT
  TO public
  USING (is_active = true);

-- Create price_estimates table
CREATE TABLE IF NOT EXISTS price_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  selected_items jsonb NOT NULL DEFAULT '[]',
  total_price integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE price_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit price estimates"
  ON price_estimates FOR INSERT
  TO public
  WITH CHECK (true);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  position text NOT NULL,
  experience_years integer DEFAULT 0,
  resume_url text NOT NULL,
  cover_letter text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit job applications"
  ON job_applications FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample services
INSERT INTO services (title, description, icon, display_order) VALUES
  ('توسعه اپلیکیشن موبایل', 'طراحی و توسعه اپلیکیشن‌های Android با کیفیت بالا', 'Smartphone', 1),
  ('طراحی و توسعه وب‌سایت', 'ساخت وب‌سایت‌های مدرن و ریسپانسیو', 'Globe', 2),
  ('نرم‌افزار ویندوز', 'توسعه نرم‌افزارهای دسکتاپ ویندوز', 'Monitor', 3),
  ('سیستم‌های حسابداری و ERP', 'پیاده‌سازی سیستم‌های مدیریت کسب‌وکار', 'Calculator', 4),
  ('پنل ادمین', 'طراحی پنل‌های مدیریتی پیشرفته', 'LayoutDashboard', 5),
  ('طراحی UI/UX', 'طراحی رابط کاربری در Figma', 'Figma', 6);

-- Insert sample projects
INSERT INTO projects (title, description, category, technologies, image_url) VALUES
  ('سیستم مدیریت فروشگاه', 'سیستم جامع مدیریت فروشگاه آنلاین با پنل ادمین پیشرفته', 'Website', ARRAY['React', 'Node.js', 'PostgreSQL'], 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'),
  ('اپلیکیشن موبایل بانکی', 'اپلیکیشن موبایل بانکداری با امکانات کامل', 'Mobile App', ARRAY['React Native', 'TypeScript'], 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg'),
  ('نرم‌افزار حسابداری', 'نرم‌افزار حسابداری ویندوز برای کسب‌وکارهای کوچک', 'Desktop App', ARRAY['C#', '.NET'], 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg');

-- Insert sample pricing items
INSERT INTO pricing_items (title, description, price, category) VALUES
  ('وب‌سایت تک‌صفحه‌ای', 'Landing Page ساده با طراحی مدرن', 15000000, 'Website'),
  ('وب‌سایت شرکتی', 'وب‌سایت چند صفحه‌ای با پنل ادمین', 35000000, 'Website'),
  ('فروشگاه آنلاین', 'فروشگاه کامل با درگاه پرداخت', 60000000, 'Website'),
  ('اپلیکیشن موبایل ساده', 'اپلیکیشن Android با قابلیت‌های پایه', 25000000, 'Mobile'),
  ('اپلیکیشن موبایل پیشرفته', 'اپلیکیشن با قابلیت‌های پیشرفته', 50000000, 'Mobile'),
  ('نرم‌افزار ویندوز', 'نرم‌افزار دسکتاپ سفارشی', 40000000, 'Desktop'),
  ('سیستم ERP', 'سیستم مدیریت منابع سازمانی', 80000000, 'Enterprise'),
  ('پنل ادمین', 'پنل مدیریتی با داشبورد', 20000000, 'Admin'),
  ('طراحی UI/UX', 'طراحی رابط کاربری در Figma', 10000000, 'Design');