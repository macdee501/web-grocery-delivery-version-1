import ProductGrid from '@/components/ProductGrid'
import { getProducts } from '@/lib/getProducts'

export default async function Page() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Fresh, delicious, and delivered to your door</p>
        </div>

        {/* Products Grid - Client Component */}
        <ProductGrid products={products} />
      </div>
    </div>
  )
}