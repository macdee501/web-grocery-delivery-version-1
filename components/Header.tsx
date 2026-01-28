"use client";

import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const totalItems = useCartStore((state) => state.totalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  // Update cart count only on client
  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🥑</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              FreshCart
            </span>
          </Link>

          {/* Navigation - Middle */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-lime-600 font-medium transition"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="text-gray-700 hover:text-lime-600 font-medium transition"
            >
              Shop
            </Link>
          </nav>

          {/* Actions - Right */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link 
              href="/cart"
              className="relative p-2 hover:bg-lime-50 rounded-lg transition group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-lime-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/profile"
                  className="p-2 hover:bg-lime-50 rounded-lg transition group"
                  title={user?.name || user?.email || 'Profile'}
                >
                  <User className="w-6 h-6 text-gray-700 group-hover:text-lime-600 transition" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold text-gray-900 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}