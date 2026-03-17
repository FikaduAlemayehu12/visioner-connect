
-- Add metadata JSONB column to posts for category-specific fields
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Create subcategories table
CREATE TABLE public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category_id, name)
);

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subcategories viewable by everyone" ON public.subcategories FOR SELECT USING (true);

-- Create category_fields table for dynamic form definitions
CREATE TABLE public.category_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES public.subcategories(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  field_label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text', -- text, number, select, multiselect, checkbox, textarea
  options jsonb, -- for select/multiselect: ["Option1", "Option2"]
  required boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  placeholder text,
  unit text, -- e.g. "GB", "mAh", "sqm"
  show_condition jsonb, -- e.g. {"field": "vehicle_type", "value": "Car"}
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.category_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Category fields viewable by everyone" ON public.category_fields FOR SELECT USING (true);

-- Add subcategory_id to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.subcategories(id);

-- ========== SEED SUBCATEGORIES ==========

-- Electronics subcategories
INSERT INTO public.subcategories (category_id, name, icon) VALUES
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', 'Mobile Phones', '📱'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', 'Laptops & PCs', '💻'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', 'Printers', '🖨️'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', 'Tablets', '📟'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', 'Other Electronics', '🔌');

-- Vehicles subcategories
INSERT INTO public.subcategories (category_id, name, icon) VALUES
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', 'Cars', '🚗'),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', 'Motorcycles', '🏍️'),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', 'Trucks', '🚛'),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', 'Bicycles', '🚲');

-- Real Estate subcategories
INSERT INTO public.subcategories (category_id, name, icon) VALUES
  ('5c4c7701-a9ab-46f3-872f-035177e11933', 'Houses', '🏠'),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', 'Apartments', '🏢'),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', 'Land', '🏞️'),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', 'Commercial', '🏪');

-- Fashion subcategories
INSERT INTO public.subcategories (category_id, name, icon) VALUES
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'Men', '👔'),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'Women', '👗'),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'Kids', '👶'),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'Shoes', '👟'),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'Accessories', '👜');

-- ========== SEED CATEGORY FIELDS ==========

-- Mobile Phones fields
INSERT INTO public.category_fields (category_id, subcategory_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'brand', 'Brand', 'select', '["Samsung","Apple","Huawei","Xiaomi","OnePlus","Google","Realme","Tecno","Infinix","Other"]', true, 1, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'model', 'Model', 'text', null, true, 2, 'e.g. Galaxy S24 Ultra', null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'condition', 'Condition', 'select', '["Brand New","Like New","Good","Fair","For Parts"]', true, 3, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'ram', 'RAM', 'select', '["2","3","4","6","8","12","16"]', false, 4, null, 'GB'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'storage', 'Storage', 'select', '["16","32","64","128","256","512","1024"]', false, 5, null, 'GB'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'battery', 'Battery', 'number', null, false, 6, '5000', 'mAh'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'screen_size', 'Screen Size', 'number', null, false, 7, '6.7', 'inches'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'camera', 'Camera', 'number', null, false, 8, '200', 'MP'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'network', 'Network', 'select', '["4G","5G"]', false, 9, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Mobile Phones'), 'accessories', 'Accessories Included', 'multiselect', '["Charger","Earphones","Case","Screen Protector","Box","Manual"]', false, 10, null, null);

-- Laptops fields
INSERT INTO public.category_fields (category_id, subcategory_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'brand', 'Brand', 'select', '["Apple","Dell","HP","Lenovo","Asus","Acer","MSI","Other"]', true, 1, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'model', 'Model', 'text', null, true, 2, 'e.g. MacBook Pro 14', null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'processor', 'Processor', 'select', '["Intel i3","Intel i5","Intel i7","Intel i9","AMD Ryzen 3","AMD Ryzen 5","AMD Ryzen 7","AMD Ryzen 9","Apple M1","Apple M2","Apple M3","Other"]', true, 3, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'ram', 'RAM', 'select', '["4","8","16","32","64"]', true, 4, null, 'GB'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'storage', 'Storage', 'select', '["128 SSD","256 SSD","512 SSD","1TB SSD","1TB HDD","2TB HDD"]', true, 5, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'graphics_card', 'Graphics Card', 'text', null, false, 6, 'e.g. RTX 4060', null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'screen_size', 'Screen Size', 'number', null, false, 7, '15.6', 'inches'),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Laptops & PCs'), 'condition', 'Condition', 'select', '["Brand New","Like New","Good","Fair","For Parts"]', true, 8, null, null);

-- Printers fields
INSERT INTO public.category_fields (category_id, subcategory_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Printers'), 'brand', 'Brand', 'select', '["HP","Canon","Epson","Brother","Samsung","Other"]', true, 1, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Printers'), 'model', 'Model', 'text', null, true, 2, 'e.g. HP LaserJet Pro', null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Printers'), 'printer_type', 'Type', 'select', '["Thermal","Inkjet","Laser","Dot Matrix"]', true, 3, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Printers'), 'connectivity', 'Connectivity', 'multiselect', '["USB","WiFi","Bluetooth","Ethernet"]', false, 4, null, null),
  ('b11232fe-006e-42db-98b1-61b1c9a045ac', (SELECT id FROM subcategories WHERE name='Printers'), 'condition', 'Condition', 'select', '["Brand New","Like New","Good","Fair"]', true, 5, null, null);

-- Vehicles (Cars)
INSERT INTO public.category_fields (category_id, subcategory_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'brand', 'Brand', 'select', '["Toyota","Honda","Mercedes","BMW","Hyundai","Kia","Suzuki","Nissan","Mitsubishi","Ford","Other"]', true, 1, null, null),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'model', 'Model', 'text', null, true, 2, 'e.g. Corolla', null),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'year', 'Year', 'number', null, true, 3, '2023', null),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'mileage', 'Mileage', 'number', null, false, 4, '50000', 'km'),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'fuel_type', 'Fuel Type', 'select', '["Petrol","Diesel","Electric","Hybrid","LPG"]', true, 5, null, null),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'transmission', 'Transmission', 'select', '["Automatic","Manual","CVT"]', true, 6, null, null),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'engine_capacity', 'Engine Capacity', 'number', null, false, 7, '2000', 'cc'),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'condition', 'Condition', 'select', '["Brand New","Excellent","Good","Fair","Needs Repair"]', true, 8, null, null),
  ('0b51c19b-8af4-4cbc-ab5b-b070ab37f442', (SELECT id FROM subcategories WHERE name='Cars'), 'color', 'Color', 'text', null, false, 9, 'e.g. White', null);

-- Real Estate (Houses)
INSERT INTO public.category_fields (category_id, subcategory_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'property_type', 'Property Type', 'select', '["Villa","Bungalow","Townhouse","Duplex","Other"]', true, 1, null, null),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'size', 'Size', 'number', null, true, 2, '200', 'sqm'),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'bedrooms', 'Bedrooms', 'select', '["1","2","3","4","5","6+"]', true, 3, null, null),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'bathrooms', 'Bathrooms', 'select', '["1","2","3","4+"]', true, 4, null, null),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'parking', 'Parking', 'select', '["None","1 Car","2 Cars","3+ Cars","Garage"]', false, 5, null, null),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'utilities', 'Utilities', 'multiselect', '["Water","Electricity","Gas","Internet","Generator"]', false, 6, null, null),
  ('5c4c7701-a9ab-46f3-872f-035177e11933', (SELECT id FROM subcategories WHERE name='Houses'), 'ownership', 'Ownership', 'select', '["For Sale","For Rent","Lease"]', true, 7, null, null);

-- Jobs fields
INSERT INTO public.category_fields (category_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'company_name', 'Company Name', 'text', null, false, 1, 'e.g. Ethio Telecom', null),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'job_type', 'Job Type', 'select', '["Full-time","Part-time","Contract","Remote","Internship","Freelance"]', true, 2, null, null),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'salary_min', 'Salary Min', 'number', null, false, 3, '5000', 'ETB'),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'salary_max', 'Salary Max', 'number', null, false, 4, '25000', 'ETB'),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'experience', 'Experience Required', 'select', '["No Experience","1-2 Years","3-5 Years","5+ Years","10+ Years"]', false, 5, null, null),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'skills', 'Skills Required', 'multiselect', '["Communication","Leadership","Technical","Sales","Marketing","Design","Programming","Accounting","Customer Service"]', false, 6, null, null),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'deadline', 'Application Deadline', 'text', null, false, 7, 'e.g. 2026-04-30', null),
  ('9230aa1f-297f-47d9-a724-5988ae2290c3', 'apply_method', 'How to Apply', 'select', '["Email","Phone","In Person","Website","Through App"]', false, 8, null, null);

-- Services fields
INSERT INTO public.category_fields (category_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('616d66e5-2f7e-4877-875a-ae00f2388bc7', 'service_category', 'Service Type', 'select', '["IT & Tech","Cleaning","Repair","Plumbing","Electrical","Tutoring","Delivery","Beauty","Legal","Other"]', true, 1, null, null),
  ('616d66e5-2f7e-4877-875a-ae00f2388bc7', 'price_type', 'Price Type', 'select', '["Fixed","Hourly","Daily","Project-based","Negotiable"]', true, 2, null, null),
  ('616d66e5-2f7e-4877-875a-ae00f2388bc7', 'availability', 'Availability', 'select', '["Available Now","Weekdays","Weekends","By Appointment"]', false, 3, null, null),
  ('616d66e5-2f7e-4877-875a-ae00f2388bc7', 'coverage', 'Service Coverage', 'text', null, false, 4, 'e.g. Addis Ababa and surrounding', null);

-- Fashion fields (general for all fashion subcategories)
INSERT INTO public.category_fields (category_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'clothing_type', 'Type', 'select', '["Shirt","T-Shirt","Dress","Pants","Jeans","Jacket","Shoes","Sneakers","Traditional","Other"]', true, 1, null, null),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'size', 'Size', 'select', '["XS","S","M","L","XL","XXL","XXXL","28","30","32","34","36","38","40","42","44"]', false, 2, null, null),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'color', 'Color', 'text', null, false, 3, 'e.g. Black', null),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'material', 'Material', 'text', null, false, 4, 'e.g. Cotton', null),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'brand', 'Brand', 'text', null, false, 5, 'e.g. Nike', null),
  ('d09368e8-0317-4114-80ec-a0492c09efb5', 'condition', 'Condition', 'select', '["Brand New","Like New","Good","Fair"]', true, 6, null, null);

-- Home & Garden fields
INSERT INTO public.category_fields (category_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('966a6935-193e-4564-b8a1-f87a4d93cd16', 'item_category', 'Category', 'select', '["Furniture","Kitchen","Outdoor","Decor","Tools","Appliances","Other"]', true, 1, null, null),
  ('966a6935-193e-4564-b8a1-f87a4d93cd16', 'material', 'Material', 'text', null, false, 2, 'e.g. Wood', null),
  ('966a6935-193e-4564-b8a1-f87a4d93cd16', 'dimensions', 'Dimensions', 'text', null, false, 3, 'e.g. 120x60x75 cm', null),
  ('966a6935-193e-4564-b8a1-f87a4d93cd16', 'condition', 'Condition', 'select', '["Brand New","Like New","Good","Fair"]', true, 4, null, null);

-- Sports fields
INSERT INTO public.category_fields (category_id, field_name, field_label, field_type, options, required, sort_order, placeholder, unit) VALUES
  ('13784c57-7578-49c4-860b-4a9d9adbc27b', 'item_type', 'Item Type', 'select', '["Equipment","Clothing","Shoes","Accessories","Other"]', true, 1, null, null),
  ('13784c57-7578-49c4-860b-4a9d9adbc27b', 'sport', 'Sport', 'select', '["Football","Basketball","Tennis","Running","Gym","Swimming","Cycling","Other"]', false, 2, null, null),
  ('13784c57-7578-49c4-860b-4a9d9adbc27b', 'brand', 'Brand', 'text', null, false, 3, 'e.g. Nike', null),
  ('13784c57-7578-49c4-860b-4a9d9adbc27b', 'condition', 'Condition', 'select', '["Brand New","Like New","Good","Fair"]', true, 4, null, null);
