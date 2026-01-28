"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-12 shadow-md text-center">
          <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order
          </p>
          
          <p className="text-gray-600 mb-8">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>

          <div className="bg-lime-50 border border-lime-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">What's Next?</h2>
            <ul className="space-y-2 text-sm text-gray-700 text-left">
              <li className="flex items-center gap-2">
                <span className="text-lime-500">✓</span>
                You'll receive an email confirmation shortly
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-500">✓</span>
                Your order will be prepared and delivered within 1-2 hours
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-500">✓</span>
                Track your order status in your profile
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-8 py-3 rounded-lg transition"
            >
              View Orders
            </Link>
            <Link
              href="/shop"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-8 py-3 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}