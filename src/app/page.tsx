import { getActiveProducts } from '@/lib/data/products'
import Hero from '@/components/store/Hero'
import CollectionSection from '@/components/store/CollectionSection'
import BrandSection from '@/components/store/BrandSection'
import AboutSection from '@/components/store/AboutSection'
import ContactSection from '@/components/store/ContactSection'

export const revalidate = 60

export default async function HomePage() {
  const products = await getActiveProducts()

  return (
    <main>
      <Hero />
      <CollectionSection products={products} />
      <BrandSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
