import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { account, storage } from '@/lib/appwrite';
import { ID } from 'appwrite';
import type { Models } from 'appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  updateProfile: (name: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isAuthenticated: false,

      checkAuth: async () => {
        set({ loading: true });
        try {
          const user = await account.get();
          console.log('✅ Auth check successful:', user.email);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          console.log('❌ Auth check failed - clearing stale data');
          // Clear any stale auth data
          set({ user: null, isAuthenticated: false, loading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          // First, try to delete any existing session
          try {
            await account.deleteSession('current');
            console.log('🗑️ Deleted existing session');
          } catch (e) {
            // No existing session, that's fine
            console.log('No existing session to delete');
          }

          // Now create new session
          await account.createEmailPasswordSession(email, password);
          const user = await account.get();
          console.log('✅ Login successful:', user.email);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error: any) {
          console.error('❌ Login error:', error);
          set({ user: null, isAuthenticated: false, loading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        try {
          // First, delete any existing session
          try {
            await account.deleteSession('current');
            console.log('🗑️ Deleted existing session before registration');
          } catch (e) {
            // No existing session, that's fine
          }

          // Create account
          await account.create(ID.unique(), email, password, name);
          
          // Auto login after registration
          await account.createEmailPasswordSession(email, password);
          const user = await account.get();
          console.log('✅ Registration successful:', user.email);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error: any) {
          console.error('❌ Registration error:', error);
          set({ user: null, isAuthenticated: false, loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await account.deleteSession('current');
          console.log('✅ Logout successful');
        } catch (error) {
          console.error('❌ Logout error:', error);
        } finally {
          // Always clear state even if logout fails
          set({ user: null, isAuthenticated: false });
        }
      },
      updateProfile: async (name: string) => {
        try {
          await account.updateName(name);
          const user = await account.get();
          set({ user });
        } catch (error) {
          console.error('❌ Update profile failed', error);
          throw error;
        }
      },
      
      updatePassword: async (oldPassword, newPassword) => {
        try {
          await account.updatePassword(newPassword, oldPassword);
          console.log('✅ Password updated');
        } catch (error) {
          console.error('❌ Password update failed', error);
          throw error;
        }
      },
      
      updateAvatar: async (file: File) => {
        try {
          const uploaded = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
            ID.unique(),
            file,
            [
              `read("user:${(await account.get()).$id}")`,
              `update("user:${(await account.get()).$id}")`,
              `delete("user:${(await account.get()).$id}")`,
            ]
          );
      
          await account.updatePrefs({
            avatar: uploaded.$id,
          });
      
          const user = await account.get();
          set({ user });
      
          console.log('✅ Avatar updated');
        } catch (error) {
          console.error('❌ Avatar upload failed', error);
          throw error;
        }
      },
      
      
    }),
    {
      name: 'auth-storage',
      // Don't persist loading or isAuthenticated - always verify with server
      partialize: (state) => ({ 
        user: state.user,
      }),
    }
  )
);