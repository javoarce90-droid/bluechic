import { NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { getMpClient } from '@/lib/mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'

// Mapea el estado de Mercado Pago al estado del pedido
function mapStatus(mpStatus?: string): string | null {
  switch (mpStatus) {
    case 'approved':
      return 'confirmed'
    case 'cancelled':
    case 'rejected':
      return 'cancelled'
    default:
      return null // pending / in_process: no tocamos el pedido
  }
}

export async function POST(request: Request) {
  const client = getMpClient()
  const supabase = createAdminClient()
  if (!client || !supabase) {
    // Sin credenciales no podemos procesar; respondemos 200 para que MP no reintente en loop
    return NextResponse.json({ ok: false, reason: 'not_configured' })
  }

  try {
    const url = new URL(request.url)
    let type = url.searchParams.get('type') || url.searchParams.get('topic')
    let paymentId =
      url.searchParams.get('data.id') || url.searchParams.get('id')

    // MP también puede mandar la info en el body
    if (!paymentId) {
      const body = await request.json().catch(() => null)
      if (body) {
        type = type || body.type || body.action
        paymentId = body.data?.id ?? body.id ?? null
      }
    }

    if (!paymentId || (type && !type.includes('payment'))) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    // Consultamos el pago real a MP (no confiamos en el payload)
    const payment = await new Payment(client).get({ id: String(paymentId) })
    const orderId = payment.external_reference
    const newStatus = mapStatus(payment.status)

    if (orderId && newStatus) {
      await supabase
        .from('orders')
        .update({ status: newStatus, mp_payment_id: String(payment.id) })
        .eq('id', orderId)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[mercadopago webhook]', e)
    // 200 igual: evita reintentos infinitos por errores transitorios
    return NextResponse.json({ ok: false })
  }
}
