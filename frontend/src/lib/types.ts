/**
 * TypeScript type definitions for API responses and data models
 */

// ============ Enum Types ============
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  DEPARTMENT_OFFICER = 'DEPARTMENT_OFFICER',
  LEADERSHIP = 'LEADERSHIP',
  FACULTY_STAFF = 'FACULTY_STAFF',
  STUDENT = 'STUDENT',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum VisaStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

// ============ User & Auth Types ============
export interface Unit {
  id: string;
  name: string;
  code?: string;
  type?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  unit?: Unit;
  unitId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  unitId?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  unitId?: string;
}

// ============ Document Types ============
export interface Document {
  id: string;
  title: string;
  documentNumber: string;
  documentType: string;
  signDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  content?: string;
  attachments?: string[];
  partnerId?: string;
  partner?: Partner;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  country: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface CreateDocumentRequest {
  title: string;
  documentNumber: string;
  documentType: string;
  signDate: string;
  expiryDate?: string;
  content?: string;
  partnerId?: string;
}

// ============ Guest Types ============
export interface Guest {
  id: string;
  fullName: string;
  nationality: string;
  passportNumber: string;
  email?: string;
  phoneNumber?: string;
  organization?: string;
  position?: string;
  purpose: string;
  arrivalDate: string;
  departureDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestRequest {
  fullName: string;
  nationality: string;
  passportNumber: string;
  email?: string;
  phoneNumber?: string;
  organization?: string;
  position?: string;
  purpose: string;
  arrivalDate: string;
  departureDate: string;
}

// ============ Visa Types ============
export interface Visa {
  id: string;
  guestId: string;
  guest?: Guest;
  visaType: string;
  visaNumber?: string;
  issueDate: string;
  expiryDate: string;
  status: VisaStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisaRequest {
  guestId: string;
  visaType: string;
  issueDate: string;
  expiryDate: string;
  notes?: string;
}

// ============ API Response Wrapper ============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ Query Parameters ============
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============ Notification Types ============
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

// ============ Activity Log Types ============
export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ============ Report Types ============
export interface ReportData {
  totalDocuments: number;
  expiringSoon: number;
  activeGuests: number;
  pendingVisas: number;
  // Thêm các fields khác tùy theo yêu cầu
}
