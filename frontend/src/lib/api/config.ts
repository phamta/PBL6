/**
 * API Configuration
 * Cấu hình cho axios client và các constants API
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // User endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    SEARCH: '/users/search',
    STATS: '/users/stats',
    TOGGLE_STATUS: (id: string) => `/users/${id}/toggle-status`,
    DELETE: (id: string) => `/users/${id}`,
  },
  // Unit endpoints
  UNITS: {
    LIST: '/units',
    DETAIL: (id: string) => `/units/${id}`,
    HIERARCHY: '/units/hierarchy',
  },
  // Document endpoints
  DOCUMENTS: {
    LIST: '/documents',
    DETAIL: (id: string) => `/documents/${id}`,
  },
  // Guest endpoints
  GUESTS: {
    LIST: '/guests',
    DETAIL: (id: string) => `/guests/${id}`,
  },
  // Visa endpoints
  VISAS: {
    LIST: '/visas',
    DETAIL: (id: string) => `/visas/${id}`,
  },
  // Translation endpoints
  TRANSLATIONS: {
    LIST: '/translations',
    DETAIL: (id: string) => `/translations/${id}`,
  },
  // Report endpoints
  REPORTS: {
    LIST: '/reports',
    STATS: '/reports/stats',
  },
  // Notification endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
} as const;
