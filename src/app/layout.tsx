import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import TopBar from '@/components/store/TopBar'
import Header from '@/components/store/Header'
import ConditionalFooter from '@/components/store/ConditionalFooter'
import CartDrawer from '@/components/store/CartDrawer'
import ProductModal from '@/components/store/ProductModal'
import CheckoutModal from '@/components/store/CheckoutModal'
import WhatsAppButton from '@/components/store/WhatsAppButton'
import Notification from '@/components/store/Notification'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blue Chic — Moda Femenina',
  description:
    'Ropa femenina con identidad. Prendas seleccionadas para la mujer moderna.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <TopBar />
        <Header />
        {children}
        <ConditionalFooter />
        <CartDrawer />
        <ProductModal />
        <CheckoutModal />
        <WhatsAppButton />
        <Notification />
      </body>
    </html>
  )
}
