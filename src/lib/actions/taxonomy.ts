'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

function revalidateCatalog() {
  revalidatePath('/')
  revalidatePath('/admin/productos')
  revalidatePath('/admin/catalogo')
}

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
export async function createCategory(name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim(), slug: slugify(name) })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true, category: data }
}

export async function updateCategory(id: string, name: string) {
  // Solo se actualiza el nombre; el slug se mantiene para no romper los productos que lo referencian
  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .update({ name: name.trim() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

// ─── COLECCIONES ──────────────────────────────────────────────────────────────
export async function createCollection(name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .insert({ name: name.trim(), slug: slugify(name) })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true, collection: data }
}

export async function updateCollection(id: string, name: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('collections')
    .update({ name: name.trim() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

export async function deleteCollection(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('collections').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

// ─── COLORES ──────────────────────────────────────────────────────────────────
export async function createColor(name: string, hex?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('colors')
    .insert({ name: name.trim(), hex: hex?.trim() || null })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true, color: data }
}

export async function updateColor(id: string, name: string, hex?: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('colors')
    .update({ name: name.trim(), hex: hex?.trim() || null })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

export async function deleteColor(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('colors').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}
