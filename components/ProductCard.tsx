"use client";

import Image from 'next/image';
import React from 'react'
import { getProductImage } from "@/lib/getProductImage";

type Product = {
    $id: string;
    name: string;
    price: number;
    image?: string;
    tags?: string[];
    description?: string;
}

type Props = {
    product: Product;
    onAddToCart: (product: Product) => void;
    onOpenDetails: (product: Product) => void;
};

export default function ProductCard({product, onAddToCart, onOpenDetails}: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
        {/* Image */}
        <div className="relative h-48 mb-4 cursor-pointer" onClick={() => onOpenDetails(product)}>
           <Image
            src={getProductImage(product.image || '')}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className='object-contain'
            priority={false}
           />
        </div>

        {/* Name */}
        <h3 className='text-xl font-bold text-gray-900 mb-3'>
            {product.name}
        </h3>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full bg-lime-100 text-lime-800 font-medium"
              >
                🥑 {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Footer - Price and Button */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <span className='text-2xl font-bold text-gray-900'>
                R{product.price}
            </span>
            <button 
                onClick={() => onAddToCart(product)}
                className='flex items-center gap-2 bg-lime-400 hover:bg-lime-500 px-5 py-2.5 rounded-lg font-semibold text-gray-900 transition-colors shadow-sm'
            >
                🛒 Add to cart 
            </button>
        </div>
    </div>
  )
}