import axiosClient from './axios';
import { API_ENDPOINTS } from './config';

export type DocumentStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'SIGNED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type DocumentType = 'MOU' | 'MOA' | 'AGREEMENT' | 'LOI' | string;

export interface DocumentItem {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  partnerName: string;
  partnerCountry?: string;
  signingLevel?: string;
  contactPerson?: string;
  updatedAt: string;
  createdAt: string;
}

export interface FullDocument {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  partnerName?: string;
  partnerCountry?: string;
  partnerAddress?: string;
  partnerField?: string;
  description?: string;
  content?: string;
  proposingUnit?: string;
  signingLevel?: string;
  signedBy?: string;
  isHighLevelDelegation?: boolean;
  cooperationField?: string;
  proposalReason?: string;
  handlingStatus?: string;
  signedDate?: string | null;
  effectiveDate?: string | null;
  expirationDate?: string | null;
  attachments?: { path: string }[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
    unitId?: string | null;
  };
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  partner?: {
    id: string;
    name: string;
    country?: string | null;
    contactEmail?: string | null;
  } | null;
  unit?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
}

export interface DocumentListQuery {
  page?: number;
  limit?: number;
  status?: DocumentStatus;
  type?: DocumentType;
  partnerName?: string;
  partnerCountry?: string;
  year?: number;
  search?: string;
  expiringInDays?: number;
}

export interface PaginatedDocuments {
  items: DocumentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentStats {
  byStatus: Record<string, number>;
  expiringSoon?: number;
  total: number;
}

export type CreateDocumentData = {
  title: string;
  type?: string;
  partnerName: string;
  partnerCountry: string;
  partnerAddress?: string;
  partnerField?: string;
  description: string;
  content?: string;
  proposingUnit?: string;
  signingLevel?: string;
  signedBy?: string;
  isHighLevelDelegation?: boolean;
  cooperationField?: string;
  proposalReason?: string;
  handlingStatus?: string;
  partnerId?: string;
  unitId?: string;
  validFrom?: string;
  validTo?: string;
  signedDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  attachments?: string[];
  notes?: string;
  partnerContact?: string;
  expectedBenefits?: string;
};

export type UpdateDocumentData = Omit<Partial<CreateDocumentData>, 'type'>; // Exclude 'type' to avoid validation error

class DocumentsService {
  private handleResponse<T>(res: any): T {
    const { data, success } = res.data;
    if (success !== undefined) {
      return data || res.data as T;
    }
    return res.data as T;
  }

  private handleError(error: any): never {
    console.error('API Error:', error);
    throw error;
  }

  async list(params: DocumentListQuery = {}): Promise<PaginatedDocuments> {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.DOCUMENTS.LIST, { params });
      const responseData = this.handleResponse<typeof res.data>(res);
      return {
        items: (responseData.data || responseData.items || []).map((item: any) => ({
          ...item,
          contactPerson: item.createdBy?.fullName || '',
        })),
        total: responseData.total || 0,
        page: responseData.page || 1,
        limit: responseData.limit || 10,
        totalPages: responseData.totalPages || 0,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async get(id: string): Promise<FullDocument> {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.DOCUMENTS.DETAIL(id));
      return this.handleResponse<FullDocument>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: CreateDocumentData): Promise<DocumentItem> {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.DOCUMENTS.CREATE, data);
      return this.handleResponse<DocumentItem>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: UpdateDocumentData): Promise<DocumentItem> {
    try {
      const res = await axiosClient.patch(API_ENDPOINTS.DOCUMENTS.PATCH(id), data);
      return this.handleResponse<DocumentItem>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async submit(id: string): Promise<DocumentItem> {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.DOCUMENTS.SUBMIT(id));
      return this.handleResponse<DocumentItem>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async startReview(id: string): Promise<DocumentItem> {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.DOCUMENTS.REVIEW(id));
      return this.handleResponse<DocumentItem>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async approve(id: string, payload: { comment: string; notes?: string; nextSteps?: string }) {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.DOCUMENTS.APPROVE(id), payload);
      return this.handleResponse<any>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async reject(id: string, payload: { comment: string; notes?: string; nextSteps?: string }) {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.DOCUMENTS.REJECT(id), payload);
      return this.handleResponse<any>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async addFeedback(id: string, payload: { content: string; attachments?: string[] }) {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.DOCUMENTS.DETAIL(id) + '/feedback', payload);
      return this.handleResponse<any>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async resubmit(id: string) {
    try {
      const res = await axiosClient.patch(API_ENDPOINTS.DOCUMENTS.PATCH(id) + '/resubmit');
      return this.handleResponse<any>(res);
    } catch (error) {
      this.handleError(error);
    }
  }

  async stats(): Promise<DocumentStats> {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.DOCUMENTS.STATS);
      return this.handleResponse<DocumentStats>(res);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const documentsService = new DocumentsService();
export default documentsService;