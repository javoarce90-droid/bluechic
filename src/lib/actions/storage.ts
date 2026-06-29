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

// Subida en lote: cada archivo se guarda con su nombre exacto (upsert), de modo
// que su URL pública coincida con la que ya quedó en la BBDD tras importar el CSV.
export async function uploadImagesByName(formData: FormData) {
  const files = formData.getAll('files').filter((f): f is File => f instanceof File)
  if (files.length === 0) {
    return { uploaded: 0, results: [] as { name: string; error?: string }[] }
  }

  const supabase = await createClient()
  const results: { name: string; error?: string }[] = []
  let uploaded = 0

  for (const file of files) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file.name, file, { cacheControl: '3600', upsert: true })
    if (error) {
      results.push({ name: file.name, error: error.message })
    } else {
      results.push({ name: file.name })
      uploaded++
    }
  }

  return { uploaded, results }
}
