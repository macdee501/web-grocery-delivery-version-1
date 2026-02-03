"use client";

import Image from 'next/image';
import { Product } from '@/types/product';
import { getProductImage } from "@/lib/getProductImage";

type Props = {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
};

export default function ProductCard({ product, onAddToCart, onOpenDetails }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
      <div
        className="relative h-48 mb-4 cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        <Image
          src={getProductImage(product.image || '')}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {product.name}
      </h3>

      {product.tags?.length && (
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tags.map(tag => (
            <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-lime-100 text-lime-800">
              🥑 {tag}
            </span>
          ))}
        </div>
      )}

      {product.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {product.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <span className="text-2xl font-bold">R{product.price}</span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-lime-400 hover:bg-lime-500 px-5 py-2.5 rounded-lg font-semibold"
        >
          🛒 Add to cart
        </button>
      </div>
    </div>
  );
}
