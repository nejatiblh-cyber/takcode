import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  technologies: string[];
  client_name?: string;
  completed_date?: string;
}

export interface PricingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
}

export interface PriceEstimate {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  selected_items: string[];
  total_price: number;
  notes?: string;
}

export interface JobApplication {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  resume_url: string;
  cover_letter?: string;
}
