"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { getProductImage } from "@/lib/getProductImage";
import { useCartStore } from "@/store/useCartStore";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  product: Product;
};

export default function ProductPageClient({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: "bottom-right",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="relative w-full max-w-md h-64 mb-6">
        <Image
          src={getProductImage(product.image || "")}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      {product.description && (
        <p className="text-gray-700 mb-4">{product.description}</p>
      )}

      <p className="text-2xl font-bold mb-6">R{product.price}</p>

      <button
        onClick={handleAddToCart}
        className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition"
      >
        🛒 Add to cart
      </button>
    </div>
  );
}
