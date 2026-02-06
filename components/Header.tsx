"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = useCartStore((state) => state.totalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🥑</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              FreshCart
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-medium text-gray-700 hover:text-lime-600">
              Home
            </Link>
            <Link href="/shop" className="font-medium text-gray-700 hover:text-lime-600">
              Shop
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-lime-50">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  title={user?.name || user?.email || "Profile"}
                  className="p-2 rounded-lg hover:bg-lime-50"
                >
                  <User className="w-6 h-6 text-gray-700" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-700" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-lime-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-3 bg-white">
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-50"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-auto bg-lime-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-50"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-center rounded-lg bg-lime-400 font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
