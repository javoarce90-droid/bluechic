'use client'

import { useCartStore } from '@/store/cart'
import type { Product } from '@/types'

const CATEGORY_LABEL: Record<string, string> = {
  blazers: 'Blazer',
  bodies: 'Body',
  remeras: 'Remera',
  pantalones: 'Pantalón',
  vestidos: 'Vestido',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}

function getTotalStock(product: Product) {
  if (!product.variants) return 0
  return product.variants.reduce((sum, v) => sum + v.stock, 0)
}

export default function ProductCard({ product }: { product: Product }) {
  const openProduct = useCartStore((s) => s.openProduct)
  const totalStock = getTotalStock(product)
  const isSoldOut = totalStock === 0
  const isLowStock = totalStock > 0 && totalStock <= 5

  const uniqueColors = [
    ...new Set(product.variants?.map((v) => v.color) ?? []),
  ]

  return (
    <article className="group relative bg-bc-gray-100 overflow-hidden cursor-pointer">
      {/* Badges */}
      {isSoldOut && (
        <span className="absolute top-3 left-3 z-10 bg-bc-gray-700 text-bc-white text-[9px] tracking-[2px] uppercase px-2.5 py-1">
          Agotado
        </span>
      )}
      {isLowStock && (
        <span className="absolute top-3 left-3 z-10 bg-bc-accent text-bc-white text-[9px] tracking-[2px] uppercase px-2.5 py-1">
          Últimas {totalStock}
        </span>
      )}

      {/* Image area */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        onClick={() => !isSoldOut && openProduct(product)}
      >
        {product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bc-gray-200 to-bc-gray-300 flex items-center justify-center">
            <span className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
              {CATEGORY_LABEL[product.category]}
            </span>
          </div>
        )}

        {/* Quick add overlay */}
        {!isSoldOut && (
          <div className="absolute bottom-0 left-0 right-0 bg-bc-black text-bc-white text-center py-3 text-[10px] tracking-[3px] uppercase font-light translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            Ver producto
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className="p-4"
        onClick={() => !isSoldOut && openProduct(product)}
      >
        <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1">
          {CATEGORY_LABEL[product.category]}
        </div>
        <div className="font-display text-lg font-light text-bc-black leading-tight mb-2">
          {product.name}
        </div>

        {/* Color dots */}
        {uniqueColors.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {uniqueColors.slice(0, 5).map((color) => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-bc-gray-300"
                title={color}
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-bc-black text-sm font-light tracking-wide">
            {formatPrice(product.price)}
          </span>
          {isSoldOut && (
            <span className="text-[9px] tracking-[1px] uppercase text-bc-gray-500">
              Sin stock
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function colorToHex(colorName: string): string {
  const map: Record<string, string> = {
    negro: '#1a1a1a',
    blanco: '#f5f5f5',
    gris: '#9e9e9e',
    'gris oscuro': '#4a4a4a',
    plateado: '#c0c0c0',
    beige: '#d4b896',
    camel: '#c19a6b',
    verde: '#4caf50',
    rojo: '#f44336',
    azul: '#2196f3',
    rosa: '#e91e63',
    nude: '#d4a574',
  }
  return map[colorName.toLowerCase()] ?? '#9e9e9e'
}
