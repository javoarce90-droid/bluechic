'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Collection, Color } from '@/types'
import {
  createCategory,
  deleteCategory,
  createCollection,
  deleteCollection,
  createColor,
  deleteColor,
} from '@/lib/actions/taxonomy'

export default function CatalogAdminClient({
  initialCategories,
  initialCollections,
  initialColors,
}: {
  initialCategories: Category[]
  initialCollections: Collection[]
  initialColors: Color[]
}) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [collections, setCollections] = useState(initialCollections)
  const [colors, setColors] = useState(initialColors)

  const [catName, setCatName] = useState('')
  const [colName, setColName] = useState('')
  const [colorName, setColorName] = useState('')
  const [colorHex, setColorHex] = useState('#000000')
  const [error, setError] = useState('')

  function refresh() {
    router.refresh()
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!catName.trim()) return
    const res = await createCategory(catName)
    if (!res.success) return setError(res.error || 'Error al crear categoría')
    setCategories((prev) => [...prev, res.category!])
    setCatName('')
    refresh()
  }

  async function removeCategory(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return
    const res = await deleteCategory(id)
    if (!res.success) return setError(res.error || 'Error al eliminar')
    setCategories((prev) => prev.filter((c) => c.id !== id))
    refresh()
  }

  async function addCollection(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!colName.trim()) return
    const res = await createCollection(colName)
    if (!res.success) return setError(res.error || 'Error al crear colección')
    setCollections((prev) => [...prev, res.collection!])
    setColName('')
    refresh()
  }

  async function removeCollection(id: string) {
    if (!confirm('¿Eliminar esta colección?')) return
    const res = await deleteCollection(id)
    if (!res.success) return setError(res.error || 'Error al eliminar')
    setCollections((prev) => prev.filter((c) => c.id !== id))
    refresh()
  }

  async function addColor(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!colorName.trim()) return
    const res = await createColor(colorName, colorHex)
    if (!res.success) return setError(res.error || 'Error al crear color')
    setColors((prev) => [...prev, res.color!])
    setColorName('')
    setColorHex('#000000')
    refresh()
  }

  async function removeColor(id: string) {
    if (!confirm('¿Eliminar este color?')) return
    const res = await deleteColor(id)
    if (!res.success) return setError(res.error || 'Error al eliminar')
    setColors((prev) => prev.filter((c) => c.id !== id))
    refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-bc-black">Catálogo</h1>
        <p className="text-sm text-bc-gray-500 mt-1">
          Administrá categorías, colecciones y colores
        </p>
      </div>

      {error && (
        <div className="mb-6 text-red-500 text-xs tracking-wide">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categorías */}
        <Panel title="Categorías">
          <form onSubmit={addCategory} className="flex gap-2 mb-4">
            <input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="ej: Pantalones"
              className="flex-1 border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
            />
            <AddButton />
          </form>
          <ItemList
            items={categories.map((c) => ({ id: c.id, label: c.name }))}
            onRemove={removeCategory}
          />
        </Panel>

        {/* Colecciones */}
        <Panel title="Colecciones">
          <form onSubmit={addCollection} className="flex gap-2 mb-4">
            <input
              value={colName}
              onChange={(e) => setColName(e.target.value)}
              placeholder="ej: Invierno"
              className="flex-1 border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
            />
            <AddButton />
          </form>
          <ItemList
            items={collections.map((c) => ({ id: c.id, label: c.name }))}
            onRemove={removeCollection}
          />
        </Panel>

        {/* Colores */}
        <Panel title="Colores">
          <form onSubmit={addColor} className="flex gap-2 mb-4">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-10 h-[38px] border border-bc-gray-200 cursor-pointer p-0.5"
              title="Color"
            />
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="ej: Marrón"
              className="flex-1 border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
            />
            <AddButton />
          </form>
          <ItemList
            items={colors.map((c) => ({
              id: c.id,
              label: c.name,
              swatch: c.hex,
            }))}
            onRemove={removeColor}
          />
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-bc-gray-200 p-5">
      <h2 className="text-[10px] tracking-[2px] uppercase text-bc-gray-500 mb-4">
        {title}
      </h2>
      {children}
    </div>
  )
}

function AddButton() {
  return (
    <button
      type="submit"
      className="px-4 bg-bc-black text-bc-white text-lg leading-none hover:bg-bc-accent transition-colors"
      title="Agregar"
    >
      +
    </button>
  )
}

function ItemList({
  items,
  onRemove,
}: {
  items: { id: string; label: string; swatch?: string | null }[]
  onRemove: (id: string) => void
}) {
  if (items.length === 0) {
    return <p className="text-xs text-bc-gray-400 font-light">Sin elementos.</p>
  }
  return (
    <ul className="divide-y divide-bc-gray-100">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between py-2 text-sm font-light text-bc-black"
        >
          <span className="flex items-center gap-2">
            {item.swatch !== undefined && (
              <span
                className="inline-block w-4 h-4 rounded-full border border-bc-gray-200"
                style={{ backgroundColor: item.swatch || 'transparent' }}
              />
            )}
            {item.label}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="text-bc-gray-400 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
