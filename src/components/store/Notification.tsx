'use client'

import { useCartStore } from '@/store/cart'

export default function Notification() {
  const notification = useCartStore((s) => s.notification)

  if (!notification) return null

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] px-5 py-3 text-sm tracking-wide transition-all duration-300
        ${notification.isError
          ? 'bg-red-600 text-white'
          : 'bg-bc-black text-bc-white'
        }`}
    >
      {notification.message}
    </div>
  )
}
