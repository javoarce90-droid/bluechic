import { MercadoPagoConfig } from 'mercadopago'

// Devuelve el cliente de Mercado Pago, o null si todavía no se configuró el token.
export function getMpClient(): MercadoPagoConfig | null {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) return null
  return new MercadoPagoConfig({ accessToken })
}

// URL pública del sitio (para back_urls y notification_url del webhook).
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000'
  )
}
