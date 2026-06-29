'use server'

import { Preference } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMpClient, getSiteUrl } from '@/lib/mercadopago'

// Crea la preferencia de Checkout Pro para un pedido ya guardado y devuelve el
// link de pago (init_point). Los montos se leen de la BBDD, no del cliente.
export async function createCheckoutPreference(orderId: string) {
  const client = getMpClient()
  if (!client) {
    return {
      success: false,
      error: 'Mercado Pago no está configurado (falta MP_ACCESS_TOKEN).',
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      error: 'Falta SUPABASE_SERVICE_ROLE_KEY para procesar el pago.',
    }
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return { success: false, error: orderError?.message || 'Pedido no encontrado.' }
  }

  const items = (order.items ?? []).map(
    (it: {
      product_id: string | null
      product_name: string
      quantity: number
      unit_price: number
    }) => ({
      id: it.product_id ?? it.product_name,
      title: it.product_name,
      quantity: it.quantity,
      unit_price: Number(it.unit_price),
      currency_id: 'ARS',
    })
  )

  if (Number(order.shipping_cost) > 0) {
    items.push({
      id: 'shipping',
      title: 'Envío',
      quantity: 1,
      unit_price: Number(order.shipping_cost),
      currency_id: 'ARS',
    })
  }

  const siteUrl = getSiteUrl()
  const isHttps = siteUrl.startsWith('https://')

  try {
    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items,
        external_reference: order.id,
        payer: {
          name: order.customer_first_name,
          surname: order.customer_last_name,
          email: order.customer_email,
        },
        back_urls: {
          success: `${siteUrl}/checkout/resultado?status=success&order=${order.order_number}`,
          failure: `${siteUrl}/checkout/resultado?status=failure&order=${order.order_number}`,
          pending: `${siteUrl}/checkout/resultado?status=pending&order=${order.order_number}`,
        },
        // auto_return solo funciona con back_urls https (no en localhost)
        ...(isHttps ? { auto_return: 'approved' } : {}),
        notification_url: `${siteUrl}/api/mercadopago/webhook`,
        statement_descriptor: 'BLUECHIC',
      },
    })

    const initPoint = result.init_point ?? result.sandbox_init_point
    if (!initPoint) {
      return { success: false, error: 'Mercado Pago no devolvió el link de pago.' }
    }

    await supabase
      .from('orders')
      .update({ mp_preference_id: result.id })
      .eq('id', order.id)

    return { success: true, initPoint }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Error al crear el pago en Mercado Pago.',
    }
  }
}
