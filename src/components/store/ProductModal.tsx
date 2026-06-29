'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import type { ProductSize } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ProductModal() {
  const { selectedProduct, isProductModalOpen, closeProduct, addItem, showNotification } =
    useCartStore()

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [shownId, setShownId] = useState<string | null>(null)

  // Reinicia la selección al abrir un producto distinto (o al cerrar), sin usar un efecto.
  const activeId = isProductModalOpen ? selectedProduct?.id ?? null : null
  if (activeId !== shownId) {
    setShownId(activeId)
    setSelectedSize(null)
    setSelectedColor(null)
    setQty(1)
  }

  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeProduct()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeProduct])

  if (!isProductModalOpen || !selectedProduct) return null

  const product = selectedProduct
  const uniqueSizes = [
    ...new Set(product.variants?.map((v) => v.size) ?? []),
  ] as ProductSize[]
  const uniqueColors = [
    ...new Set(product.variants?.map((v) => v.color) ?? []),
  ]

  const getStock = (size: ProductSize | null, color: string | null) => {
    if (!size || !color) return null
    const variant = product.variants?.find(
      (v) => v.size === size && v.color === color
    )
    return variant ? variant.stock : 0
  }

  const currentStock = getStock(selectedSize, selectedColor)
  const canAdd = selectedSize && selectedColor && currentStock !== null && currentStock > 0

  function handleAdd() {
    if (!canAdd || !selectedSize || !selectedColor) return

    const variant = product.variants?.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    )

    addItem({
      productId: product.id,
      variantId: variant?.id ?? '',
      productName: product.name,
      price: product.price,
      image: product.images[0] ?? '',
      size: selectedSize,
      color: selectedColor,
      quantity: qty,
    })

    showNotification(`${product.name} agregado al carrito`)
    closeProduct()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[2000] bg-bc-black/60 backdrop-blur-sm"
        onClick={closeProduct}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4">
        <div className="bg-bc-white w-full max-w-3xl max-h-[90vh] overflow-y-auto grid md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square md:aspect-auto bg-bc-gray-100 relative">
            {product.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-bc-gray-100 to-bc-gray-200 flex items-center justify-center">
                <span className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
                  Sin imagen
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1">
                    {product.category}
                  </div>
                  <h2 className="font-display text-3xl font-light text-bc-black">
                    {product.name}
                  </h2>
                </div>
                <button
                  onClick={closeProduct}
                  className="text-bc-gray-500 hover:text-bc-black transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="font-display text-2xl font-light text-bc-black mb-6">
                {formatPrice(product.price)}
              </div>

              {product.description && (
                <p className="text-bc-gray-500 text-sm font-light leading-relaxed tracking-wide mb-6">
                  {product.description}
                </p>
              )}

              {/* Size selector */}
              {uniqueSizes.length > 0 && (
                <div className="mb-5">
                  <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-3">
                    Talle
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {uniqueSizes.map((size) => {
                      const sizeStock = product.variants
                        ?.filter((v) => v.size === size && (!selectedColor || v.color === selectedColor))
                        .reduce((sum, v) => sum + v.stock, 0) ?? 0
                      const isAvailable = sizeStock > 0

                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`w-11 h-11 text-[11px] font-light tracking-wide border transition-colors
                            ${selectedSize === size
                              ? 'bg-bc-black text-bc-white border-bc-black'
                              : isAvailable
                                ? 'border-bc-gray-300 text-bc-gray-700 hover:border-bc-black hover:text-bc-black'
                                : 'border-bc-gray-200 text-bc-gray-300 line-through cursor-not-allowed'
                            }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {uniqueColors.length > 0 && (
                <div className="mb-5">
                  <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-3">
                    Color
                    {selectedColor && (
                      <span className="ml-2 text-bc-black normal-case">
                        — {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {uniqueColors.map((color) => {
                      const colorStock = product.variants
                        ?.filter((v) => v.color === color && (!selectedSize || v.size === selectedSize))
                        .reduce((sum, v) => sum + v.stock, 0) ?? 0
                      const isAvailable = colorStock > 0

                      return (
                        <button
                          key={color}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          disabled={!isAvailable}
                          title={color}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? 'border-bc-black scale-110'
                              : isAvailable
                                ? 'border-bc-gray-300 hover:border-bc-gray-700'
                                : 'border-bc-gray-200 opacity-40 cursor-not-allowed'
                          }`}
                          style={{ backgroundColor: colorToHex(color) }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Stock info */}
              {currentStock !== null && (
                <div className="text-[11px] tracking-wide mb-5">
                  {currentStock === 0 ? (
                    <span className="text-red-500">Sin stock en esta combinación</span>
                  ) : currentStock <= 3 ? (
                    <span className="text-bc-accent">¡Últimas {currentStock} unidades!</span>
                  ) : (
                    <span className="text-bc-gray-500">Disponible</span>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-3">
                  Cantidad
                </div>
                <div className="flex items-center gap-0 w-fit border border-bc-gray-300">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-bc-gray-700 hover:text-bc-black border-r border-bc-gray-300"
                  >
                    −
                  </button>
                  <span className="w-9 h-9 flex items-center justify-center text-sm text-bc-black">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) =>
                        currentStock ? Math.min(currentStock, q + 1) : q + 1
                      )
                    }
                    className="w-9 h-9 flex items-center justify-center text-bc-gray-700 hover:text-bc-black border-l border-bc-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`w-full py-4 text-[11px] tracking-[3px] uppercase font-light transition-colors
                ${canAdd
                  ? 'bg-bc-black text-bc-white hover:bg-bc-accent'
                  : 'bg-bc-gray-200 text-bc-gray-500 cursor-not-allowed'
                }`}
            >
              {!selectedSize || !selectedColor
                ? 'Seleccioná talle y color'
                : !canAdd
                  ? 'Sin stock'
                  : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </>
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
    nude: '#d4a574',
    verde: '#4caf50',
    rojo: '#f44336',
    azul: '#2196f3',
    rosa: '#e91e63',
  }
  return map[colorName.toLowerCase()] ?? '#9e9e9e'
}
