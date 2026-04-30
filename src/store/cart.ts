import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface Notification {
  message: string
  isError: boolean
}

interface CartStore {
  items: CartItem[]
  isCartOpen: boolean
  isCheckoutOpen: boolean
  selectedProduct: Product | null
  isProductModalOpen: boolean
  notification: Notification | null

  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, qty: number) => void
  clearCart: () => void

  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void

  openProduct: (product: Product) => void
  closeProduct: () => void

  showNotification: (message: string, isError?: boolean) => void
  clearNotification: () => void

  subtotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      selectedProduct: null,
      isProductModalOpen: false,
      notification: null,

      addItem: (item) => {
        const { items } = get()
        const existing = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
        )

        if (existing >= 0) {
          const updated = [...items]
          updated[existing].quantity += item.quantity
          set({ items: updated })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (index) => {
        const updated = get().items.filter((_, i) => i !== index)
        set({ items: updated })
      },

      updateQuantity: (index, qty) => {
        const updated = [...get().items]
        if (qty <= 0) {
          updated.splice(index, 1)
        } else {
          updated[index].quantity = qty
        }
        set({ items: updated })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isCartOpen: true, isCheckoutOpen: false }),
      closeCart: () => set({ isCartOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      openProduct: (product) =>
        set({ selectedProduct: product, isProductModalOpen: true }),
      closeProduct: () =>
        set({ selectedProduct: null, isProductModalOpen: false }),

      showNotification: (message, isError = false) => {
        set({ notification: { message, isError } })
        setTimeout(() => set({ notification: null }), 3000)
      },
      clearNotification: () => set({ notification: null }),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'bluechic-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
