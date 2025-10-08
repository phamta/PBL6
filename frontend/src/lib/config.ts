/**
 * Configuration file for API and application settings
 */

export const API_CONFIG = {
  // Base URL cho backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // API version prefix
  API_VERSION: '/api/v1',
  
  // Timeout cho requests (ms)
  TIMEOUT: 30000,
  
  // Có bật retry khi request failed không
  RETRY_ENABLED: true,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

export const AUTH_CONFIG = {
  // Key để lưu tokens trong localStorage
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  
  // Token expiry buffer (ms) - refresh token trước khi hết hạn 5 phút
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000,
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng',
  APP_SHORT_NAME: 'HTQT ĐHBK',
} as const;

// Lấy full API URL
export const getApiUrl = (endpoint: string = ''): string => {
  const base = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;
  return endpoint ? `${base}${endpoint}` : base;
};
