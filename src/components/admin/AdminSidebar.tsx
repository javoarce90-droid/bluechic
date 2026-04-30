'use client'

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
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 bg-bc-black text-bc-gray-300 flex flex-col min-h-screen">
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
        <ul className="space-y-1">
          {NAV.map(({ href, label, icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
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
  )
}
