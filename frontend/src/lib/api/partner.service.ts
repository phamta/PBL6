/**
 * Partner Service - API calls cho quản lý đối tác
 */

import axiosClient from './axios';
import { API_ENDPOINTS } from './config';

export interface Partner {
  id: string;
  name: string;
  country?: string;
  address?: string;
  establishedYear?: number;
  field?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryPartnersDto {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  isActive?: boolean;
}

export interface PartnerListResult {
  partners: Partner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PartnerService {
  /**
   * Lấy danh sách đối tác với pagination
   * GET /api/v1/partners
   */
  async getPartners(params?: QueryPartnersDto): Promise<PartnerListResult> {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PARTNERS.LIST, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy tất cả đối tác (không pagination) - dùng cho dropdown
   * GET /api/v1/partners/all
   */
  async getAllPartners(): Promise<Partner[]> {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PARTNERS.ALL);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy chi tiết đối tác
   * GET /api/v1/partners/:id
   */
  async getPartnerById(id: string): Promise<Partner> {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PARTNERS.DETAIL(id));
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('An error occurred while fetching partners');
  }
}

export const partnerService = new PartnerService();