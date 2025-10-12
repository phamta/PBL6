import axiosClient from './axios';
import { API_ENDPOINTS } from './config';

export type TranslationStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
export type UrgentLevel = 'NORMAL' | 'URGENT' | 'VERY_URGENT';

export interface TranslationWithRelations {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  documentTitle: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentType: string;
  purpose: string;
  urgentLevel: UrgentLevel;
  originalFile: string;
  translatedFile?: string;
  attachments?: any;
  notes?: string;
  status: TranslationStatus;
  createdAt: string;
  updatedAt: string;
  // New fields
  unitName?: string;
  translatorName?: string;
  reason?: string;
  verificationFile?: string;
  languagePair?: string;
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
}

export interface TranslationListResult {
  translations: TranslationWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TranslationStats {
  total: number;
  byStatus: Record<string, number>;
  byUrgentLevel: Record<string, number>;
  byLanguagePair: Record<string, number>;
  recentRequests: number;
  completedThisMonth: number;
}

export interface FilterTranslationDto {
  search?: string;
  status?: TranslationStatus;
  statuses?: TranslationStatus[];
  sourceLanguage?: string;
  targetLanguage?: string;
  documentType?: string;
  urgentLevel?: UrgentLevel;
  createdFrom?: string;
  createdTo?: string;
  createdById?: string;
  approvedById?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTranslationDto {
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  documentTitle: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentType: string;
  purpose: string;
  urgentLevel?: UrgentLevel;
  originalFile: string;
  translatedFile?: string;
  attachments?: any;
  notes?: string;
  unitName?: string;
  translatorName?: string;
  reason?: string;
  verificationFile?: string;
  languagePair?: string;
  partnerId?: string;
  unitId?: string;
}

export interface UpdateTranslationDto {
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  documentTitle?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  documentType?: string;
  purpose?: string;
  urgentLevel?: UrgentLevel;
  attachments?: any;
  notes?: string;
  unitName?: string;
  translatorName?: string;
  reason?: string;
  verificationFile?: string;
  languagePair?: string;
  partnerId?: string;
  unitId?: string;
}

export interface ApproveTranslationDto {
  notes?: string;
}

export interface RejectTranslationDto {
  reason: string;
  notes?: string;
}

export interface CompleteTranslationDto {
  translatedFile: string;
  translatorNotes?: string;
  verificationNotes?: string;
}

export interface TranslationConfirmationData {
  id: string;
  documentName: string;
  unit: string;
  sourceLang: string;
  targetLang: string;
  confirmationDate: string;
  status: 'confirmed' | 'under-review' | 'pending' | 'rejected';
  translator: string;
  submittedBy: string;
  submittedDate: string;
  timeline: Array<{
    step: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
    note?: string;
  }>;
}

class TranslationService {
  async list(params: FilterTranslationDto = {}): Promise<TranslationListResult> {
    const response = await axiosClient.get(API_ENDPOINTS.TRANSLATIONS.LIST, { params });
    return response.data;
  }

  async getStats(): Promise<TranslationStats> {
    const response = await axiosClient.get(API_ENDPOINTS.TRANSLATIONS.STATS);
    return response.data;
  }

  async getById(id: string): Promise<TranslationWithRelations> {
    const response = await axiosClient.get(API_ENDPOINTS.TRANSLATIONS.DETAIL(id));
    return response.data;
  }

  async create(data: CreateTranslationDto): Promise<TranslationWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.TRANSLATIONS.CREATE, data);
    return response.data;
  }

  async update(id: string, data: UpdateTranslationDto): Promise<TranslationWithRelations> {
    const response = await axiosClient.patch(API_ENDPOINTS.TRANSLATIONS.UPDATE(id), data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.TRANSLATIONS.DELETE(id));
  }

  async approve(id: string, data: ApproveTranslationDto): Promise<TranslationWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.TRANSLATIONS.APPROVE(id), data);
    return response.data;
  }

  async reject(id: string, data: RejectTranslationDto): Promise<TranslationWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.TRANSLATIONS.REJECT(id), data);
    return response.data;
  }

  async complete(id: string, data: CompleteTranslationDto): Promise<TranslationWithRelations> {
    const response = await axiosClient.post(API_ENDPOINTS.TRANSLATIONS.COMPLETE(id), data);
    return response.data;
  }

  // Transform backend data to frontend format for TranslationConfirmation component
  transformToConfirmationFormat(translation: TranslationWithRelations): TranslationConfirmationData {
    const getStatus = (status: TranslationStatus): 'confirmed' | 'under-review' | 'pending' | 'rejected' => {
      switch (status) {
        case 'COMPLETED':
          return 'confirmed';
        case 'APPROVED':
          return 'under-review';
        case 'PENDING':
          return 'pending';
        case 'REJECTED':
          return 'rejected';
        default:
          return 'pending';
      }
    };

    const getTimeline = (translation: TranslationWithRelations) => {
      const timeline: Array<{
        step: string;
        date: string;
        status: 'completed' | 'current' | 'pending';
        note?: string;
      }> = [];

      // Nộp đơn
      timeline.push({
        step: "Nộp đơn",
        date: new Date(translation.createdAt).toLocaleDateString('vi-VN'),
        status: "completed",
        note: "Đơn đã được nộp"
      });

      // Xét duyệt
      if (translation.status === 'PENDING') {
        timeline.push({
          step: "Xét duyệt",
          date: "",
          status: "current",
          note: "Đang chờ admin xem xét"
        });
      } else {
        timeline.push({
          step: "Xét duyệt",
          date: translation.approvedBy ? new Date(translation.updatedAt).toLocaleDateString('vi-VN') : "",
          status: "completed",
          note: "Đã kiểm tra tài liệu"
        });
      }

      // Phê duyệt
      if (translation.status === 'APPROVED' || translation.status === 'COMPLETED') {
        timeline.push({
          step: "Phê duyệt",
          date: translation.approvedBy ? new Date(translation.updatedAt).toLocaleDateString('vi-VN') : "",
          status: "completed",
          note: "Đã phê duyệt"
        });
      } else if (translation.status === 'PENDING') {
        timeline.push({
          step: "Phê duyệt",
          date: "",
          status: "pending"
        });
      } else {
        timeline.push({
          step: "Phê duyệt",
          date: "",
          status: "pending"
        });
      }

      // Cấp thư xác nhận (hoàn thành)
      if (translation.status === 'COMPLETED') {
        timeline.push({
          step: "Cấp thư xác nhận",
          date: new Date(translation.updatedAt).toLocaleDateString('vi-VN'),
          status: "completed",
          note: "Thư đã được cấp"
        });
      } else {
        timeline.push({
          step: "Cấp thư xác nhận",
          date: "",
          status: "pending"
        });
      }

      return timeline;
    };

    return {
      id: translation.id,
      documentName: translation.documentTitle,
      unit: translation.unitName || translation.unit?.name || 'Unknown',
      sourceLang: translation.sourceLanguage,
      targetLang: translation.targetLanguage,
      confirmationDate: translation.status === 'COMPLETED' ? new Date(translation.updatedAt).toLocaleDateString('vi-VN') : '',
      status: getStatus(translation.status),
      translator: translation.translatorName || 'Chưa chỉ định',
      submittedBy: translation.createdBy.fullName,
      submittedDate: new Date(translation.createdAt).toLocaleDateString('vi-VN'),
      timeline: getTimeline(translation),
    };
  }

  // Get translations formatted for confirmation component
  async getConfirmations(params: FilterTranslationDto = {}): Promise<TranslationConfirmationData[]> {
    try {
      const result = await this.list(params);
      return result.translations.map(translation => this.transformToConfirmationFormat(translation));
    } catch (error) {
      console.error('Error fetching translation confirmations:', error);
      return [];
    }
  }

  // Get statistics for charts
  async getChartStats(): Promise<{
    languageStats: Array<{ language: string; count: number }>;
    documentTypeStats: Array<{ type: string; count: number }>;
  }> {
    try {
      const stats = await this.getStats();

      const languageStats = Object.entries(stats.byLanguagePair || {}).map(([language, count]) => ({
        language,
        count: count as number
      }));

      // For document types, we'd need to aggregate from the list
      // For now, return empty array - can be enhanced later
      const documentTypeStats: Array<{ type: string; count: number }> = [];

      return { languageStats, documentTypeStats };
    } catch (error) {
      console.error('Error fetching chart stats:', error);
      return { languageStats: [], documentTypeStats: [] };
    }
  }
}

export const translationService = new TranslationService();