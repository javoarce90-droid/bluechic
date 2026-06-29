import { getCategories, getCollections, getColors } from '@/lib/data/taxonomy'
import CatalogAdminClient from '@/components/admin/CatalogAdminClient'

export const dynamic = 'force-dynamic'

export default async function CatalogoAdminPage() {
  const [categories, collections, colors] = await Promise.all([
    getCategories(),
    getCollections(),
    getColors(),
  ])

  return (
    <CatalogAdminClient
      initialCategories={categories}
      initialCollections={collections}
      initialColors={colors}
    />
  )
}
