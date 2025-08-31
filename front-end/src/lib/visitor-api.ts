import apiClient from '@/lib/api-client';

export enum VisitorStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out'
}

export enum VisitorGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum VisitorPurpose {
  BUSINESS = 'business',
  ACADEMIC = 'academic',
  ACADEMIC_EXCHANGE = 'academic_exchange',
  RESEARCH_COLLABORATION = 'research_collaboration',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  TRAINING = 'training',
  BUSINESS_MEETING = 'business_meeting',
  CULTURAL_EXCHANGE = 'cultural_exchange',
  RESEARCH = 'research',
  PERSONAL = 'personal',
  OTHER = 'other'
}

export interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  phoneNumber?: string; // Alternative field name
  organization?: string;
  position?: string;
  nationality: string;
  passportNumber?: string;
  gender: VisitorGender;
  dateOfBirth?: string;
  purpose: VisitorPurpose;
  purposeDescription?: string;
  visitDate: string;
  visitTime?: string;
  arrivalDateTime?: string;
  departureDateTime?: string;
  duration?: number;
  hostName?: string;
  hostEmail?: string;
  hostPhone?: string;
  department?: string;
  building?: string;
  room?: string;
  notes?: string;
  status: VisitorStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  [key: string]: any; // Allow additional properties
}

export interface CreateVisitorDto {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  position?: string;
  nationality: string;
  passportNumber?: string;
  gender: VisitorGender;
  dateOfBirth?: string;
  purpose: VisitorPurpose;
  purposeDescription?: string;
  visitDate: string;
  visitTime?: string;
  duration?: number;
  hostName?: string;
  hostEmail?: string;
  hostPhone?: string;
  department?: string;
  building?: string;
  room?: string;
  notes?: string;
  [key: string]: any; // Allow additional properties
}

export type UpdateVisitorDto = Partial<CreateVisitorDto>;

export interface VisitorFilters {
  status?: VisitorStatus;
  purpose?: VisitorPurpose;
  startDate?: string;
  endDate?: string;
  search?: string;
  hostName?: string;
  department?: string;
  limit?: number;
  page?: number;
}

export const visitorAPI = {
  getAll: async (filters?: VisitorFilters): Promise<{ data: Visitor[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/visitors?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Visitor> => {
    const response = await apiClient.get(`/visitors/${id}`);
    return response.data;
  },

  create: async (data: CreateVisitorDto): Promise<Visitor> => {
    const response = await apiClient.post('/visitors', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateVisitorDto>): Promise<Visitor> => {
    const response = await apiClient.put(`/visitors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/visitors/${id}`);
  },

  updateStatus: async (id: string, status: VisitorStatus): Promise<Visitor> => {
    const response = await apiClient.patch(`/visitors/${id}/status`, { status });
    return response.data;
  },

  checkIn: async (id: string): Promise<Visitor> => {
    const response = await apiClient.post(`/visitors/${id}/check-in`);
    return response.data;
  },

  checkOut: async (id: string): Promise<Visitor> => {
    const response = await apiClient.post(`/visitors/${id}/check-out`);
    return response.data;
  },

  approve: async (id: string): Promise<Visitor> => {
    const response = await apiClient.post(`/visitors/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, reason?: string): Promise<Visitor> => {
    const response = await apiClient.post(`/visitors/${id}/reject`, { reason });
    return response.data;
  }
};
