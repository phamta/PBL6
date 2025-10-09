/**
 * TypeScript Types & Interfaces cho Authentication & User Management
 */

// ==================== User & Role Types ====================

export interface Unit {
  id: string;
  name: string;
  code?: string;
  level: number;
  parentId?: string;
  parent?: Unit;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  assignedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  unitId?: string;
  unit?: Unit;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles?: UserRole[];
}

// ==================== Auth DTOs ====================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  unitId?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UpdateUserDto {
  fullName?: string;
  phoneNumber?: string;
  unitId?: string;
}

// ==================== Auth Response Types ====================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

// ==================== API Response Wrapper ====================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ==================== Pagination Types ====================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ==================== Query Types ====================

export interface QueryUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  unitId?: string;
  roleId?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'fullName' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export interface QueryUnitsDto {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  level?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeChildren?: boolean;
  includeUsers?: boolean;
}

// ==================== User Stats ====================

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleDistribution: Array<{
    role: string;
    description: string;
    count: number;
  }>;
}

// ==================== Auth Context Types ====================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserDto) => Promise<void>;
  changePassword: (data: ChangePasswordDto) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ==================== Permission & Action Types ====================

export interface Action {
  id: string;
  code: string;
  name: string;
  category: string;
  description?: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  actions: Action[];
}

// ==================== Type Guards ====================

export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiErrorResponse(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.success === false;
}
