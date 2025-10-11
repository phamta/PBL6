/**
 * User Service - API calls cho quản lý người dùng
 */

import axiosClient from './axios';
import { API_ENDPOINTS } from './config';
import {
  User,
  QueryUsersDto,
  PaginatedResponse,
  UserStats,
} from './types';
import { AxiosResponse } from 'axios';

class UserService {
  /**
   * Lấy danh sách người dùng với pagination
   * GET /api/v1/users
   */
  async getUsers(params?: QueryUsersDto): Promise<PaginatedResponse<User>> {
    try {
      const response: AxiosResponse<PaginatedResponse<User>> = await axiosClient.get(
        API_ENDPOINTS.USERS.LIST,
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy chi tiết người dùng
   * GET /api/v1/users/:id
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axiosClient.get(
        API_ENDPOINTS.USERS.DETAIL(id)
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Tìm kiếm người dùng
   * GET /api/v1/users/search
   */
  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    try {
      const response: AxiosResponse<PaginatedResponse<User>> = await axiosClient.get(
        API_ENDPOINTS.USERS.SEARCH,
        {
          params: { q: query, page, limit }
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy thống kê người dùng
   * GET /api/v1/users/stats
   */
  async getUserStats(): Promise<UserStats> {
    try {
      const response: AxiosResponse<UserStats> = await axiosClient.get(
        API_ENDPOINTS.USERS.STATS
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Kích hoạt/vô hiệu hóa người dùng
   * PATCH /api/v1/users/:id/toggle-status
   */
  async toggleUserStatus(id: string): Promise<{ message: string; user: User }> {
    try {
      const response: AxiosResponse<{ message: string; user: User }> = await axiosClient.patch(
        API_ENDPOINTS.USERS.TOGGLE_STATUS(id)
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Xóa người dùng
   * DELETE /api/v1/users/:id
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await axiosClient.delete(
        API_ENDPOINTS.USERS.DELETE(id)
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
export const userService = new UserService();
export default userService;