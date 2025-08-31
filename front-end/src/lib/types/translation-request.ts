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

export const TRANSLATION_STATUS_LABELS = {
  [TranslationStatus.PENDING]: 'Đang chờ',
  [TranslationStatus.UNDER_REVIEW]: 'Đang xem xét',
  [TranslationStatus.IN_PROGRESS]: 'Đang xử lý',
  [TranslationStatus.APPROVED]: 'Đã duyệt',
  [TranslationStatus.COMPLETED]: 'Hoàn thành',
  [TranslationStatus.CANCELLED]: 'Đã hủy',
  [TranslationStatus.REJECTED]: 'Đã từ chối',
  [TranslationStatus.REVISION_REQUESTED]: 'Yêu cầu chỉnh sửa',
  [TranslationStatus.NEEDS_REVISION]: 'Cần chỉnh sửa'
};

export const DOCUMENT_TYPE_LABELS = {
  [DocumentType.PASSPORT]: 'Hộ chiếu',
  [DocumentType.VISA]: 'Visa',
  [DocumentType.CERTIFICATE]: 'Chứng chỉ',
  [DocumentType.CONTRACT]: 'Hợp đồng',
  [DocumentType.ACADEMIC_PAPER]: 'Tài liệu học thuật',
  [DocumentType.OTHER]: 'Khác'
};

export const LANGUAGE_PAIR_LABELS = {
  'en-vi': 'Tiếng Anh - Tiếng Việt',
  'vi-en': 'Tiếng Việt - Tiếng Anh',
  'ko-vi': 'Tiếng Hàn - Tiếng Việt',
  'vi-ko': 'Tiếng Việt - Tiếng Hàn',
  'ja-vi': 'Tiếng Nhật - Tiếng Việt',
  'vi-ja': 'Tiếng Việt - Tiếng Nhật',
  'zh-vi': 'Tiếng Trung - Tiếng Việt',
  'vi-zh': 'Tiếng Việt - Tiếng Trung'
};
