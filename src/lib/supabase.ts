import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing to prevent White Screen of Death
// This allows the UI to render even if the Auth/DB connection isn't ready.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. App running in UI-only mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
