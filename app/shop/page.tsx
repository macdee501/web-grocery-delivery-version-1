import ProductFilter from "@/components/ProductFilter";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Fresh, delicious, and delivered to your door</p>
        </div>

        <ProductFilter />
      </div>
    </div>
  );
}
