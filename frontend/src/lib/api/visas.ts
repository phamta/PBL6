/**
 * Visas API Service
 * Handles visa management API calls
 */

import { get, post, put, del } from '../api';
import type {
  Visa,
  CreateVisaRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '../types';

// ============ Visa APIs ============

/**
 * Lấy danh sách visas với phân trang và tìm kiếm
 */
export const getVisas = async (params?: SearchParams): Promise<PaginatedResponse<Visa>> => {
  return await get<PaginatedResponse<Visa>>('/visas', params) as any;
};

/**
 * Lấy chi tiết một visa
 */
export const getVisaById = async (id: string): Promise<ApiResponse<Visa>> => {
  return await get<Visa>(`/visas/${id}`);
};

/**
 * Tạo visa mới
 */
export const createVisa = async (data: CreateVisaRequest): Promise<ApiResponse<Visa>> => {
  return await post<Visa>('/visas', data);
};

/**
 * Cập nhật visa
 */
export const updateVisa = async (
  id: string,
  data: Partial<CreateVisaRequest>
): Promise<ApiResponse<Visa>> => {
  return await put<Visa>(`/visas/${id}`, data);
};

/**
 * Xóa visa
 */
export const deleteVisa = async (id: string): Promise<ApiResponse<void>> => {
  return await del<void>(`/visas/${id}`);
};

/**
 * Phê duyệt visa
 */
export const approveVisa = async (id: string): Promise<ApiResponse<Visa>> => {
  return await post<Visa>(`/visas/${id}/approve`);
};

/**
 * Từ chối visa
 */
export const rejectVisa = async (id: string, reason?: string): Promise<ApiResponse<Visa>> => {
  return await post<Visa>(`/visas/${id}/reject`, { reason });
};

/**
 * Gia hạn visa
 */
export const extendVisa = async (id: string, newExpiryDate: string): Promise<ApiResponse<Visa>> => {
  return await post<Visa>(`/visas/${id}/extend`, { newExpiryDate });
};

/**
 * Lấy danh sách visas sắp hết hạn
 */
export const getExpiringVisas = async (days: number = 30): Promise<ApiResponse<Visa[]>> => {
  return await get<Visa[]>('/visas/expiring', { days });
};

/**
 * Lấy visas của một guest
 */
export const getVisasByGuestId = async (guestId: string): Promise<ApiResponse<Visa[]>> => {
  return await get<Visa[]>(`/visas/guest/${guestId}`);
};

// Export default object
export default {
  getVisas,
  getVisaById,
  createVisa,
  updateVisa,
  deleteVisa,
  approveVisa,
  rejectVisa,
  extendVisa,
  getExpiringVisas,
  getVisasByGuestId,
};
