// Translation Request types for frontend

export enum TranslationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  NEEDS_REVISION = 'NEEDS_REVISION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DocumentType {
  ACADEMIC_PAPER = 'ACADEMIC_PAPER',
  RESEARCH_REPORT = 'RESEARCH_REPORT',
  PATENT = 'PATENT',
  THESIS = 'THESIS',
  DISSERTATION = 'DISSERTATION',
  CONFERENCE_PAPER = 'CONFERENCE_PAPER',
  JOURNAL_ARTICLE = 'JOURNAL_ARTICLE',
  BOOK_CHAPTER = 'BOOK_CHAPTER',
  TECHNICAL_MANUAL = 'TECHNICAL_MANUAL',
  CERTIFICATE = 'CERTIFICATE',
  DIPLOMA = 'DIPLOMA',
  TRANSCRIPT = 'TRANSCRIPT',
  CONTRACT = 'CONTRACT',
  AGREEMENT = 'AGREEMENT',
  LEGAL_DOCUMENT = 'LEGAL_DOCUMENT',
  FINANCIAL_REPORT = 'FINANCIAL_REPORT',
  BUSINESS_PLAN = 'BUSINESS_PLAN',
  MARKETING_MATERIAL = 'MARKETING_MATERIAL',
  INSTRUCTION_MANUAL = 'INSTRUCTION_MANUAL',
  SPECIFICATION = 'SPECIFICATION',
  OTHER = 'OTHER',
}

export enum LanguagePair {
  EN_VI = 'EN_VI',
  VI_EN = 'VI_EN',
  CN_VI = 'CN_VI',
  VI_CN = 'VI_CN',
  JP_VI = 'JP_VI',
  VI_JP = 'VI_JP',
  KR_VI = 'KR_VI',
  VI_KR = 'VI_KR',
  FR_VI = 'FR_VI',
  VI_FR = 'VI_FR',
  DE_VI = 'DE_VI',
  VI_DE = 'VI_DE',
  ES_VI = 'ES_VI',
  VI_ES = 'VI_ES',
  RU_VI = 'RU_VI',
  VI_RU = 'VI_RU',
  OTHER = 'OTHER',
}

export interface TranslationRequest {
  id: string;
  requestCode: string;
  originalDocumentTitle: string;
  documentType: DocumentType;
  languagePair: LanguagePair;
  purpose: string;
  submittingUnit: string;
  status: TranslationStatus;
  
  // File paths
  originalFilePath?: string;
  translatedFilePath?: string;
  confirmationDocumentPath?: string;
  
  // Metadata
  revisionCount: number;
  reviewComments?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  
  // Relations
  submittedById: string;
  reviewedById?: string;
  submittedBy?: {
    id: string;
    fullName: string;
    email: string;
    unit: string;
  };
  reviewedBy?: {
    id: string;
    fullName: string;
    email: string;
    unit: string;
  };
}

export interface TranslationRequestListResponse {
  data: TranslationRequest[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TranslationRequestStatistics {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  needsRevision: number;
}

// Form data interfaces
export interface CreateTranslationRequestForm {
  originalDocumentTitle: string;
  documentType: DocumentType;
  languagePair: LanguagePair;
  purpose: string;
  submittingUnit: string;
  originalFile?: File;
  translatedFile?: File;
}

export interface UpdateTranslationRequestForm {
  originalDocumentTitle?: string;
  documentType?: DocumentType;
  languagePair?: LanguagePair;
  purpose?: string;
  submittingUnit?: string;
  originalFile?: File;
  translatedFile?: File;
}

export interface ReviewForm {
  reviewComments: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  submittingUnit?: string;
  status?: TranslationStatus;
  documentType?: DocumentType;
  languagePair?: LanguagePair;
  format: 'EXCEL' | 'PDF';
  year?: string;
}

// Helper functions and constants
export const TRANSLATION_STATUS_LABELS = {
  [TranslationStatus.PENDING]: 'Chờ xử lý',
  [TranslationStatus.UNDER_REVIEW]: 'Đang xem xét',
  [TranslationStatus.NEEDS_REVISION]: 'Cần chỉnh sửa',
  [TranslationStatus.APPROVED]: 'Đã duyệt',
  [TranslationStatus.REJECTED]: 'Từ chối',
};

export const DOCUMENT_TYPE_LABELS = {
  [DocumentType.ACADEMIC_PAPER]: 'Bài báo khoa học',
  [DocumentType.RESEARCH_REPORT]: 'Báo cáo nghiên cứu',
  [DocumentType.PATENT]: 'Bằng sáng chế',
  [DocumentType.THESIS]: 'Luận văn',
  [DocumentType.DISSERTATION]: 'Luận án',
  [DocumentType.CONFERENCE_PAPER]: 'Bài báo hội nghị',
  [DocumentType.JOURNAL_ARTICLE]: 'Bài báo tạp chí',
  [DocumentType.BOOK_CHAPTER]: 'Chương sách',
  [DocumentType.TECHNICAL_MANUAL]: 'Hướng dẫn kỹ thuật',
  [DocumentType.CERTIFICATE]: 'Chứng chỉ',
  [DocumentType.DIPLOMA]: 'Bằng cấp',
  [DocumentType.TRANSCRIPT]: 'Bảng điểm',
  [DocumentType.CONTRACT]: 'Hợp đồng',
  [DocumentType.AGREEMENT]: 'Thỏa thuận',
  [DocumentType.LEGAL_DOCUMENT]: 'Tài liệu pháp lý',
  [DocumentType.FINANCIAL_REPORT]: 'Báo cáo tài chính',
  [DocumentType.BUSINESS_PLAN]: 'Kế hoạch kinh doanh',
  [DocumentType.MARKETING_MATERIAL]: 'Tài liệu marketing',
  [DocumentType.INSTRUCTION_MANUAL]: 'Hướng dẫn sử dụng',
  [DocumentType.SPECIFICATION]: 'Đặc tả kỹ thuật',
  [DocumentType.OTHER]: 'Khác',
};

export const LANGUAGE_PAIR_LABELS = {
  [LanguagePair.EN_VI]: 'Anh - Việt',
  [LanguagePair.VI_EN]: 'Việt - Anh',
  [LanguagePair.CN_VI]: 'Trung - Việt',
  [LanguagePair.VI_CN]: 'Việt - Trung',
  [LanguagePair.JP_VI]: 'Nhật - Việt',
  [LanguagePair.VI_JP]: 'Việt - Nhật',
  [LanguagePair.KR_VI]: 'Hàn - Việt',
  [LanguagePair.VI_KR]: 'Việt - Hàn',
  [LanguagePair.FR_VI]: 'Pháp - Việt',
  [LanguagePair.VI_FR]: 'Việt - Pháp',
  [LanguagePair.DE_VI]: 'Đức - Việt',
  [LanguagePair.VI_DE]: 'Việt - Đức',
  [LanguagePair.ES_VI]: 'Tây Ban Nha - Việt',
  [LanguagePair.VI_ES]: 'Việt - Tây Ban Nha',
  [LanguagePair.RU_VI]: 'Nga - Việt',
  [LanguagePair.VI_RU]: 'Việt - Nga',
  [LanguagePair.OTHER]: 'Khác',
};
