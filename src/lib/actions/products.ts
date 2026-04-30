'use server'

import { createClient } from '@/lib/supabase/server'
import type { ProductCategory, ProductCollection, ProductSize } from '@/types'

export async function createProduct(input: {
  name: string
  slug: string
  category: ProductCategory
  collection: ProductCollection
  price: number
  description: string
  featured: boolean
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert({ ...input, active: true, images: [] })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
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
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
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
