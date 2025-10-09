/**
 * Auth Service - API calls cho authentication
 * Bao gồm: login, register, logout, refresh token, profile management
 */

import axiosClient, { saveAuthData, clearAuthData } from './axios';
import { API_ENDPOINTS } from './config';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  RefreshTokenDto,
  UpdateUserDto,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from './types';
import { AxiosResponse } from 'axios';

class AuthService {
  /**
   * Đăng nhập
   * POST /api/v1/auth/login
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await axiosClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        loginDto
      );

      const { accessToken, refreshToken, user } = response.data;

      // Lưu thông tin auth vào localStorage
      saveAuthData(accessToken, refreshToken, user);

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Đăng ký
   * POST /api/v1/auth/register
   */
  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      const response: AxiosResponse<RegisterResponse> = await axiosClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        registerDto
      );

      const { accessToken, refreshToken, user } = response.data;

      // Lưu thông tin auth vào localStorage
      saveAuthData(accessToken, refreshToken, user);

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Đăng xuất
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Luôn clear auth data dù có lỗi hay không
      clearAuthData();
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosClient.post(
        API_ENDPOINTS.AUTH.REFRESH,
        refreshTokenDto
      );

      const { accessToken, refreshToken, user } = response.data;

      // Cập nhật tokens mới
      saveAuthData(accessToken, refreshToken, user);

      return response.data;
    } catch (error: any) {
      // Nếu refresh token thất bại, clear auth data
      clearAuthData();
      throw this.handleError(error);
    }
  }

  /**
   * Lấy thông tin user hiện tại
   * GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axiosClient.get(
        API_ENDPOINTS.AUTH.ME
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cập nhật thông tin profile
   * PUT /api/v1/auth/me
   */
  async updateProfile(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axiosClient.put(
        API_ENDPOINTS.AUTH.ME,
        updateUserDto
      );

      // Cập nhật user trong localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Đổi mật khẩu
   * PUT /api/v1/auth/change-password
   */
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await axiosClient.put(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        changePasswordDto
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Kiểm tra user đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return !!accessToken;
  }

  /**
   * Lấy access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Lấy refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Lấy user từ localStorage
   */
  getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Có lỗi xảy ra';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Something else happened
      return new Error(error.message || 'Có lỗi xảy ra');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
