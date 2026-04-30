import { createClient } from '@/lib/supabase/server'
import OrdersAdminClient from '@/components/admin/OrdersAdminClient'
import type { Order } from '@/types'

export const dynamic = 'force-dynamic'

export default async function PedidosAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })

  return <OrdersAdminClient initialOrders={(data as Order[]) ?? []} />
}
