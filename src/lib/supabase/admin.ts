import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Cliente con service role: SOLO para contextos server confiables (webhooks,
// pagos). Saltea RLS, así que nunca debe exponerse al cliente.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
