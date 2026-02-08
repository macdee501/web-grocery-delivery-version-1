"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/appwrite';


export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuthStore();
  const router = useRouter();
  const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

  const avatarId = user.prefs?.avatar as string | undefined;

const avatarUrl = avatarId
  ? storage.getFileView(BUCKET_ID, avatarId)
  : null;



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
        <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
          <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center">
  {avatarUrl ? (
    <img
      src={avatarUrl.toString()}
      alt="Avatar"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-4xl">👤</span>
  )}
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
                {/* <div>
                  <span className="text-sm text-gray-600">User ID:</span>
                  <p className="font-mono text-sm">{user.$id}</p>
                </div> */}
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

        {/* Quick Links Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Links
          </h2>
          <div className="grid gap-4">
            <Link 
              href="/orders"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-lime-400 hover:bg-lime-50 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center group-hover:bg-lime-200 transition">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order History</h3>
                  <p className="text-sm text-gray-600">View all your past orders</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-lime-600 transition">→</span>
            </Link>

            <Link
  href="/profile/edit"
  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-lime-400 hover:bg-lime-50 transition group"
>
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center group-hover:bg-lime-200 transition">
      <span className="text-2xl">✏️</span>
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">Edit Profile</h3>
      <p className="text-sm text-gray-600">Update your name or password</p>
    </div>
  </div>
  <span className="text-gray-400 group-hover:text-lime-600 transition">→</span>
</Link>


           

            
          </div>
        </div>
      </div>
    </div>
  );
}