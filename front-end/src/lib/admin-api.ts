import apiClient from './api-client';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface Role {
  id: string;
  roleName: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleId?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
}

export interface SystemConfig {
  id: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure: boolean;
  reminderEnabled: boolean;
  reminderT30: number;
  reminderT7: number;
  reminderT1: number;
}

export interface SystemStats {
  totalUsers: number;
  totalVisas: number;
  totalMous: number;
  totalTranslations: number;
  activeUsers: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  requestData?: string;
  createdAt: string;
  user?: {
    username: string;
    fullName: string;
  };
}

export interface PaginatedResponse<T> {
  users?: T[];
  logs?: T[];
  total: number;
  totalPages: number;
}

class AdminApiClient {
  // User Management APIs
  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.patch(`/admin/users/${id}/reset-password`, { newPassword });
  }

  async assignRole(userId: string, roleId: string): Promise<User> {
    const response = await apiClient.post(`/admin/users/${userId}/roles`, { roleId });
    return response.data;
  }

  async removeRole(userId: string, roleId: string): Promise<User> {
    const response = await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  // Role Management APIs
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get('/admin/roles');
    return response.data;
  }

  // System Configuration APIs
  async getSystemConfig(): Promise<SystemConfig> {
    const response = await apiClient.get('/admin/config');
    return response.data;
  }

  async updateSystemConfig(data: Partial<SystemConfig>): Promise<SystemConfig> {
    const response = await apiClient.put('/admin/config', data);
    return response.data;
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  }

  // Backup & Restore APIs
  async createBackup(description?: string): Promise<{ filePath: string; message: string }> {
    const response = await apiClient.post('/admin/backup', { description });
    return response.data;
  }

  async getBackups(): Promise<string[]> {
    const response = await apiClient.get('/admin/backups');
    return response.data;
  }

  async restoreBackup(file: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/admin/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Activity Logs APIs
  async getLogs(
    page: number = 1,
    limit: number = 50,
    userId?: string,
    action?: string
  ): Promise<PaginatedResponse<ActivityLog>> {
    let url = `/admin/logs?page=${page}&limit=${limit}`;
    if (userId) url += `&userId=${userId}`;
    if (action) url += `&action=${action}`;
    
    const response = await apiClient.get(url);
    return response.data;
  }
}

export const adminApi = new AdminApiClient();
