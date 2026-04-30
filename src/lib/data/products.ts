import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`*, variants:product_variants(*)`)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`*, variants:product_variants(*)`)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`*, variants:product_variants(*)`)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error) return null
  return data
}
