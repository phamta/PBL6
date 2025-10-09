export const API_BASE_URL = (typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1')
  : 'http://localhost:3001/api/v1');
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
    STATS: '/documents/stats',
    DETAIL: (id: string) => `/documents/${id}`,
    CREATE: '/documents',
    UPDATE: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    SUBMIT: (id: string) => `/documents/${id}/submit`,
    REVIEW: (id: string) => `/documents/${id}/review`,
    APPROVE: (id: string) => `/documents/${id}/approve`,
    REJECT: (id: string) => `/documents/${id}/reject`,
    SIGN: (id: string) => `/documents/${id}/sign`,
    ACTIVATE: (id: string) => `/documents/${id}/activate`,
    EXPIRE: (id: string) => `/documents/${id}/expire`,
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
