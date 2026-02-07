'use client';
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import ProductGrid from "./ProductGrid";
import { Product } from "@/types/product"; // ✅ use shared Product type

// Category type
type Category = {
  id: string;
  name: string;
};

// Extend Product with optional categoryId for UI filtering
type ProductWithCategory = Product & { categoryId?: string };

export default function ProductFilter() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const cats: Category[] = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      const prods: Product[] = await getProducts(selectedCategory || undefined);

      // Map products to include categoryId for filtering (optional)
      const prodsWithCategory: ProductWithCategory[] = prods.map(p => ({
        ...p,
        categoryId: selectedCategory || "all",
      }));

      setProducts(prodsWithCategory);
    }
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div>
      {/* Scrollable categories */}
      <div className="mb-6 flex overflow-x-auto space-x-2 py-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-4 py-2 whitespace-nowrap rounded ${
              selectedCategory === cat.id ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
        <button
          className="px-4 py-2 whitespace-nowrap rounded bg-gray-300"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
