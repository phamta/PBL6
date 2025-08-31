import apiClient from '@/lib/api-client';

export interface TranslationRequest {
  id: string;
  title: string;
  description: string;
  status: TranslationStatus;
  sourceLanguage: string;
  targetLanguage: string;
  languagePair?: string;
  documentType?: DocumentType;
  originalDocument?: string;
  originalDocumentTitle?: string;
  originalFilePath?: string;
  translatedDocument?: string;
  translatedFilePath?: string;
  confirmationDocument?: string;
  confirmationDocumentPath?: string;
  requesterName: string;
  requesterEmail: string;
  requestDate: string;
  requestCode?: string;
  submittingUnit?: string;
  purpose?: string;
  createdAt?: string;
  approvedAt?: string;
  revisionCount?: number;
  reviewComments?: string;
  completedDate?: string;
  translatorNotes?: string;
}

export enum TranslationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  REVISION_REQUESTED = 'revision_requested',
  NEEDS_REVISION = 'needs_revision'
}

export enum DocumentType {
  PASSPORT = 'passport',
  VISA = 'visa',
  CERTIFICATE = 'certificate',
  CONTRACT = 'contract',
  ACADEMIC_PAPER = 'academic_paper',
  OTHER = 'other'
}

export enum LanguagePair {
  EN_VI = 'en-vi',
  VI_EN = 'vi-en',
  KO_VI = 'ko-vi',
  VI_KO = 'vi-ko',
  JA_VI = 'ja-vi',
  VI_JA = 'vi-ja',
  ZH_VI = 'zh-vi',
  VI_ZH = 'vi-zh'
}

export interface CreateTranslationRequestForm {
  title?: string;
  originalDocumentTitle?: string;
  description?: string;
  documentType: DocumentType;
  languagePair: LanguagePair;
  originalDocument?: File;
  requesterName?: string;
  requesterEmail?: string;
  purpose?: string;
  submittingUnit?: string;
}

export interface TranslationRequestFilters {
  status?: TranslationStatus;
  documentType?: DocumentType;
  languagePair?: LanguagePair;
  submittingUnit?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export const translationRequestAPI = {
  getAll: async (filters?: TranslationRequestFilters): Promise<{ data: TranslationRequest[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/translation-requests?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<TranslationRequest> => {
    const response = await apiClient.get(`/translation-requests/${id}`);
    return response.data;
  },

  create: async (data: Partial<TranslationRequest>): Promise<TranslationRequest> => {
    const response = await apiClient.post('/translation-requests', data);
    return response.data;
  },

  update: async (id: string, data: Partial<TranslationRequest>): Promise<TranslationRequest> => {
    const response = await apiClient.put(`/translation-requests/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/translation-requests/${id}`);
  },

  updateStatus: async (id: string, status: TranslationStatus): Promise<TranslationRequest> => {
    const response = await apiClient.patch(`/translation-requests/${id}/status`, { status });
    return response.data;
  },

  startReview: async (id: string): Promise<TranslationRequest> => {
    const response = await apiClient.post(`/translation-requests/${id}/start-review`);
    return response.data;
  },

  submitReview: async (id: string, reviewData: any): Promise<TranslationRequest> => {
    const response = await apiClient.post(`/translation-requests/${id}/submit-review`, reviewData);
    return response.data;
  },

  approve: async (id: string): Promise<TranslationRequest> => {
    const response = await apiClient.post(`/translation-requests/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, data?: { reviewComments?: string; reason?: string }): Promise<TranslationRequest> => {
    const response = await apiClient.post(`/translation-requests/${id}/reject`, data);
    return response.data;
  },

  requestRevision: async (id: string, data: { reviewComments: string }): Promise<TranslationRequest> => {
    const response = await apiClient.post(`/translation-requests/${id}/request-revision`, data);
    return response.data;
  },

  downloadOriginalDocument: async (id: string): Promise<void> => {
    const response = await apiClient.get(`/translation-requests/${id}/download/original`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Try to get filename from headers
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'original-document';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadTranslatedDocument: async (id: string): Promise<void> => {
    const response = await apiClient.get(`/translation-requests/${id}/download/translated`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Try to get filename from headers
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'translated-document';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadConfirmationDocument: async (id: string): Promise<void> => {
    const response = await apiClient.get(`/translation-requests/${id}/download/confirmation`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Try to get filename from headers
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'confirmation-document';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  uploadDocument: async (id: string, file: File, type: 'original' | 'translated'): Promise<TranslationRequest> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await apiClient.post(`/translation-requests/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
