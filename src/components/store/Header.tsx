'use client'

import { useCartStore } from '@/store/cart'

const NAV_ITEMS = [
  {
    label: 'Catálogo',
    sections: [
      {
        title: 'Temporada 2026',
        links: [
          { label: 'Ver todo', href: '#coleccion' },
          { label: 'Remeras', href: '#coleccion' },
          { label: 'Pantalones', href: '#coleccion' },
          { label: 'Blazers', href: '#coleccion' },
          { label: 'Bodies', href: '#coleccion' },
          { label: 'Vestidos', href: '#coleccion' },
        ],
      },
      {
        title: 'Por colección',
        links: [
          { label: 'Juvenil', href: '#coleccion' },
          { label: '+30', href: '#coleccion' },
        ],
      },
    ],
  },
]

const SIMPLE_LINKS = [
  { label: 'Colecciones', href: '#coleccion' },
  { label: 'Nosotras', href: '#sobre-mi' },
  { label: 'Contacto', href: '#contacto' },
]

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Header() {
  const { openCart, itemCount } = useCartStore()
  const count = itemCount()

  return (
    <header className="sticky top-0 z-[1000] bg-bc-white/95 backdrop-blur-md border-b border-bc-gray-200">
      <div className="flex items-center justify-between px-10 h-[72px] max-w-[1400px] mx-auto">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('#inicio')
          }}
          className="font-display text-[28px] font-light tracking-[6px] uppercase text-bc-black hover:opacity-80 transition-opacity"
        >
          Blue<span className="text-bc-accent">·</span>Chic
        </a>

        {/* Nav */}
        <nav className="flex items-center">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative group">
              <button className="px-[18px] h-[72px] flex items-center text-[10px] tracking-[2.5px] uppercase font-normal text-bc-gray-700 hover:text-bc-black transition-colors">
                {item.label}
                <svg
                  className="ml-1 w-3 h-3 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="absolute top-full left-0 bg-bc-white border border-bc-gray-200 border-t-2 border-t-bc-black min-w-[220px] opacity-0 pointer-events-none -translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-200 z-[2000] py-4">
                {item.sections.map((section) => (
                  <div key={section.title} className="px-6 py-1">
                    <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-300 font-normal mb-2">
                      {section.title}
                    </div>
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollTo(link.href)
                        }}
                        className="block py-1 text-[11px] text-bc-gray-700 hover:text-bc-black hover:pl-1 transition-all duration-150 tracking-wide"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {SIMPLE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(link.href)
              }}
              className="px-[18px] h-[72px] flex items-center text-[10px] tracking-[2.5px] uppercase font-normal text-bc-gray-700 hover:text-bc-black transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button
            onClick={openCart}
            className="relative cursor-pointer p-2 text-bc-black hover:scale-110 transition-transform"
            aria-label="Carrito"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-bc-black text-bc-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-body">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
