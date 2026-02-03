"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';
import Image from 'next/image';
import { getProductImage } from '@/lib/getProductImage';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  $id: string;
  $createdAt: string;
  userId: string;
  items: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  [key: string]: any;
}

export default function OrderDetailPage() {
  const { user, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user?.$id && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  const fetchOrder = async () => {
    try {
      setOrderLoading(true);
      const response = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ORDERS_TABLE_ID!,
        orderId
      );
      
      setOrder(response as unknown as Order);
      
      // Parse items
      if (response.items) {
        try {
          const parsedItems = JSON.parse(response.items);
          setItems(Array.isArray(parsedItems) ? parsedItems : []);
        } catch (error) {
          console.error('Error parsing items:', error);
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading || orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/orders"
            className="text-lime-600 hover:text-lime-700 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Orders
          </Link>
          <div className="flex justify-between items-start mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.$id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.$createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

       {/* Order Items */}
<div className="bg-white rounded-2xl p-6 shadow-md mb-6">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
  <div className="space-y-4">
    {items.length === 0 ? (
      <p className="text-gray-500">No items found in this order.</p>
    ) : (
      items.map((item, index) => (
        <div
          key={`${item.id || 'item'}-${index}`} // ✅ Unique key
          className="flex gap-4 pb-4 border-b last:border-b-0"
        >
          {item.image && (
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={getProductImage(item.image)}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Quantity: {item.quantity}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              R {(item.price * item.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              R {item.price.toFixed(2)} each
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</div>


        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
              <span>R {calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>R   5.00</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>R {order.totalAmount?.toFixed(2) || calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Payment Method:</span> Card Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}