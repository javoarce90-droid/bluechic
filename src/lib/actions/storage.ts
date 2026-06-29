'use server'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

const BUCKET = 'product-images'

export async function uploadProductImage(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No se recibió ningún archivo.' }
  }

  const supabase = await createClient()

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'imagen'
  const path = `${Date.now()}-${base}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) return { success: false, error: error.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return { success: true, url: publicUrl }
}
