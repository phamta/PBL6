/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { get, post, put, tokenManager } from '../api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../types';

// ============ Authentication APIs ============

/**
 * Đăng nhập
 */
export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await post<AuthResponse>('/auth/login', credentials);
  
  if (response.success && response.data) {
    // Lưu tokens và user data
    tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    tokenManager.saveUser(response.data.user);
  }
  
  return response;
};

/**
 * Đăng ký
 */
export const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await post<AuthResponse>('/auth/register', userData);
  
  if (response.success && response.data) {
    // Lưu tokens và user data
    tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    tokenManager.saveUser(response.data.user);
  }
  
  return response;
};

/**
 * Đăng xuất
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await post<void>('/auth/logout');
    return response;
  } finally {
    // Xóa tokens dù API có thành công hay không
    tokenManager.clearTokens();
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshTokenData: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await post<AuthResponse>('/auth/refresh', refreshTokenData);
  
  if (response.success && response.data) {
    // Cập nhật tokens mới
    tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
  }
  
  return response;
};

/**
 * Lấy thông tin user hiện tại
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  const response = await get<User>('/auth/me');
  
  if (response.success && response.data) {
    // Cập nhật user data trong localStorage
    tokenManager.saveUser(response.data);
  }
  
  return response;
};

/**
 * Cập nhật thông tin user
 */
export const updateUser = async (userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
  const response = await put<User>('/auth/me', userData);
  
  if (response.success && response.data) {
    // Cập nhật user data trong localStorage
    tokenManager.saveUser(response.data);
  }
  
  return response;
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> => {
  return await put<void>('/auth/change-password', passwordData);
};

// ============ Helper Functions ============

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = (): boolean => {
  return !!tokenManager.getAccessToken();
};

/**
 * Lấy user data từ localStorage
 */
export const getStoredUser = (): User | null => {
  return tokenManager.getUser();
};

/**
 * Kiểm tra user có role cụ thể không
 */
export const hasRole = (role: string): boolean => {
  const user = getStoredUser();
  return user?.role === role;
};

/**
 * Kiểm tra user có một trong các roles không
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const user = getStoredUser();
  return user ? roles.includes(user.role) : false;
};

// Export default object
export default {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  updateUser,
  changePassword,
  isAuthenticated,
  getStoredUser,
  hasRole,
  hasAnyRole,
};
