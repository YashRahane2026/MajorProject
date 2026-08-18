import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using the service role key.
 * Use ONLY in server-side code (API routes, server actions).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-crimetrack.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-key';

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
