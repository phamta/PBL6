/**
 * API Configuration and Utilities
 * Centralized API configuration for the application
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Get API base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export { apiClient };

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
  },

  // Admin endpoints
  admin: {
    users: '/admin/users',
    roles: '/admin/roles',
    systemLogs: '/admin/system-logs',
    statistics: '/admin/statistics',
  },

  // Module endpoints
  mou: {
    base: '/mou',
    export: '/reports/mou/excel',
  },

  visa: {
    base: '/visa',
    export: '/reports/visa/excel',
  },

  visitor: {
    base: '/visitor',
    export: '/reports/visitor/excel',
  },

  translation: {
    base: '/translation',
    export: '/reports/translation/excel',
  },

  // Report endpoints
  reports: {
    dashboard: '/reports/dashboard',
    export: '/reports/export',
  },
} as const;

/**
 * API Service Methods
 */
export const api = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};

/**
 * Auth API methods
 */
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return api.post(API_ENDPOINTS.auth.login, credentials);
  },

  logout: async () => {
    return api.post(API_ENDPOINTS.auth.logout);
  },

  getProfile: async () => {
    return api.get(API_ENDPOINTS.auth.profile);
  },

  refreshToken: async () => {
    return api.post(API_ENDPOINTS.auth.refresh);
  },
};

/**
 * Utility Functions for backward compatibility
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  const url = new URL(endpoint, API_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};

/**
 * Download file from API
 */
export const downloadFile = async (endpoint: string, filename: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(buildApiUrl(endpoint), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } else {
    throw new Error('Download failed');
  }
};

// Application configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Hệ thống Quản lý Hợp tác Quốc tế',
  universityName: process.env.NEXT_PUBLIC_UNIVERSITY_NAME || 'Trường Đại học Bách Khoa Đà Nẵng',
  version: '1.0.0',
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} as const;
