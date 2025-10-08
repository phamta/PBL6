/**
 * Auth Context - Global authentication state management
 * Provides authentication state and methods throughout the application
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import { tokenManager } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/lib/types';

// ============ Context Types ============
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

// ============ Create Context ============
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============ Provider Component ============
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Khởi tạo: Load user từ localStorage và verify với server
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Kiểm tra token trong localStorage
        const storedUser = tokenManager.getUser();
        const accessToken = tokenManager.getAccessToken();

        if (storedUser && accessToken) {
          // Verify với server và lấy thông tin mới nhất
          const response = await authApi.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token không hợp lệ, clear data
            tokenManager.clearTokens();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Init auth error:', error);
        tokenManager.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Đăng nhập
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Redirect based on role
        const { role } = response.data.user;
        if (role === 'SYSTEM_ADMIN') {
          router.push('/dashboard/admin');
        } else if (role === 'DEPARTMENT_OFFICER') {
          router.push('/dashboard/staff');
        } else if (role === 'LEADERSHIP') {
          router.push('/dashboard/leadership');
        } else if (role === 'FACULTY_STAFF') {
          router.push('/dashboard/faculty');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Đăng ký
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Đăng xuất
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      tokenManager.clearTokens();
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  // Refresh user data từ server
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  // Cập nhật profile
  const updateProfile = useCallback(async (data: any) => {
    try {
      const response = await authApi.updateUser(data);
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============ Custom Hook ============
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============ HOC for Protected Routes ============
interface WithAuthOptions {
  requiredRoles?: string[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const { requiredRoles, redirectTo = '/login' } = options;

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push(redirectTo);
        } else if (requiredRoles && user && !requiredRoles.includes(user.role)) {
          router.push('/unauthorized');
        }
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default AuthContext;
