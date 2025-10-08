/**
 * Guests API Service
 * Handles guest management API calls
 */

import { get, post, put, del } from '../api';
import type {
  Guest,
  CreateGuestRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '../types';

// ============ Guest APIs ============

/**
 * Lấy danh sách guests với phân trang và tìm kiếm
 */
export const getGuests = async (params?: SearchParams): Promise<PaginatedResponse<Guest>> => {
  return await get<PaginatedResponse<Guest>>('/guests', params) as any;
};

/**
 * Lấy chi tiết một guest
 */
export const getGuestById = async (id: string): Promise<ApiResponse<Guest>> => {
  return await get<Guest>(`/guests/${id}`);
};

/**
 * Tạo guest mới
 */
export const createGuest = async (data: CreateGuestRequest): Promise<ApiResponse<Guest>> => {
  return await post<Guest>('/guests', data);
};

/**
 * Cập nhật guest
 */
export const updateGuest = async (
  id: string,
  data: Partial<CreateGuestRequest>
): Promise<ApiResponse<Guest>> => {
  return await put<Guest>(`/guests/${id}`, data);
};

/**
 * Xóa guest
 */
export const deleteGuest = async (id: string): Promise<ApiResponse<void>> => {
  return await del<void>(`/guests/${id}`);
};

/**
 * Lấy danh sách guests đang có mặt
 */
export const getCurrentGuests = async (): Promise<ApiResponse<Guest[]>> => {
  return await get<Guest[]>('/guests/current');
};

/**
 * Tìm kiếm guest theo passport number
 */
export const searchGuestByPassport = async (passportNumber: string): Promise<ApiResponse<Guest>> => {
  return await get<Guest>(`/guests/search/passport/${passportNumber}`);
};

// Export default object
export default {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  getCurrentGuests,
  searchGuestByPassport,
};
