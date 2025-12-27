/*
  # Create Packages Table and Add More Pricing Items

  1. New Tables
    - `packages`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `badge` (text, optional - e.g., "پرفروش", "پیشنهادی")
      - `discount_percentage` (integer, optional)
      - `included_items` (uuid array - references pricing_items)
      - `display_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. New Pricing Items
    - Adding 15+ new items across all categories
    - More detailed feature breakdowns

  3. Security
    - Enable RLS on `packages` table
    - Add policies for public read access
*/

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  badge text,
  discount_percentage integer DEFAULT 0,
  included_items uuid[] NOT NULL DEFAULT '{}',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view active packages"
  ON packages
  FOR SELECT
  USING (is_active = true);

-- Add more pricing items
INSERT INTO pricing_items (title, description, price, category, is_active) VALUES
  -- Website items
  ('صفحه فرود (Landing Page)', 'طراحی و توسعه صفحه فرود حرفه‌ای با انیمیشن', 15000000, 'Website', true),
  ('فروشگاه آنلاین ساده', 'فروشگاه با سبد خرید و درگاه پرداخت', 45000000, 'Website', true),
  ('فروشگاه آنلاین پیشرفته', 'با پنل ادمین، مدیریت موجودی و گزارشات', 85000000, 'Website', true),
  ('وب‌اپلیکیشن (PWA)', 'اپلیکیشن وب پیشرفته قابل نصب', 35000000, 'Website', true),
  ('سیستم رزرواسیون آنلاین', 'رزرو نوبت، تقویم و پرداخت آنلاین', 55000000, 'Website', true),
  ('پلتفرم آموزشی (LMS)', 'سیستم مدیریت یادگیری با ویدیو و آزمون', 95000000, 'Website', true),
  ('شبکه اجتماعی ساده', 'پروفایل، پست، کامنت و لایک', 120000000, 'Website', true),
  
  -- Mobile items
  ('اپلیکیشن تک پلتفرم', 'فقط Android یا iOS', 55000000, 'Mobile', true),
  ('اپلیکیشن چند پلتفرم', 'Android و iOS با React Native', 85000000, 'Mobile', true),
  ('اپلیکیشن با API پیشرفته', 'اتصال به سرویس‌های خارجی و نقشه', 105000000, 'Mobile', true),
  ('اپلیکیشن با پوش نوتیفیکیشن', 'اعلان‌های Real-time', 15000000, 'Mobile', true),
  ('اپلیکیشن با پرداخت درون‌برنامه‌ای', 'In-App Purchase', 25000000, 'Mobile', true),
  
  -- Desktop items  
  ('نرم‌افزار مدیریت انبار', 'ورود، خروج، موجودی و گزارشات', 65000000, 'Desktop', true),
  ('نرم‌افزار حسابداری', 'دفترکل، تراز، اسناد حسابداری', 95000000, 'Desktop', true),
  ('نرم‌افزار CRM', 'مدیریت مشتریان و فروش', 75000000, 'Desktop', true),
  
  -- Enterprise items
  ('سیستم ERP ساده', 'مدیریت منابع سازمانی پایه', 250000000, 'Enterprise', true),
  ('سیستم ERP پیشرفته', 'تمام ماژول‌های سازمانی', 500000000, 'Enterprise', true),
  ('سیستم مدیریت پروژه', 'تسک منیجر، تایم‌لاین، گزارشات', 85000000, 'Enterprise', true),
  ('پورتال سازمانی', 'داشبورد، احراز هویت، نقش‌ها', 120000000, 'Enterprise', true),
  
  -- Admin items
  ('پنل ادمین ساده', 'CRUD عملیات پایه', 25000000, 'Admin', true),
  ('پنل ادمین پیشرفته', 'با داشبورد، نمودار و آمار', 45000000, 'Admin', true),
  ('سیستم مدیریت محتوا (CMS)', 'مدیریت کامل محتوای سایت', 55000000, 'Admin', true),
  
  -- Design items
  ('طراحی رابط کاربری (UI)', 'طراحی صفحات در Figma', 20000000, 'Design', true),
  ('طراحی تجربه کاربری (UX)', 'تحقیق، پرسونا، User Journey', 30000000, 'Design', true),
  ('برندینگ کامل', 'لوگو، راهنمای برند، رنگ‌بندی', 35000000, 'Design', true),
  ('موشن گرافیک', 'انیمیشن و ویدیوهای تبلیغاتی', 25000000, 'Design', true),
  
  -- Additional services
  ('هاست و دامین (سالانه)', 'سرور و دامین برای یک سال', 5000000, 'Additional', true),
  ('پشتیبانی ماهانه', 'پشتیبانی فنی و به‌روزرسانی', 8000000, 'Additional', true),
  ('سئو و بهینه‌سازی', 'بهینه‌سازی موتورهای جستجو', 15000000, 'Additional', true),
  ('امنیت و SSL', 'گواهی SSL و امن‌سازی', 7000000, 'Additional', true)
ON CONFLICT DO NOTHING;

-- Insert predefined packages
INSERT INTO packages (title, description, badge, discount_percentage, included_items, display_order) VALUES
  (
    'پکیج استارتاپ',
    'مناسب برای کسب‌وکارهای نوپا و استارتاپ‌ها',
    'پرفروش',
    15,
    (SELECT ARRAY_AGG(id) FROM pricing_items WHERE title IN ('صفحه فرود (Landing Page)', 'طراحی رابط کاربری (UI)', 'هاست و دامین (سالانه)')),
    1
  ),
  (
    'پکیج کسب‌وکار',
    'برای کسب‌وکارهای در حال رشد با نیازهای متوسط',
    'پیشنهادی',
    20,
    (SELECT ARRAY_AGG(id) FROM pricing_items WHERE title IN ('فروشگاه آنلاین ساده', 'پنل ادمین پیشرفته', 'طراحی رابط کاربری (UI)', 'هاست و دامین (سالانه)', 'پشتیبانی ماهانه')),
    2
  ),
  (
    'پکیج حرفه‌ای',
    'راهکار کامل برای کسب‌وکارهای بزرگ',
    'پرقدرت',
    25,
    (SELECT ARRAY_AGG(id) FROM pricing_items WHERE title IN ('فروشگاه آنلاین پیشرفته', 'اپلیکیشن چند پلتفرم', 'پنل ادمین پیشرفته', 'طراحی تجربه کاربری (UX)', 'برندینگ کامل', 'هاست و دامین (سالانه)', 'پشتیبانی ماهانه', 'سئو و بهینه‌سازی')),
    3
  );
