import apiClient from '../lib/api-client'

// Types
export interface VisaExtension {
  id: string
  applicationNumber: string
  fullName: string
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  passportIssuePlace: string
  nationality: string
  dateOfBirth: string
  gender: string
  currentVisaNumber: string
  visaType: VisaType
  visaIssueDate: string
  visaExpiryDate: string
  visaIssuePlace: string
  studyProgram?: StudyProgram
  universityName?: string
  programDuration?: string
  expectedGraduationDate?: string
  reasonForExtension: string
  requestedExtensionPeriod: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  status: VisaExtensionStatus
  submissionDate?: string
  reviewDate?: string
  approvalDate?: string
  rejectionReason?: string
  additionalRequirements?: string
  officialDocumentNumber?: string
  newVisaExpiryDate?: string
  processingFee?: number
  paymentStatus: string
  paymentDate?: string
  notes?: string
  applicant: any
  reviewer?: any
  documents: VisaExtensionDocument[]
  history: VisaExtensionHistory[]
  createdAt: string
  updatedAt: string
}

export enum VisaExtensionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ADDITIONAL_REQUIRED = 'additional_required',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXTENDED = 'extended',
}

export enum VisaType {
  TOURIST = 'tourist',
  BUSINESS = 'business',
  STUDENT = 'student',
  WORK = 'work',
  DIPLOMATIC = 'diplomatic',
  TRANSIT = 'transit',
}

export enum StudyProgram {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  EXCHANGE = 'exchange',
  SHORT_TERM = 'short_term',
  RESEARCH = 'research',
}

export enum DocumentType {
  PASSPORT = 'passport',
  CURRENT_VISA = 'current_visa',
  PHOTO = 'photo',
  INTRODUCTION_LETTER = 'introduction_letter',
  STUDY_CERTIFICATE = 'study_certificate',
  FINANCIAL_PROOF = 'financial_proof',
  ACCOMMODATION_PROOF = 'accommodation_proof',
  HEALTH_INSURANCE = 'health_insurance',
  OTHER = 'other',
}

export interface VisaExtensionDocument {
  id: string
  fileName: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
  documentType: DocumentType
  isRequired: boolean
  isVerified: boolean
  verificationNotes?: string
  uploadedAt: string
}

export interface VisaExtensionHistory {
  id: string
  fromStatus: VisaExtensionStatus
  toStatus: VisaExtensionStatus
  comment?: string
  reason?: string
  changedBy: any
  changedAt: string
}

export interface CreateVisaExtensionDto {
  fullName: string
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  passportIssuePlace: string
  nationality: string
  dateOfBirth: string
  gender: string
  currentVisaNumber: string
  visaType: VisaType
  visaIssueDate: string
  visaExpiryDate: string
  visaIssuePlace: string
  studyProgram?: StudyProgram
  universityName?: string
  programDuration?: string
  expectedGraduationDate?: string
  reasonForExtension: string
  requestedExtensionPeriod: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  notes?: string
}

export interface VisaExtensionFilterDto {
  search?: string
  status?: VisaExtensionStatus
  visaType?: VisaType
  nationality?: string
  submissionDateFrom?: string
  submissionDateTo?: string
  expiryDateFrom?: string
  expiryDateTo?: string
  applicantId?: string
  reviewerId?: string
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface ChangeStatusDto {
  status: VisaExtensionStatus
  comment?: string
  reason?: string
  rejectionReason?: string
  additionalRequirements?: string
  officialDocumentNumber?: string
  newVisaExpiryDate?: string
}

// API functions
export const visaExtensionAPI = {
  // Get all visa extensions
  getVisaExtensions: (filters?: VisaExtensionFilterDto) =>
    apiClient.get('/visa-extension', { params: filters }),

  // Get single visa extension
  getVisaExtension: (id: string) =>
    apiClient.get(`/visa-extension/${id}`),

  // Create new visa extension
  createVisaExtension: (data: CreateVisaExtensionDto) =>
    apiClient.post('/visa-extension', data),

  // Update visa extension
  updateVisaExtension: (id: string, data: Partial<CreateVisaExtensionDto>) =>
    apiClient.patch(`/visa-extension/${id}`, data),

  // Change status
  changeStatus: (id: string, data: ChangeStatusDto) =>
    apiClient.patch(`/visa-extension/${id}/status`, data),

  // Submit application
  submit: (id: string) =>
    apiClient.post(`/visa-extension/${id}/submit`),

  // Delete visa extension
  deleteVisaExtension: (id: string) =>
    apiClient.delete(`/visa-extension/${id}`),

  // Get statistics
  getStatistics: () =>
    apiClient.get('/visa-extension/statistics'),

  // Get expiring soon
  getExpiringSoon: (days?: number) =>
    apiClient.get('/visa-extension/expiring-soon', { params: { days } }),

  // Document management
  uploadDocuments: (id: string, files: File[], documentTypes: DocumentType[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    documentTypes.forEach(type => formData.append('documentTypes', type))
    return apiClient.post(`/visa-extension/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getDocuments: (id: string) =>
    apiClient.get(`/visa-extension/${id}/documents`),

  deleteDocument: (id: string, documentId: string) =>
    apiClient.delete(`/visa-extension/${id}/documents/${documentId}`),

  verifyDocument: (id: string, documentId: string, data: { isVerified: boolean; verificationNotes?: string }) =>
    apiClient.patch(`/visa-extension/${id}/documents/${documentId}/verify`, data),
}
