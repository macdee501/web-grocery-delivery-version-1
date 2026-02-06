'use client';

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, X } from "lucide-react";
import { getProductImage } from "@/lib/getProductImage";
import { useEffect } from "react";

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCartDrawer({ isOpen, onClose }: MobileCartDrawerProps) {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      onClose();
      return;
    }
    router.push('/checkout');
    onClose();
  };


useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden"; // stop scrolling
  } else {
    document.body.style.overflow = "auto"; // restore
  }
}, [isOpen]);


  return (
    <>
      {/* Overlay */}
<div
  className={`fixed inset-0 bg-black transition-opacity z-40 ${
    isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
  onClick={onClose}
/>


      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">
  Your Cart (
    {typeof window !== "undefined" ? totalItems() : 0}
  )
</h2>

          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="mt-4 inline-block bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-2 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border rounded-lg p-3">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={getProductImage(item.image || '')}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-900 font-semibold">R{item.price}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Subtotal</span>
                <span>R{totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Delivery Fee</span>
                <span>R5.00</span>
              </div>
              <div className="flex justify-between font-bold text-xl mt-2">
                <span>Total</span>
                <span>R{(totalPrice() + 5).toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold py-3 rounded-lg transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
