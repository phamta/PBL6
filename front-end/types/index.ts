// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
}

// User Types
export interface User {
  id: number
  email: string
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// MOU Types
export interface MOU {
  id: number
  title: string
  partnerOrganization: string
  partnerCountry?: string
  description: string
  startDate?: string
  endDate?: string
  signedDate?: string
  expiryDate?: string
  terms?: string
  status: 'draft' | 'active' | 'expired' | 'terminated'
  createdAt: string
  updatedAt: string
}

export interface CreateMOUData {
  title: string
  partnerOrganization: string
  description: string
  startDate: string
  endDate: string
}

// Visa Types
export interface VisaApplication {
  id: number
  applicantName: string
  nationality: string
  passportNumber: string
  currentVisaExpiry: string
  requestedExtensionDate: string
  purpose: string
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface CreateVisaApplicationData {
  applicantName: string
  nationality: string
  passportNumber: string
  currentVisaExpiry: string
  requestedExtensionDate: string
  purpose: string
}

// Visitor Types
export interface Visitor {
  id: number
  fullName: string
  nationality: string
  passportNumber: string
  purpose: string
  visitDate: string
  duration: number
  hostContactPerson: string
  accommodationDetails: string
  createdAt: string
  updatedAt: string
}

export interface CreateVisitorData {
  fullName: string
  nationality: string
  passportNumber: string
  purpose: string
  visitDate: string
  duration: number
  hostContactPerson: string
  accommodationDetails: string
}

// Translation Types
export interface Translation {
  id: number
  documentTitle: string
  sourceLanguage: string
  targetLanguage: string
  documentType: string
  requestDate: string
  deadline: string
  requesterName: string
  requesterContact: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CreateTranslationData {
  documentTitle: string
  sourceLanguage: string
  targetLanguage: string
  documentType: string
  requestDate: string
  deadline: string
  requesterName: string
  requesterContact: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  notes: string
}

// Form Event Types
export interface FormEvent {
  preventDefault: () => void
}

export interface InputChangeEvent {
  target: {
    name: string
    value: string
  }
}
