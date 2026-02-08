'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const {
    user,
    updateProfile,
    updatePassword,
    updateAvatar,
  } = useAuthStore();

  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (name !== user.name) {
        await updateProfile(name);
      }

      if (oldPassword && newPassword) {
        await updatePassword(oldPassword, newPassword);
      }

      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      await updateAvatar(file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-2xl shadow"
      >
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium mb-2">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAvatarChange(e.target.files?.[0])}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Password */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="font-semibold">Change Password</h2>

          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
