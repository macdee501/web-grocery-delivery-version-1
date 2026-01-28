"use client";

import ProductCard from './ProductCard';
import { useCartStore } from '@/store/useCartStore';
import toast, { Toaster } from 'react-hot-toast';

type Product = {
  $id: string;
  name: string;
  price: number;
  image?: string;
  tags?: string[];
  description?: string;
};

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      $id: product.$id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  const handleOpenDetails = (product: Product) => {
    console.log("Open details", product);
  };

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.$id}
            product={product}
            onAddToCart={handleAddToCart}
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>
    </>
  );
}