import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Enums
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
  PHD = 'phd',
  EXCHANGE = 'exchange',
  LANGUAGE = 'language',
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

// Interfaces
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
  visaExtensionId: string
  uploadedAt: string
}

export interface VisaExtension {
  id: string
  applicationNumber: string
  fullName: string
  dateOfBirth: string
  nationality: string
  gender: 'male' | 'female' | 'other'
  passportNumber: string
  passportExpiryDate: string
  countryOfIssue?: string
  visaType: VisaType
  visaNumber?: string
  entryDate?: string
  visaExpiryDate: string
  extensionType?: string
  extensionDuration?: number
  proposedExtensionDate?: string
  extensionReason?: string
  extensionFee?: number
  email?: string
  phoneNumber: string
  currentAddress: string
  status: VisaExtensionStatus
  statusReason?: string
  userId: string
  submissionDate?: string
  reviewDate?: string
  approvalDate?: string
  paymentStatus?: string
  paymentDate?: string
  createdAt: string
  updatedAt: string
  documents?: VisaExtensionDocument[]
  
  // Student-specific fields
  universityName?: string
  studentId?: string
  studyProgram?: StudyProgram
  yearOfStudy?: number
  expectedGraduationDate?: string
  supervisor?: string
  departmentName?: string
  facultyName?: string
}

export interface VisaExtensionHistory {
  id: string
  action: string
  previousStatus?: VisaExtensionStatus
  newStatus: VisaExtensionStatus
  note?: string
  performedById: string
  performedBy?: {
    id: string
    username: string
    fullName: string
  }
  createdAt: string
}

export interface CreateVisaExtensionDto {
  fullName: string
  dateOfBirth: string
  nationality: string
  gender: 'male' | 'female' | 'other'
  passportNumber: string
  passportExpiryDate: string
  countryOfIssue?: string
  visaType: VisaType
  visaNumber?: string
  entryDate?: string
  visaExpiryDate: string
  extensionType?: string
  extensionDuration?: number
  proposedExtensionDate?: string
  extensionReason?: string
  extensionFee?: number
  email?: string
  phoneNumber: string
  currentAddress: string
  
  // Student-specific fields
  universityName?: string
  studentId?: string
  studyProgram?: StudyProgram
  yearOfStudy?: number
  expectedGraduationDate?: string
  supervisor?: string
  departmentName?: string
  facultyName?: string
}

export interface UpdateVisaExtensionDto extends Partial<CreateVisaExtensionDto> {}

export interface VisaExtensionFilterDto {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  search?: string
  status?: VisaExtensionStatus
  visaType?: VisaType
  nationality?: string
  submissionDateFrom?: string
  submissionDateTo?: string
  expiryDateFrom?: string
  expiryDateTo?: string
}

export interface ChangeStatusDto {
  status: VisaExtensionStatus
  reason?: string
}

export interface VerifyDocumentDto {
  isVerified: boolean
  note?: string
}

// API Methods
export const visaExtensionAPI = {
  // Get all visa extensions with filters
  getVisaExtensions: (filters?: VisaExtensionFilterDto) => {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
      })
    }
    return api.get(`/visa-extensions?${queryParams.toString()}`)
  },

  // Get single visa extension
  getVisaExtension: (id: string) => {
    return api.get(`/visa-extensions/${id}`)
  },

  // Create new visa extension
  createVisaExtension: (data: CreateVisaExtensionDto) => {
    return api.post('/visa-extensions', data)
  },

  // Update visa extension
  updateVisaExtension: (id: string, data: UpdateVisaExtensionDto) => {
    return api.patch(`/visa-extensions/${id}`, data)
  },

  // Submit visa extension
  submitVisaExtension: (id: string) => {
    return api.patch(`/visa-extensions/${id}/submit`)
  },

  // Delete visa extension
  deleteVisaExtension: (id: string) => {
    return api.delete(`/visa-extensions/${id}`)
  },

  // Change status (admin/phong only)
  changeStatus: (id: string, data: ChangeStatusDto) => {
    return api.patch(`/visa-extensions/${id}/status`, data)
  },

  // Upload document
  uploadDocument: (id: string, file: File, documentType: DocumentType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentType', documentType)
    
    return api.post(`/visa-extensions/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Download document
  downloadDocument: (documentId: string) => {
    return api.get(`/visa-extensions/documents/${documentId}/download`, {
      responseType: 'blob',
    })
  },

  // Delete document
  deleteDocument: (id: string, documentId: string) => {
    return api.delete(`/visa-extensions/${id}/documents/${documentId}`)
  },

  // Verify document (admin/phong only)
  verifyDocument: (id: string, documentId: string, data: VerifyDocumentDto) => {
    return api.patch(`/visa-extensions/${id}/documents/${documentId}/verify`, data)
  },

  // Get application history
  getApplicationHistory: (id: string) => {
    return api.get(`/visa-extensions/${id}/history`)
  },

  // Get expiring soon
  getExpiringSoon: (days?: number) => {
    const params = days ? `?days=${days}` : ''
    return api.get(`/visa-extensions/expiring-soon${params}`)
  },

  // Get statistics
  getStatistics: () => {
    return api.get('/visa-extensions/statistics')
  },

  // Send reminder
  sendReminder: (id: string) => {
    return api.post(`/visa-extensions/${id}/reminder`)
  },
}
