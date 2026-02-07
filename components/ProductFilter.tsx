'use client';
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import ProductGrid from "./ProductGrid";

// Define the shape of your data
type Category = {
  id: string; // or number if your id is numeric
  name: string;
};

type Product = {
  id: string; // adjust fields to match your Product type
  name: string;
  price: number;
  categoryId: string;
  // add other product fields here
};

export default function ProductFilter() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const cats: Category[] = await getCategories(); // type assertion
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      const prods: Product[] = await getProducts(selectedCategory || undefined); // type assertion
      setProducts(prods);
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
