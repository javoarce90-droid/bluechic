'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  {
    href: '/admin/productos',
    label: 'Productos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: '/admin/catalogo',
    label: 'Catálogo',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 014 9V4a1 1 0 011-1z" />
      </svg>
    ),
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: '/admin/pagos',
    label: 'Pagos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navLinks = (
    <ul className="space-y-1">
      {NAV.map(({ href, label, icon }) => {
        const isActive = pathname.startsWith(href)
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-light tracking-wide rounded transition-colors
                ${isActive
                  ? 'bg-bc-gray-900 text-bc-white'
                  : 'text-bc-gray-500 hover:text-bc-white hover:bg-bc-gray-900'
                }`}
            >
              {icon}
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Barra superior (mobile) */}
      <div className="md:hidden bg-bc-black text-bc-gray-300 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="font-display text-lg font-light tracking-[3px] uppercase text-bc-white">
            Blue<span className="text-bc-accent">·</span>Chic
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 -mr-2 text-bc-gray-300"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <nav className="px-3 pb-4 border-t border-bc-gray-900">
            <div className="pt-3">{navLinks}</div>
            <div className="mt-4 flex items-center justify-between px-3">
              <Link
                href="/"
                target="_blank"
                className="text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-gray-300"
              >
                Ver tienda
              </Link>
              <button
                onClick={handleLogout}
                className="text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-white"
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-56 bg-bc-black text-bc-gray-300 flex-col min-h-screen">
        <div className="p-6 border-b border-bc-gray-900">
          <div className="font-display text-xl font-light tracking-[4px] uppercase text-bc-white">
            Blue<span className="text-bc-accent">·</span>Chic
          </div>
          <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-700 mt-1">
            Admin
          </div>
        </div>

        <nav className="flex-1 py-6 px-3">
          <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-700 px-3 mb-3">
            Gestión
          </div>
          {navLinks}

          <div className="mt-8 px-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-gray-300 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver tienda
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-bc-gray-900">
          <button
            onClick={handleLogout}
            className="w-full text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-white transition-colors py-2"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
