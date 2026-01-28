"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Always check auth on mount
    checkAuth();
  }, []); // Only run once on mount

  return <>{children}</>;
}