'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import type { Product, ProductCategory, ProductCollection } from '@/types'

type Filter = 'all' | ProductCategory | ProductCollection

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'juvenil', label: 'Juvenil' },
  { id: 'plus30', label: '+30' },
  { id: 'blazers', label: 'Blazers' },
  { id: 'remeras', label: 'Remeras' },
  { id: 'pantalones', label: 'Pantalones' },
  { id: 'bodies', label: 'Bodies' },
  { id: 'vestidos', label: 'Vestidos' },
]

export default function CollectionSection({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered =
    activeFilter === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category === activeFilter || p.collection === activeFilter
        )

  return (
    <section id="coleccion" className="py-20 px-6 bg-bc-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] tracking-[4px] uppercase text-bc-accent font-light mb-3">
              Temporada 2026
            </div>
            <h2 className="font-display text-5xl font-light text-bc-black">
              Nuestra colección
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-0 border-b border-bc-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 text-[10px] tracking-[2px] uppercase font-light transition-all border-b-2 -mb-px
                  ${
                    activeFilter === tab.id
                      ? 'border-bc-black text-bc-black'
                      : 'border-transparent text-bc-gray-500 hover:text-bc-black'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-display text-3xl font-light text-bc-gray-300">
              Próximamente
            </p>
            <p className="text-bc-gray-500 text-sm mt-3 tracking-wide">
              Estamos preparando nuevas prendas para vos
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
