'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order, OrderStatus } from '@/types'
import { updateOrderStatus } from '@/lib/actions/orders'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export default function OrdersAdminClient({
  initialOrders,
}: {
  initialOrders: Order[]
}) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [selected, setSelected] = useState<Order | null>(null)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
    if (selected?.id === orderId) {
      setSelected((prev) => (prev ? { ...prev, status } : prev))
    }
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-bc-black">Pedidos</h1>
          <p className="text-sm text-bc-gray-500 mt-1">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
            {pendingCount > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs rounded">
                {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          className="text-[10px] tracking-[2px] uppercase text-bc-gray-500 hover:text-bc-black transition-colors"
        >
          Actualizar
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-[10px] tracking-[1px] uppercase font-light border transition-colors
              ${filter === s
                ? 'border-bc-black bg-bc-black text-bc-white'
                : 'border-bc-gray-200 text-bc-gray-500 hover:border-bc-gray-400'
              }`}
          >
            {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
            {s !== 'all' && (
              <span className="ml-1 opacity-60">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table */}
        <div className="flex-1 bg-white border border-bc-gray-200 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-bc-gray-200 bg-bc-gray-100">
                {['Pedido', 'Fecha', 'Cliente', 'Total', 'Pago', 'Estado'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[9px] tracking-[2px] uppercase text-bc-gray-500 font-normal"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-bc-gray-100">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() =>
                    setSelected(selected?.id === order.id ? null : order)
                  }
                  className={`cursor-pointer hover:bg-bc-gray-100 transition-colors ${
                    selected?.id === order.id ? 'bg-bc-gray-100' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-bc-black">
                    #{order.order_number}
                  </td>
                  <td className="px-4 py-3 text-xs text-bc-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3 font-light text-bc-black">
                    {order.customer_first_name} {order.customer_last_name}
                  </td>
                  <td className="px-4 py-3 font-light text-bc-black">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3 text-xs text-bc-gray-500 uppercase tracking-wide">
                    {order.payment_method === 'mp' ? 'MP' : 'Transfer.'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-[9px] tracking-[1px] uppercase px-2 py-1 rounded border-0 outline-none cursor-pointer ${
                        STATUS_COLORS[order.status]
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-bc-gray-500 text-sm font-light">
              No hay pedidos con este estado.
            </div>
          )}
        </div>

        {/* Order detail */}
        {selected && (
          <div className="w-full lg:w-80 bg-white border border-bc-gray-200 p-5 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-light text-bc-black">
                #{selected.order_number}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-bc-gray-400 hover:text-bc-black"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs font-light text-bc-gray-700">
              <div>
                <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1">
                  Cliente
                </div>
                <div>{selected.customer_first_name} {selected.customer_last_name}</div>
                <div className="text-bc-gray-500">{selected.customer_email}</div>
                <div className="text-bc-gray-500">{selected.customer_phone}</div>
              </div>

              <div>
                <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1">
                  Envío
                </div>
                <div>{selected.shipping_address}</div>
                {selected.shipping_apt && <div>{selected.shipping_apt}</div>}
                <div>{selected.shipping_city}, {selected.shipping_province}</div>
                <div>CP: {selected.shipping_postal}</div>
              </div>

              <div>
                <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                  Productos
                </div>
                <div className="space-y-1.5">
                  {selected.items?.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.product_name}{' '}
                        <span className="text-bc-gray-500">
                          x{item.quantity} ({item.size}/{item.color})
                        </span>
                      </span>
                      <span>{formatPrice(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-bc-gray-200 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-bc-gray-500">Subtotal</span>
                  <span>{formatPrice(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bc-gray-500">Envío</span>
                  <span>
                    {selected.shipping_cost === 0
                      ? 'Gratis'
                      : formatPrice(selected.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-bc-black">
                  <span>Total</span>
                  <span>{formatPrice(selected.total)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-bc-gray-500">Pago</span>
                <span className="uppercase tracking-wide">
                  {selected.payment_method === 'mp' ? 'Mercado Pago' : 'Transferencia'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
