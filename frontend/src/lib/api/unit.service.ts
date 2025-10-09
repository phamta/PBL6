/**
 * Unit Service - API calls cho quản lý đơn vị
 */

import axiosClient from './axios';
import { API_ENDPOINTS } from './config';
import {
  Unit,
  QueryUnitsDto,
  PaginatedResponse,
} from './types';
import { AxiosResponse } from 'axios';

class UnitService {
  /**
   * Lấy danh sách đơn vị với pagination
   * GET /api/v1/units
   */
  async getUnits(params?: QueryUnitsDto): Promise<PaginatedResponse<Unit>> {
    try {
      const response: AxiosResponse<PaginatedResponse<Unit>> = await axiosClient.get(
        API_ENDPOINTS.UNITS.LIST,
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy chi tiết đơn vị
   * GET /api/v1/units/:id
   */
  async getUnitById(id: string): Promise<Unit> {
    try {
      const response: AxiosResponse<Unit> = await axiosClient.get(
        API_ENDPOINTS.UNITS.DETAIL(id)
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy cây phân cấp đơn vị
   * GET /api/v1/units/hierarchy
   */
  async getUnitHierarchy(): Promise<Unit[]> {
    try {
      const response: AxiosResponse<Unit[]> = await axiosClient.get(
        API_ENDPOINTS.UNITS.HIERARCHY
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Có lỗi xảy ra';
      return new Error(message);
    } else if (error.request) {
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      return new Error(error.message || 'Có lỗi xảy ra');
    }
  }
}

// Export singleton instance
export const unitService = new UnitService();
export default unitService;