/**
 * DAYFLOW HRMS — Supabase Client
 *
 * Single shared Supabase client instance.
 * Uses the anon/publishable key — safe for frontend use.
 * All data access is governed by Row Level Security policies.
 *
 * The service_role key is NEVER imported here.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[DAYFLOW] Missing Supabase environment variables.\n' +
    'Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persist session in localStorage — standard Supabase behaviour
    // Authorization decisions are still enforced server-side via RLS.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
