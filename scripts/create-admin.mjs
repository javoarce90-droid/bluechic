// Crea un usuario admin en Supabase Auth (no elimina los existentes).
// Uso: node --env-file=.env.local scripts/create-admin.mjs <email> <password>
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const [, , email, password] = process.argv

if (!url || !serviceKey) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}
if (!email || !password) {
  console.error('Uso: node --env-file=.env.local scripts/create-admin.mjs <email> <password>')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // confirmado, listo para loguear
})

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
console.log('✓ Usuario admin creado:', data.user.email, '(id:', data.user.id + ')')
