import { getAllProducts } from '@/lib/data/products'
import ProductsAdminClient from '@/components/admin/ProductsAdminClient'

export const dynamic = 'force-dynamic'

export default async function ProductosAdminPage() {
  const products = await getAllProducts()
  return <ProductsAdminClient initialProducts={products} />
}
