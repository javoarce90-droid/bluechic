'use client'

import { useCartStore } from '@/store/cart'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    openCheckout,
    subtotal,
  } = useCartStore()

  const sub = subtotal()
  const freeShipping = sub >= 200000

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[1500] bg-bc-black/40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-bc-white z-[1600] flex flex-col shadow-2xl transition-transform duration-300
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-bc-gray-200">
          <h2 className="font-display text-2xl font-light text-bc-black">
            Tu carrito
          </h2>
          <button
            onClick={closeCart}
            className="text-bc-gray-500 hover:text-bc-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <svg
                className="w-12 h-12 text-bc-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="font-display text-xl font-light text-bc-gray-500">
                Tu carrito está vacío
              </p>
              <button
                onClick={closeCart}
                className="text-[10px] tracking-[2px] uppercase text-bc-accent hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-bc-gray-100">
              {items.map((item, idx) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-5">
                  {/* Image */}
                  <div className="w-20 h-24 bg-bc-gray-100 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-bc-gray-200" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base font-light text-bc-black mb-1 truncate">
                      {item.productName}
                    </div>
                    <div className="text-[10px] tracking-[1px] uppercase text-bc-gray-500 mb-2">
                      {item.size} / {item.color}
                    </div>
                    <div className="text-sm text-bc-black font-light">
                      {formatPrice(item.price)}
                    </div>

                    {/* Qty + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-bc-gray-200">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-bc-gray-500 hover:text-bc-black border-r border-bc-gray-200 text-sm"
                        >
                          −
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-sm text-bc-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-bc-gray-500 hover:text-bc-black border-l border-bc-gray-200 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-[10px] tracking-[1px] uppercase text-bc-gray-500 hover:text-red-500 transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-bc-gray-200 p-6 space-y-4">
            {freeShipping ? (
              <div className="text-center text-[10px] tracking-[2px] uppercase text-bc-accent">
                ✓ Envío gratis incluido
              </div>
            ) : (
              <div className="text-[11px] text-bc-gray-500 text-center">
                Sumá {formatPrice(200000 - sub)} más para envío gratis
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
                Subtotal
              </span>
              <span className="font-display text-xl font-light text-bc-black">
                {formatPrice(sub)}
              </span>
            </div>

            {!freeShipping && (
              <div className="flex justify-between items-center text-sm text-bc-gray-500 font-light">
                <span>Envío estimado</span>
                <span>{formatPrice(5000)}</span>
              </div>
            )}

            <button
              onClick={openCheckout}
              className="w-full py-4 bg-bc-black text-bc-white text-[11px] tracking-[3px] uppercase font-light hover:bg-bc-accent transition-colors duration-300"
            >
              Continuar con la compra
            </button>

            <button
              onClick={closeCart}
              className="w-full py-2 text-[10px] tracking-[2px] uppercase text-bc-gray-500 hover:text-bc-black transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
