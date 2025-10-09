/**
 * Axios Client Configuration
 * Cấu hình axios với interceptors cho JWT authentication
 */

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, AUTH_STORAGE_KEYS, API_ENDPOINTS } from './config';

// Create axios instance
export const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Thêm access token vào header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh và unwrap response
axiosClient.interceptors.response.use(
  (response) => {
    // Unwrap response nếu có structure {success, data, ...}
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log('🔄 Unwrapping response data');
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refresh token
        const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          // Không có refresh token, redirect to login
          clearAuthData();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken }
        );

        // Unwrap nếu cần
        let tokens = response.data;
        if (tokens && typeof tokens === 'object' && 'data' in tokens) {
          tokens = tokens.data;
        }

        const { accessToken, refreshToken: newRefreshToken } = tokens;

        // Lưu tokens mới
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Retry request với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear auth data và redirect
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

// Helper function to save auth data
export const saveAuthData = (accessToken: string, refreshToken: string, user: any) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
};

// Helper function to get user from storage
export const getUserFromStorage = () => {
  const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

export default axiosClient;
