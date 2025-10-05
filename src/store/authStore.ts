import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../services/api';
import type { AuthState, UserLogin, UserRegister, AuthUser } from '../types/Index';

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        login: async (credentials: UserLogin) => {
          try {
            set({ loading: true, error: null });

            const response = await api.post('/QuanLyNguoiDung/DangNhap', credentials);
            const userData: AuthUser = response.data;

            // Store access token
            localStorage.setItem('ACCESS_TOKEN', userData.accessToken);
            localStorage.setItem('USER_INFO', JSON.stringify(userData));

            set({
              user: userData,
              isAuthenticated: true,
              loading: false
            });
          } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed';
            set({
              error: errorMessage,
              loading: false,
              isAuthenticated: false,
              user: null
            });
            throw new Error(errorMessage);
          }
        },

        register: async (userData: UserRegister) => {
          try {
            set({ loading: true, error: null });

            // Add default group if not provided
            const registrationData = {
              ...userData,
              maNhom: userData.maNhom || 'GP01'
            };

            await api.post('/QuanLyNguoiDung/DangKy', registrationData);

            set({ loading: false });
          } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed';
            set({
              error: errorMessage,
              loading: false
            });
            throw new Error(errorMessage);
          }
        },

        logout: () => {
          localStorage.removeItem('ACCESS_TOKEN');
          localStorage.removeItem('USER_INFO');
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        },

        updateUserInfo: (userData: Partial<AuthUser>) => {
          const state = get();
          if (state.user) {
            const updatedUser = {
              ...state.user,
              ...(userData.hoTen !== undefined && { hoTen: userData.hoTen }),
              ...(userData.email !== undefined && { email: userData.email }),
              ...(userData.soDT !== undefined && { soDT: userData.soDT }),
            };

            // Update localStorage
            localStorage.setItem('USER_INFO', JSON.stringify(updatedUser));

            set({
              user: updatedUser
            });
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Check if token exists in localStorage
          const token = localStorage.getItem('ACCESS_TOKEN');
          const userInfo = localStorage.getItem('USER_INFO');

          if (token && userInfo) {
            try {
              const user = JSON.parse(userInfo);
              if (state) {
                state.user = user;
                state.isAuthenticated = true;
              }
            } catch {
              // Clear invalid data
              localStorage.removeItem('ACCESS_TOKEN');
              localStorage.removeItem('USER_INFO');
              if (state) {
                state.user = null;
                state.isAuthenticated = false;
              }
            }
          } else {
            // No valid tokens, ensure user is logged out
            if (state) {
              state.user = null;
              state.isAuthenticated = false;
            }
          }
        },
      }
    ),
    { name: 'auth-store' }
  )
);