"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('Profile - Auth State:', { isAuthenticated, loading, hasUser: !!user });
    
    if (!loading && !isAuthenticated) {
      console.log('Redirecting to login...');
      router.push('/login');
    }
  }, [isAuthenticated, loading, user, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your profile...</div>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, don't render anything (redirect will happen)
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name || 'User'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-8">
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="grid gap-3">
                <div>
                  <span className="text-sm text-gray-600">User ID:</span>
                  <p className="font-mono text-sm">{user.$id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p>{user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Account Created:</span>
                  <p>{new Date(user.$createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}