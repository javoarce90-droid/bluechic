import { getActiveProducts } from '@/lib/data/products'
import { getCategories, getCollections } from '@/lib/data/taxonomy'
import Hero from '@/components/store/Hero'
import CollectionSection from '@/components/store/CollectionSection'
import BrandSection from '@/components/store/BrandSection'
import AboutSection from '@/components/store/AboutSection'
import ContactSection from '@/components/store/ContactSection'

export const revalidate = 60

export default async function HomePage() {
  const [products, categories, collections] = await Promise.all([
    getActiveProducts(),
    getCategories(),
    getCollections(),
  ])

  return (
    <main>
      <Hero />
      <CollectionSection
        products={products}
        categories={categories}
        collections={collections}
      />
      <BrandSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
