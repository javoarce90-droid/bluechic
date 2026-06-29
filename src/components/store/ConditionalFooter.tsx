'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  // No mostrar el footer de la tienda en el panel admin (logueado o no)
  if (pathname.startsWith('/admin')) return null
  return <Footer />
}
