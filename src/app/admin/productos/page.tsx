import { getAllProducts } from '@/lib/data/products'
import { getCategories, getCollections, getColors } from '@/lib/data/taxonomy'
import ProductsAdminClient from '@/components/admin/ProductsAdminClient'

export const dynamic = 'force-dynamic'

export default async function ProductosAdminPage() {
  const [products, categories, collections, colors] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getCollections(),
    getColors(),
  ])
  return (
    <ProductsAdminClient
      initialProducts={products}
      initialCategories={categories}
      initialCollections={collections}
      initialColors={colors}
    />
  )
}
