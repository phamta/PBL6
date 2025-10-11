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

class DocumentsService {
    async list(params: DocumentListQuery = {}): Promise<PaginatedDocuments> {
        const res = await axiosClient.get(API_ENDPOINTS.DOCUMENTS.LIST, { params });
        // Map response: backend trả { data: [...], total, page, limit, totalPages }
        // Chuyển thành { items: [...], total, page, limit, totalPages }
        const responseData = res.data;
        return {
            items: responseData.data || [],  // Array documents
            total: responseData.total || 0,
            page: responseData.page || 1,
            limit: responseData.limit || 10,
            totalPages: responseData.totalPages || 0,
        } as PaginatedDocuments;
    }

    async stats(): Promise<DocumentStats> {
        const res = await axiosClient.get(API_ENDPOINTS.DOCUMENTS.STATS);
        return res.data as DocumentStats;
    }
}

export const documentsService = new DocumentsService();
export default documentsService;


