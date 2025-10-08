/**
 * Documents API Service
 * Handles document-related API calls (MOU, hợp tác quốc tế)
 */

import { get, post, put, del } from '../api';
import type {
  Document,
  CreateDocumentRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '../types';

// ============ Document APIs ============

/**
 * Lấy danh sách documents với phân trang và tìm kiếm
 */
export const getDocuments = async (params?: SearchParams): Promise<PaginatedResponse<Document>> => {
  return await get<PaginatedResponse<Document>>('/documents', params) as any;
};

/**
 * Lấy chi tiết một document
 */
export const getDocumentById = async (id: string): Promise<ApiResponse<Document>> => {
  return await get<Document>(`/documents/${id}`);
};

/**
 * Tạo document mới
 */
export const createDocument = async (data: CreateDocumentRequest): Promise<ApiResponse<Document>> => {
  return await post<Document>('/documents', data);
};

/**
 * Cập nhật document
 */
export const updateDocument = async (
  id: string,
  data: Partial<CreateDocumentRequest>
): Promise<ApiResponse<Document>> => {
  return await put<Document>(`/documents/${id}`, data);
};

/**
 * Xóa document
 */
export const deleteDocument = async (id: string): Promise<ApiResponse<void>> => {
  return await del<void>(`/documents/${id}`);
};

/**
 * Phê duyệt document
 */
export const approveDocument = async (id: string): Promise<ApiResponse<Document>> => {
  return await post<Document>(`/documents/${id}/approve`);
};

/**
 * Từ chối document
 */
export const rejectDocument = async (id: string, reason?: string): Promise<ApiResponse<Document>> => {
  return await post<Document>(`/documents/${id}/reject`, { reason });
};

/**
 * Lấy danh sách documents sắp hết hạn
 */
export const getExpiringDocuments = async (days: number = 30): Promise<ApiResponse<Document[]>> => {
  return await get<Document[]>('/documents/expiring', { days });
};

// Export default object
export default {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  approveDocument,
  rejectDocument,
  getExpiringDocuments,
};
