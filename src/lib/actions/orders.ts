'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateOrderInput } from '@/types'

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()

  const subtotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shippingCost = subtotal >= 200000 ? 0 : 5000
  const total = subtotal + shippingCost
  const orderNumber = `BC${Date.now().toString().slice(-6)}`

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'pending',
      customer_first_name: input.firstName,
      customer_last_name: input.lastName,
      customer_email: input.email,
      customer_phone: input.phone,
      shipping_address: input.address,
      shipping_city: input.city,
      shipping_province: input.province,
      shipping_postal: input.postal,
      shipping_apt: input.apt || null,
      payment_method: input.paymentMethod,
      subtotal,
      shipping_cost: shippingCost,
      total,
    })
    .select()
    .single()

  if (orderError) {
    return { success: false, error: orderError.message }
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    unit_price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    return { success: false, error: itemsError.message }
  }

  return { success: true, orderNumber }
}

export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
