/**
 * Auth Context - Quản lý authentication state toàn ứng dụng
 * Cung cấp user info, login, logout, và các auth functions
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';
import { getDashboardRoute } from '@/lib/auth/roles';
import {
  User,
  AuthContextType,
  RegisterDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '@/lib/api/types';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize - Check if user is logged in
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize auth state from localStorage
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Kiểm tra có access token không
      const isAuth = authService.isAuthenticated();
      
      if (isAuth) {
        // Lấy user từ localStorage trước
        const storedUser = authService.getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }

        // Sau đó fetch user mới nhất từ server
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // Nếu lỗi 401, axios interceptor sẽ tự động handle
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });

      // Debug: Log toàn bộ response
      console.log('🔐 Login response:', JSON.stringify(response, null, 2));
      console.log('👤 User object:', response.user);
      console.log('� User roles:', response.user?.roles);

      // Kiểm tra response có hợp lệ không
      if (!response || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Lấy user đầy đủ từ server để đảm bảo có roles
      let effectiveUser = response.user;
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          effectiveUser = currentUser;
        }
      } catch (e) {
        console.warn('⚠️ Could not fetch current user, falling back to login response user');
      }

      setUser(effectiveUser);

      // Redirect dựa trên role của user
      const dashboardRoute = getDashboardRoute(effectiveUser);
      console.log('🚀 Redirecting to:', dashboardRoute);

      // Quan trọng: tắt loading trước khi chuyển trang để tránh spinner treo
      setIsLoading(false);
      router.push(dashboardRoute);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      throw error; // Re-throw để component có thể handle error
    }
  };

  /**
   * Register function
   */
  const register = async (data: RegisterDto) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      // Sau khi đăng ký, cố gắng lấy user đầy đủ
      let effectiveUser = response.user;
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          effectiveUser = currentUser;
        }
      } catch (e) {
        // ignore
      }
      setUser(effectiveUser);

      // Redirect dựa trên role của user
      const dashboardRoute = getDashboardRoute(effectiveUser);
      setIsLoading(false);
      router.push(dashboardRoute);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn clear state và redirect dù có lỗi
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update profile function
   */
  const updateProfile = async (data: UpdateUserDto) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Change password function
   */
  const changePassword = async (data: ChangePasswordDto) => {
    try {
      await authService.changePassword(data);
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook - Sử dụng auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
