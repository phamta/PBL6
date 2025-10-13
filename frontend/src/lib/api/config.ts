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
    PATCH: (id: string) => `/documents/${id}`,
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
    STATS: '/guests/statistics',
    DETAIL: (id: string) => `/guests/${id}`,
    CREATE: '/guests',
    UPDATE: (id: string) => `/guests/${id}`,
    DELETE: (id: string) => `/guests/${id}`,
    APPROVE: (id: string) => `/guests/${id}/approve`,
    REJECT: (id: string) => `/guests/${id}/reject`,
    CHECKIN: (id: string) => `/guests/${id}/check-in`,
    CHECKOUT: (id: string) => `/guests/${id}/check-out`,
  },
  // Visa endpoints
  VISAS: {
    LIST: '/visas',
    DETAIL: (id: string) => `/visas/${id}`,
    FOREIGN_STUDENTS_BY_UNIT: (unitId: string) => `/visas/foreign-students/unit/${unitId}`,
    FOREIGN_STUDENTS_BY_MYUNIT: '/visas/foreign-students/my-unit',
    CREATE_EXTENSION: (id: string) => `/visas/${id}/extend`,
  },
  // Translation endpoints
  TRANSLATIONS: {
    LIST: '/api/v1/translations',
    STATS: '/api/v1/translations/stats',
    DETAIL: (id: string) => `/api/v1/translations/${id}`,
    CREATE: '/api/v1/translations',
    UPDATE: (id: string) => `/api/v1/translations/${id}`,
    DELETE: (id: string) => `/api/v1/translations/${id}`,
    APPROVE: (id: string) => `/api/v1/translations/${id}/approve`,
    REJECT: (id: string) => `/api/v1/translations/${id}/reject`,
    COMPLETE: (id: string) => `/api/v1/translations/${id}/complete`,
  },
  // Report endpoints
  REPORTS: {
    LIST: '/reports',
    STATS: '/reports/stats',
  },
  // Partner endpoints
  PARTNERS: {
    LIST: '/partners',
    ALL: '/partners/all',
    DETAIL: (id: string) => `/partners/${id}`,
  },
  // Notification endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
} as const;
