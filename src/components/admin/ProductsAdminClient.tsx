'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, ProductCategory, ProductCollection, ProductSize } from '@/types'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  upsertVariant,
  deleteVariant,
} from '@/lib/actions/products'

const CATEGORIES: ProductCategory[] = [
  'blazers',
  'bodies',
  'remeras',
  'pantalones',
  'vestidos',
]
const COLLECTIONS: ProductCollection[] = ['juvenil', 'plus30']
const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL']

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function ProductsAdminClient({
  initialProducts,
}: {
  initialProducts: Product[]
}) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('remeras')
  const [collection, setCollection] = useState<ProductCollection>('juvenil')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)

  // Variant form
  const [variantSize, setVariantSize] = useState<ProductSize>('S')
  const [variantColor, setVariantColor] = useState('')
  const [variantStock, setVariantStock] = useState('0')
  const [savingVariant, setSavingVariant] = useState(false)

  function openCreate() {
    setName('')
    setCategory('remeras')
    setCollection('juvenil')
    setPrice('')
    setDescription('')
    setFeatured(false)
    setEditingProduct(null)
    setShowForm(true)
  }

  function openEdit(product: Product) {
    setName(product.name)
    setCategory(product.category)
    setCollection(product.collection)
    setPrice(product.price.toString())
    setDescription(product.description)
    setFeatured(product.featured)
    setEditingProduct(product)
    setShowForm(true)
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name,
      slug: slugify(name),
      category,
      collection,
      price: parseFloat(price),
      description,
      featured,
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload)
    } else {
      await createProduct(payload)
    }

    setSaving(false)
    setShowForm(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    if (selectedProduct?.id === id) setSelectedProduct(null)
  }

  async function handleToggleActive(product: Product) {
    await updateProduct(product.id, { active: !product.active })
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, active: !p.active } : p
      )
    )
  }

  async function handleAddVariant(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProduct) return
    setSavingVariant(true)

    await upsertVariant({
      product_id: selectedProduct.id,
      size: variantSize,
      color: variantColor.trim(),
      stock: parseInt(variantStock),
    })

    setSavingVariant(false)
    setVariantColor('')
    setVariantStock('0')
    router.refresh()
  }

  async function handleDeleteVariant(variantId: string) {
    await deleteVariant(variantId)
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-bc-black">Productos</h1>
          <p className="text-sm text-bc-gray-500 mt-1">
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white border border-bc-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bc-gray-200 bg-bc-gray-100">
                {['Producto', 'Categoría', 'Precio', 'Colección', 'Estado', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[9px] tracking-[2px] uppercase text-bc-gray-500 font-normal"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-bc-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-bc-gray-100 cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id ? 'bg-bc-gray-100' : ''
                  }`}
                  onClick={() =>
                    setSelectedProduct(
                      selectedProduct?.id === product.id ? null : product
                    )
                  }
                >
                  <td className="px-4 py-3 font-light text-bc-black">
                    {product.name}
                    {product.featured && (
                      <span className="ml-2 text-[9px] bg-bc-accent/20 text-bc-accent px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-bc-gray-500 capitalize">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-bc-black font-light">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-bc-gray-500">
                    {product.collection}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleActive(product)
                      }}
                      className={`text-[9px] tracking-[1px] uppercase px-2 py-1 rounded ${
                        product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEdit(product)}
                        className="text-[10px] uppercase tracking-wide text-bc-gray-500 hover:text-bc-black transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-[10px] uppercase tracking-wide text-bc-gray-500 hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="py-16 text-center text-bc-gray-500 text-sm font-light">
              No hay productos. Creá uno con el botón de arriba.
            </div>
          )}
        </div>

        {/* Variant panel */}
        {selectedProduct && (
          <div className="w-72 bg-white border border-bc-gray-200 p-5 flex-shrink-0">
            <h3 className="text-sm font-light text-bc-black mb-1">
              {selectedProduct.name}
            </h3>
            <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-5">
              Stock por variante
            </div>

            {/* Existing variants */}
            {(selectedProduct.variants?.length ?? 0) > 0 ? (
              <div className="space-y-2 mb-5">
                {selectedProduct.variants!.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-bc-gray-100"
                  >
                    <span className="text-bc-gray-700 font-light">
                      {v.size} / {v.color}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-medium ${
                          v.stock === 0
                            ? 'text-red-500'
                            : v.stock <= 3
                              ? 'text-bc-accent'
                              : 'text-green-600'
                        }`}
                      >
                        {v.stock}
                      </span>
                      <button
                        onClick={() => handleDeleteVariant(v.id)}
                        className="text-bc-gray-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-bc-gray-500 font-light mb-5">
                Sin variantes. Agregá talle y color.
              </p>
            )}

            {/* Add variant */}
            <form onSubmit={handleAddVariant} className="space-y-3">
              <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                Agregar / actualizar variante
              </div>
              <div>
                <label className="block text-[9px] tracking-[1px] uppercase text-bc-gray-500 mb-1">
                  Talle
                </label>
                <select
                  value={variantSize}
                  onChange={(e) => setVariantSize(e.target.value as ProductSize)}
                  className="w-full border border-bc-gray-200 px-2 py-1.5 text-xs text-bc-black focus:border-bc-black outline-none"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] tracking-[1px] uppercase text-bc-gray-500 mb-1">
                  Color
                </label>
                <input
                  value={variantColor}
                  onChange={(e) => setVariantColor(e.target.value)}
                  placeholder="ej: Negro"
                  required
                  className="w-full border border-bc-gray-200 px-2 py-1.5 text-xs text-bc-black focus:border-bc-black outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] tracking-[1px] uppercase text-bc-gray-500 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={variantStock}
                  onChange={(e) => setVariantStock(e.target.value)}
                  className="w-full border border-bc-gray-200 px-2 py-1.5 text-xs text-bc-black focus:border-bc-black outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingVariant}
                className="w-full py-2 bg-bc-black text-bc-white text-[9px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors disabled:opacity-50"
              >
                {savingVariant ? 'Guardando...' : 'Guardar variante'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg p-8">
              <h2 className="text-xl font-light text-bc-black mb-6">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                    Nombre
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                      Categoría
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as ProductCategory)
                      }
                      className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none capitalize"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                      Colección
                    </label>
                    <select
                      value={collection}
                      onChange={(e) =>
                        setCollection(e.target.value as ProductCollection)
                      }
                      className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                    >
                      {COLLECTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                    Precio (ARS)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-bc-black"
                  />
                  <span className="text-sm font-light text-bc-gray-700">
                    Producto destacado
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-bc-gray-200 text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-black transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
