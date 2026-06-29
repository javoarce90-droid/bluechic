import { createClient } from '@/lib/supabase/server'
import type { Category, Collection, Color } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }
  return data || []
}

export async function getColors(): Promise<Color[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching colors:', error)
    return []
  }
  return data || []
}
