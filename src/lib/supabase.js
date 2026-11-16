import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchFromSupabase(key, fallback) {
  if (!supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('app_store')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return fallback;
    return JSON.parse(data.value);
  } catch {
    return fallback;
  }
}

export async function syncWithSupabase(key, payload) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('app_store')
      .upsert({ key, value: JSON.stringify(payload) }, { onConflict: 'key' });

    return !error;
  } catch {
    return false;
  }
}
