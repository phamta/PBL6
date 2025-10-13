import axiosClient from './axios';
import { API_ENDPOINTS } from './config';

export type GuestStatus = 'REGISTERED' | 'APPROVED' | 'ARRIVED' | 'DEPARTED' | 'CANCELLED';

export interface GuestMember {
  id?: string;
  fullName: string;
  nationality: string;
  passportNumber: string;
  position: string;
  organization: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  title?: string;
  gender?: string;
  affiliation?: string;
  passportFile?: string;
}

export interface GuestWithRelations {
  id: string;
  groupName?: string;
  purpose: string;
  arrivalDate: string;
  departureDate: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  totalMembers: number;
  notes?: string;
  attachments?: any;
  status: GuestStatus;
  createdAt: string;
  updatedAt: string;
  // New fields
  visitPurpose?: string;
  hostDepartment?: string;
  invitationLetterNo?: string;
  immigrationDocNA2?: string;
  visaRequestDocNA5?: string;
  reportFile?: string;
  partnerId?: string;
  unitId?: string;
  // Relations
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
  };
  partner?: {
    id: string;
    name: string;
    country: string;
    contactEmail: string;
  };
  unit?: {
    id: string;
    name: string;
    code: string;
  };
  members: GuestMember[];
}

export interface GuestListResult {
  guests: GuestWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GuestStats {
  totalGuests: number;
  byStatus: { status: GuestStatus; count: number }[];
  upcomingArrivals: number;
  currentGuests: number;
  myGuests: number;
}

export interface FilterGuestDto {
  search?: string;
  status?: GuestStatus;
  nationality?: string;
  arrivalDateFrom?: string;
  arrivalDateTo?: string;
  departureDateFrom?: string;
  departureDateTo?: string;
  createdById?: string;
  approvedById?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateGuestDto {
  groupName?: string;
  purpose: string;
  arrivalDate: string;
  departureDate: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  totalMembers?: number;
  notes?: string;
  attachments?: any;
  members?: GuestMember[];
  visitPurpose?: string;
  hostDepartment?: string;
  invitationLetterNo?: string;
  immigrationDocNA2?: string;
  visaRequestDocNA5?: string;
  reportFile?: string;
  partnerId?: string;
  unitId?: string;
}

export interface UpdateGuestDto {
  groupName?: string;
  purpose?: string;
  arrivalDate?: string;
  departureDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  totalMembers?: number;
  notes?: string;
  attachments?: any;
  visitPurpose?: string;
  hostDepartment?: string;
  invitationLetterNo?: string;
  immigrationDocNA2?: string;
  visaRequestDocNA5?: string;
  reportFile?: string;
  partnerId?: string;
  unitId?: string;
}

export interface ApproveGuestDto {
  notes?: string;
}

export interface RejectGuestDto {
  reason: string;
  notes?: string;
}

class GuestService {
  async list(params: FilterGuestDto = {}): Promise<GuestListResult> {
    const response = await axiosClient.get(API_ENDPOINTS.GUESTS.LIST, { params });
    return response.data;
  }

  async getStats(): Promise<GuestStats> {
    const response = await axiosClient.get(API_ENDPOINTS.GUESTS.STATS);
    return response.data;
  }

  async getById(id: string): Promise<GuestWithRelations> {
    const response = await axiosClient.get(API_ENDPOINTS.GUESTS.DETAIL(id));
    return response.data;
  }

  async create(data: CreateGuestDto): Promise<GuestWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.GUESTS.CREATE, data);
    return response.data;
  }

  async update(id: string, data: UpdateGuestDto): Promise<GuestWithRelations> {
    const response = await axiosClient.patch(API_ENDPOINTS.GUESTS.UPDATE(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.GUESTS.DELETE(id));
  }

  async approve(id: string, data: ApproveGuestDto): Promise<GuestWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.GUESTS.APPROVE(id), data);
    return response.data;
  }

  async reject(id: string, data: RejectGuestDto): Promise<GuestWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.GUESTS.REJECT(id), data);
    return response.data;
  }

  async checkIn(id: string): Promise<GuestWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.GUESTS.CHECKIN(id));
    return response.data;
  }

  async checkOut(id: string): Promise<GuestWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.GUESTS.CHECKOUT(id));
    return response.data;
  }
}

export const guestService = new GuestService();
