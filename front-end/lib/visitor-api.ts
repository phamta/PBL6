import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export enum VisitorGender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum VisitorPurpose {
  ACADEMIC_EXCHANGE = 'Academic Exchange',
  RESEARCH_COLLABORATION = 'Research Collaboration',
  CONFERENCE = 'Conference',
  WORKSHOP = 'Workshop',
  TRAINING = 'Training',
  BUSINESS_MEETING = 'Business Meeting',
  CULTURAL_EXCHANGE = 'Cultural Exchange',
  OTHER = 'Other',
}

export enum ReportFormat {
  EXCEL = 'excel',
  PDF = 'pdf',
  WORD = 'word',
}

export enum ReportPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export interface Visitor {
  id: string;
  fullName: string;
  nationality: string;
  passportNumber: string;
  gender: VisitorGender;
  dateOfBirth: string;
  position: string;
  organization: string;
  email: string;
  phoneNumber: string;
  arrivalDateTime: string;
  departureDateTime: string;
  purpose: VisitorPurpose;
  purposeDetails?: string;
  invitingUnit: string;
  passportScanPath?: string;
  documentPath?: string;
  visitorCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitorDto {
  fullName: string;
  nationality: string;
  passportNumber: string;
  gender: VisitorGender;
  dateOfBirth: string;
  position: string;
  organization: string;
  email: string;
  phoneNumber: string;
  arrivalDateTime: string;
  departureDateTime: string;
  purpose: VisitorPurpose;
  purposeDetails?: string;
  invitingUnit: string;
}

export interface UpdateVisitorDto extends Partial<CreateVisitorDto> {}

export interface VisitorReportDto {
  invitingUnit?: string;
  startDate?: string;
  endDate?: string;
  period?: ReportPeriod;
  format?: ReportFormat;
  year?: string;
  month?: string;
  quarter?: string;
}

export interface VisitorListResponse {
  data: Visitor[];
  total: number;
  page: number;
  totalPages: number;
}

export interface VisitorQuery {
  invitingUnit?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const visitorAPI = {
  // Get all visitors with filtering and pagination
  getVisitors: async (query?: VisitorQuery): Promise<VisitorListResponse> => {
    const params = new URLSearchParams();
    
    if (query?.invitingUnit) params.append('invitingUnit', query.invitingUnit);
    if (query?.startDate) params.append('startDate', query.startDate);
    if (query?.endDate) params.append('endDate', query.endDate);
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const response = await apiClient.get(`/visitor?${params.toString()}`);
    return response.data;
  },

  // Get single visitor by ID
  getVisitor: async (id: string): Promise<Visitor> => {
    const response = await apiClient.get(`/visitor/${id}`);
    return response.data;
  },

  // Create new visitor
  createVisitor: async (
    data: CreateVisitorDto,
    files?: {
      passportScan?: File;
      document?: File;
    }
  ): Promise<Visitor> => {
    const formData = new FormData();
    
    // Add visitor data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add files
    if (files?.passportScan) {
      formData.append('passportScan', files.passportScan);
    }
    if (files?.document) {
      formData.append('document', files.document);
    }

    const response = await apiClient.post('/visitor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update visitor
  updateVisitor: async (
    id: string,
    data: UpdateVisitorDto,
    files?: {
      passportScan?: File;
      document?: File;
    }
  ): Promise<Visitor> => {
    const formData = new FormData();
    
    // Add visitor data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add files
    if (files?.passportScan) {
      formData.append('passportScan', files.passportScan);
    }
    if (files?.document) {
      formData.append('document', files.document);
    }

    const response = await apiClient.patch(`/visitor/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete visitor
  deleteVisitor: async (id: string): Promise<void> => {
    await apiClient.delete(`/visitor/${id}`);
  },

  // Generate report
  generateReport: async (reportDto: VisitorReportDto): Promise<Blob> => {
    const params = new URLSearchParams();
    
    Object.entries(reportDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/visitor/report?${params.toString()}`, {
      responseType: 'blob',
    });
    
    return response.data;
  },

  // Download file
  downloadFile: async (filePath: string): Promise<Blob> => {
    const response = await apiClient.get(`/files/${filePath}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
