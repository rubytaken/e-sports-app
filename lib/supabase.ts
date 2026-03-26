import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Lazy initialization to prevent build-time crashes when env vars are missing
let _supabase: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Return a no-op during build/SSG when env vars are unavailable
        console.warn("Supabase env vars not set, returning no-op client");
        return () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } });
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return (_supabase as any)[prop];
  },
});
