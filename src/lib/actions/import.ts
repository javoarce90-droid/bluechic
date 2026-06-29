'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

export interface ImportRow {
  nombre: string
  categoria: string
  coleccion: string
  precio: number
  descripcion: string
  talles: string[]
  colores: string[]
  stock: number
  imagenes: string[]
  destacado: boolean
}

export interface ImportResult {
  created: number
  errors: { row: number; error: string }[]
}

const isDuplicate = (msg: string) =>
  msg.toLowerCase().includes('duplicate') || msg.includes('23505')

const BUCKET = 'product-images'

// Si el valor es una URL completa se usa tal cual; si es un nombre de archivo
// (ej. "pants-1.jpg") se resuelve a la URL pública que tendrá en Storage, para
// poder subir las fotos después y que hagan match por nombre.
function resolveImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entries: string[]
): string[] {
  return entries.map((entry) => {
    if (/^https?:\/\//i.test(entry)) return entry
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(entry)
    return data.publicUrl
  })
}

export async function importProductsCsv(rows: ImportRow[]): Promise<ImportResult> {
  const supabase = await createClient()

  // Taxonomías existentes (para resolver/crear)
  const [cats, cols, colors] = await Promise.all([
    supabase.from('categories').select('slug'),
    supabase.from('collections').select('slug'),
    supabase.from('colors').select('name'),
  ])
  const catSlugs = new Set((cats.data ?? []).map((c) => c.slug))
  const colSlugs = new Set((cols.data ?? []).map((c) => c.slug))
  const colorNames = new Set(
    (colors.data ?? []).map((c) => c.name.toLowerCase())
  )

  let created = 0
  const errors: { row: number; error: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const rowNum = i + 2 // +1 por header, +1 por índice base 1
    try {
      // Categoría
      const catSlug = slugify(r.categoria)
      if (catSlug && !catSlugs.has(catSlug)) {
        const { error } = await supabase
          .from('categories')
          .insert({ name: r.categoria.trim(), slug: catSlug })
        if (error && !isDuplicate(error.message))
          throw new Error('categoría: ' + error.message)
        catSlugs.add(catSlug)
      }

      // Colección
      const colSlug = slugify(r.coleccion)
      if (colSlug && !colSlugs.has(colSlug)) {
        const { error } = await supabase
          .from('collections')
          .insert({ name: r.coleccion.trim(), slug: colSlug })
        if (error && !isDuplicate(error.message))
          throw new Error('colección: ' + error.message)
        colSlugs.add(colSlug)
      }

      // Colores
      for (const cname of r.colores) {
        if (!colorNames.has(cname.toLowerCase())) {
          const { error } = await supabase
            .from('colors')
            .insert({ name: cname.trim() })
          if (error && !isDuplicate(error.message))
            throw new Error('color: ' + error.message)
          colorNames.add(cname.toLowerCase())
        }
      }

      // Producto
      const { data: product, error: pErr } = await supabase
        .from('products')
        .insert({
          name: r.nombre.trim(),
          slug: slugify(r.nombre),
          category: catSlug,
          collection: colSlug,
          price: r.precio,
          description: r.descripcion ?? '',
          featured: r.destacado,
          active: true,
          images: resolveImages(supabase, r.imagenes),
        })
        .select()
        .single()
      if (pErr) throw new Error(pErr.message)

      // Variantes: producto cartesiano talle × color con el mismo stock
      const variants = r.talles.flatMap((size) =>
        r.colores.map((color) => ({
          product_id: product.id,
          size,
          color,
          stock: r.stock,
        }))
      )
      if (variants.length > 0) {
        const { error: vErr } = await supabase
          .from('product_variants')
          .insert(variants)
        if (vErr) throw new Error('variantes: ' + vErr.message)
      }

      created++
    } catch (e) {
      errors.push({
        row: rowNum,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  revalidatePath('/')
  revalidatePath('/admin/productos')
  revalidatePath('/admin/catalogo')
  return { created, errors }
}
