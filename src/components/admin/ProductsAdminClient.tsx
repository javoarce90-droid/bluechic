'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Category, Collection, Color } from '@/types'
import { slugify } from '@/lib/slug'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  replaceVariants,
} from '@/lib/actions/products'
import {
  createCategory,
  createCollection,
  createColor,
} from '@/lib/actions/taxonomy'
import { uploadProductImage } from '@/lib/actions/storage'
import ImportCsvModal from './ImportCsvModal'
import BulkImageUploadModal from './BulkImageUploadModal'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

function variantKey(size: string, color: string) {
  return `${size}|||${color}`
}

export default function ProductsAdminClient({
  initialProducts,
  initialCategories,
  initialCollections,
  initialColors,
}: {
  initialProducts: Product[]
  initialCategories: Category[]
  initialCollections: Collection[]
  initialColors: Color[]
}) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState(initialCategories)
  const [collections, setCollections] = useState(initialCollections)
  const [colors, setColors] = useState(initialColors)

  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showBulkImages, setShowBulkImages] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [collection, setCollection] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [sizeInput, setSizeInput] = useState('')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [stock, setStock] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Modal de alta rápida (categoría / colección / color)
  const [quickAdd, setQuickAdd] = useState<
    'category' | 'collection' | 'color' | null
  >(null)
  const [quickName, setQuickName] = useState('')
  const [quickHex, setQuickHex] = useState('#000000')
  const [quickSaving, setQuickSaving] = useState(false)

  function resetForm() {
    setName('')
    setCategory(categories[0]?.slug ?? '')
    setCollection(collections[0]?.slug ?? '')
    setPrice('')
    setDescription('')
    setFeatured(false)
    setImages([])
    setSizes([])
    setSizeInput('')
    setSelectedColors([])
    setStock({})
    setError('')
  }

  function openCreate() {
    resetForm()
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
    setImages(product.images ?? [])

    const vSizes = [...new Set((product.variants ?? []).map((v) => v.size))]
    const vColors = [...new Set((product.variants ?? []).map((v) => v.color))]
    const grid: Record<string, string> = {}
    for (const v of product.variants ?? []) {
      grid[variantKey(v.size, v.color)] = v.stock.toString()
    }
    setSizes(vSizes)
    setSelectedColors(vColors)
    setStock(grid)
    setSizeInput('')
    setError('')
    setEditingProduct(product)
    setShowForm(true)
  }

  // ─── Talles (texto libre) ───────────────────────────────────────────────────
  function addSize() {
    const s = sizeInput.trim()
    if (!s || sizes.includes(s)) {
      setSizeInput('')
      return
    }
    setSizes((prev) => [...prev, s])
    setSizeInput('')
  }

  function removeSize(s: string) {
    setSizes((prev) => prev.filter((x) => x !== s))
  }

  function toggleColor(colorName: string) {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    )
  }

  // ─── Altas inline (modal propio) ────────────────────────────────────────────
  function openQuickAdd(type: 'category' | 'collection' | 'color') {
    setQuickName('')
    setQuickHex('#000000')
    setQuickAdd(type)
  }

  async function handleQuickAddSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quickName.trim()) return
    setQuickSaving(true)
    setError('')

    if (quickAdd === 'category') {
      const res = await createCategory(quickName)
      if (!res.success) {
        setQuickSaving(false)
        return setError(res.error || 'Error al crear categoría')
      }
      setCategories((prev) => [...prev, res.category!])
      setCategory(res.category!.slug)
    } else if (quickAdd === 'collection') {
      const res = await createCollection(quickName)
      if (!res.success) {
        setQuickSaving(false)
        return setError(res.error || 'Error al crear colección')
      }
      setCollections((prev) => [...prev, res.collection!])
      setCollection(res.collection!.slug)
    } else if (quickAdd === 'color') {
      const res = await createColor(quickName, quickHex)
      if (!res.success) {
        setQuickSaving(false)
        return setError(res.error || 'Error al crear color')
      }
      setColors((prev) => [...prev, res.color!])
      setSelectedColors((prev) => [...prev, res.color!.name])
    }

    setQuickSaving(false)
    setQuickAdd(null)
  }

  // ─── Imágenes ───────────────────────────────────────────────────────────────
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadProductImage(fd)
      if (res.success && res.url) {
        setImages((prev) => [...prev, res.url!])
      } else {
        setError(res.error || 'Error al subir la imagen')
      }
    }
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  // ─── Guardar producto ───────────────────────────────────────────────────────
  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name,
      slug: slugify(name),
      category,
      collection,
      price: parseFloat(price),
      description,
      featured,
      images,
    }

    let productId = editingProduct?.id
    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload)
      if (!res.success) {
        setSaving(false)
        return setError(res.error || 'Error al guardar el producto')
      }
    } else {
      const res = await createProduct(payload)
      if (!res.success || !res.product) {
        setSaving(false)
        return setError(res.error || 'Error al crear el producto')
      }
      productId = res.product.id
    }

    // Grilla de variantes: producto cartesiano talle × color
    if (productId) {
      const variants = sizes.flatMap((size) =>
        selectedColors.map((color) => ({
          size,
          color,
          stock: parseInt(stock[variantKey(size, color)] || '0') || 0,
        }))
      )
      const vRes = await replaceVariants(productId, variants)
      if (!vRes.success) {
        setSaving(false)
        return setError(vRes.error || 'Error al guardar el stock')
      }
    }

    setSaving(false)
    setShowForm(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleToggleActive(product: Product) {
    await updateProduct(product.id, { active: !product.active })
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
    )
  }

  const categoryLabel = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug
  const collectionLabel = (slug: string) =>
    collections.find((c) => c.slug === slug)?.name ?? slug

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
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkImages(true)}
            className="px-5 py-2.5 border border-bc-gray-300 text-bc-black text-[10px] tracking-[2px] uppercase font-light hover:border-bc-black transition-colors"
          >
            Subir imágenes
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="px-5 py-2.5 border border-bc-gray-300 text-bc-black text-[10px] tracking-[2px] uppercase font-light hover:border-bc-black transition-colors"
          >
            Importar CSV
          </button>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors"
          >
            + Nuevo producto
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-bc-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bc-gray-200 bg-bc-gray-100">
              {['Producto', 'Categoría', 'Precio', 'Colección', 'Stock', 'Estado', ''].map(
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
            {products.map((product) => {
              const totalStock = (product.variants ?? []).reduce(
                (sum, v) => sum + v.stock,
                0
              )
              return (
                <tr key={product.id} className="hover:bg-bc-gray-100 transition-colors">
                  <td className="px-4 py-3 font-light text-bc-black">
                    {product.name}
                    {product.featured && (
                      <span className="ml-2 text-[9px] bg-bc-accent/20 text-bc-accent px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-bc-gray-500">
                    {categoryLabel(product.category)}
                  </td>
                  <td className="px-4 py-3 text-bc-black font-light">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-bc-gray-500">
                    {collectionLabel(product.collection)}
                  </td>
                  <td className="px-4 py-3 text-bc-gray-500">{totalStock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(product)}
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
                    <div className="flex gap-3">
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
              )
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-16 text-center text-bc-gray-500 text-sm font-light">
            No hay productos. Creá uno con el botón de arriba.
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
          <div className="fixed inset-0 z-[51] flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl p-8 my-8">
              <h2 className="text-xl font-light text-bc-black mb-6">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>

              {error && (
                <div className="mb-4 text-red-500 text-xs tracking-wide">{error}</div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-5">
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
                    <label className="flex items-center justify-between text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                      Categoría
                      <button
                        type="button"
                        onClick={() => openQuickAdd('category')}
                        className="text-bc-accent normal-case tracking-normal text-[10px]"
                      >
                        + nueva
                      </button>
                    </label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                    >
                      <option value="" disabled>
                        Elegir…
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                      Colección
                      <button
                        type="button"
                        onClick={() => openQuickAdd('collection')}
                        className="text-bc-accent normal-case tracking-normal text-[10px]"
                      >
                        + nueva
                      </button>
                    </label>
                    <select
                      required
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                      className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                    >
                      <option value="" disabled>
                        Elegir…
                      </option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
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

                {/* Imágenes */}
                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                    Imágenes
                  </label>
                  <div className="flex flex-wrap gap-3 items-center">
                    {images.map((url) => (
                      <div key={url} className="relative w-20 h-24">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover border border-bc-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-bc-black text-bc-white text-xs rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-24 border border-dashed border-bc-gray-300 flex items-center justify-center cursor-pointer text-[9px] tracking-[1px] uppercase text-bc-gray-500 hover:border-bc-black transition-colors text-center">
                      {uploading ? 'Subiendo…' : '+ Subir'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Talles */}
                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                    Talles
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 bg-bc-gray-100 px-2.5 py-1 text-xs"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSize(s)}
                          className="text-bc-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSize()
                        }
                      }}
                      placeholder="ej: 36, 38, S, M…"
                      className="flex-1 border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 border border-bc-gray-200 text-sm hover:border-bc-black transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Colores */}
                <div>
                  <label className="flex items-center justify-between text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
                    Colores
                    <button
                      type="button"
                      onClick={() => openQuickAdd('color')}
                      className="text-bc-accent normal-case tracking-normal text-[10px]"
                    >
                      + color
                    </button>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                      const active = selectedColors.includes(c.name)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleColor(c.name)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border transition-colors ${
                            active
                              ? 'border-bc-black bg-bc-black text-bc-white'
                              : 'border-bc-gray-200 text-bc-gray-700 hover:border-bc-black'
                          }`}
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-bc-gray-300"
                            style={{ backgroundColor: c.hex || 'transparent' }}
                          />
                          {c.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Grilla de stock */}
                {sizes.length > 0 && selectedColors.length > 0 && (
                  <div>
                    <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                      Stock por talle × color
                    </label>
                    <div className="overflow-x-auto border border-bc-gray-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-bc-gray-100">
                            <th className="px-3 py-2 text-left text-bc-gray-500 font-normal">
                              Talle \ Color
                            </th>
                            {selectedColors.map((color) => (
                              <th
                                key={color}
                                className="px-3 py-2 text-left text-bc-gray-500 font-normal"
                              >
                                {color}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sizes.map((size) => (
                            <tr key={size} className="border-t border-bc-gray-100">
                              <td className="px-3 py-2 text-bc-gray-700">{size}</td>
                              {selectedColors.map((color) => {
                                const key = variantKey(size, color)
                                return (
                                  <td key={color} className="px-2 py-1.5">
                                    <input
                                      type="number"
                                      min="0"
                                      value={stock[key] ?? ''}
                                      placeholder="0"
                                      onChange={(e) =>
                                        setStock((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      className="w-16 border border-bc-gray-200 px-2 py-1 text-xs focus:border-bc-black outline-none"
                                    />
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

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
                    disabled={saving || uploading}
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

      {/* Modal de importación CSV */}
      {showImport && (
        <ImportCsvModal
          onClose={() => setShowImport(false)}
          onDone={() => router.refresh()}
        />
      )}

      {/* Modal de subida de imágenes en lote */}
      {showBulkImages && (
        <BulkImageUploadModal
          onClose={() => setShowBulkImages(false)}
          onDone={() => router.refresh()}
        />
      )}

      {/* Modal de alta rápida */}
      {quickAdd && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/30"
            onClick={() => setQuickAdd(null)}
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xs p-6">
              <h3 className="text-sm font-light text-bc-black mb-4">
                {quickAdd === 'category'
                  ? 'Nueva categoría'
                  : quickAdd === 'collection'
                    ? 'Nueva colección'
                    : 'Nuevo color'}
              </h3>
              <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                <div className="flex gap-2 items-center">
                  {quickAdd === 'color' && (
                    <input
                      type="color"
                      value={quickHex}
                      onChange={(e) => setQuickHex(e.target.value)}
                      className="w-10 h-[38px] border border-bc-gray-200 cursor-pointer p-0.5 flex-shrink-0"
                      title="Color"
                    />
                  )}
                  <input
                    autoFocus
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Nombre"
                    className="flex-1 border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={quickSaving}
                    className="flex-1 py-2.5 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors disabled:opacity-50"
                  >
                    {quickSaving ? 'Guardando...' : 'Agregar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickAdd(null)}
                    className="flex-1 py-2.5 border border-bc-gray-200 text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-black transition-colors"
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
