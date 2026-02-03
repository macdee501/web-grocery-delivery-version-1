"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Order {
  $id: string;
  $createdAt: string;
  userId: string;
  items: any;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  [key: string]: any;
}

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user?.$id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.$id) return;
    
    try {
      setOrdersLoading(true);
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ORDERS_TABLE_ID!,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );
      setOrders(response.documents as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemsCount = (items: any) => {
    if (!items) return 0;
    
    // If items is a string, parse it
    if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed.length : 0;
      } catch {
        return 0;
      }
    }
    
    // If items is already an array
    if (Array.isArray(items)) {
      return items.length;
    }
    
    return 0;
  };

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/profile"
            className="text-lime-600 hover:text-lime-700 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Order History</h1>
          <p className="text-gray-600 mt-1">View and track all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-md text-center">
            <span className="text-6xl mb-4 block">📦</span>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your order history here
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-semibold transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.$id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.$id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.$createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="border-t pt-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {getItemsCount(order.items)} item(s)
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    R {order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>

                <Link
                  href={`/orders/${order.$id}`}
                  className="text-lime-600 hover:text-lime-700 font-medium text-sm"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}