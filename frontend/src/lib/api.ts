/**
 * API Client - Main axios instance with interceptors for authentication
 * Handles token management, request/response interceptors, and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, AUTH_CONFIG, getApiUrl } from './config';
import type { ApiResponse } from './types';

// ============ Token Management ============
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  },

  saveUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
};

// ============ Create Axios Instance ============
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Quan trọng cho CORS với cookies
});

// ============ Request Interceptor ============
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm access token vào header nếu có
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request trong development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============ Response Interceptor ============
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Log response trong development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    // Return data directly nếu response có cấu trúc { success, data }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log error trong development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đợi trong queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        // Không có refresh token, redirect to login
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Call refresh token API
        const response = await axios.post(
          getApiUrl('/auth/refresh'),
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Save new tokens
        tokenManager.setTokens(accessToken, newRefreshToken);

        // Update Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi';
    
    // Show error notification (có thể tích hợp với toast/notification library)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorMessage);
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// ============ Helper Functions ============

/**
 * Wrapper cho GET request
 */
export const get = async <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data;
};

/**
 * Wrapper cho POST request
 */
export const post = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data;
};

/**
 * Wrapper cho PUT request
 */
export const put = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data;
};

/**
 * Wrapper cho PATCH request
 */
export const patch = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data;
};

/**
 * Wrapper cho DELETE request
 */
export const del = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data;
};

/**
 * Upload file với multipart/form-data
 */
export const uploadFile = async <T = any>(
  url: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default apiClient;
