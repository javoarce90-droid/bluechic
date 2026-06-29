'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProductCategory, ProductCollection, ProductSize } from '@/types'

function revalidateCatalog() {
  revalidatePath('/')
  revalidatePath('/admin/productos')
}

export async function createProduct(input: {
  name: string
  slug: string
  category: ProductCategory
  collection: ProductCollection
  price: number
  description: string
  featured: boolean
  images?: string[]
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert({ images: [], ...input, active: true })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true, product: data }
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string
    slug: string
    category: ProductCategory
    collection: ProductCollection
    price: number
    description: string
    featured: boolean
    active: boolean
    images: string[]
  }>
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

export async function upsertVariant(input: {
  product_id: string
  size: ProductSize
  color: string
  stock: number
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('product_variants')
    .upsert(input, { onConflict: 'product_id,size,color' })

  if (error) return { success: false, error: error.message }
  revalidateCatalog()
  return { success: true }
}

// Reemplaza toda la grilla de variantes de un producto (talle × color con stock)
export async function replaceVariants(
  productId: string,
  variants: { size: ProductSize; color: string; stock: number }[]
) {
  const supabase = await createClient()

  const { error: delError } = await supabase
    .from('product_variants')
    .delete()
    .eq('product_id', productId)
  if (delError) return { success: false, error: delError.message }

  if (variants.length > 0) {
    const rows = variants.map((v) => ({ ...v, product_id: productId }))
    const { error } = await supabase.from('product_variants').insert(rows)
    if (error) return { success: false, error: error.message }
  }

  revalidateCatalog()
  return { success: true }
}

export async function deleteVariant(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
