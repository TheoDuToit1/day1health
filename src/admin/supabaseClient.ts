import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseConfigError = hasSupabaseEnv
  ? null
  : 'Supabase environment variables are missing for this environment.';

// Keep the client import-safe so routes can render fallback UI instead of crashing.
export const supabase = createClient(
  hasSupabaseEnv ? supabaseUrl! : 'https://placeholder.supabase.co',
  hasSupabaseEnv ? supabaseAnonKey! : 'placeholder-anon-key',
);
