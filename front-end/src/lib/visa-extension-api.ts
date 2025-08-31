import apiClient from '@/lib/api-client';

export enum VisaType {
  STUDENT = 'student',
  TOURIST = 'tourist',
  BUSINESS = 'business',
  DIPLOMATIC = 'diplomatic',
  WORK = 'work',
  TRANSIT = 'transit'
}

export enum StudyProgram {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  EXCHANGE = 'exchange',
  SHORT_TERM = 'short_term',
  RESEARCH = 'research'
}

export interface CreateVisaExtensionDto {
  fullName?: string;
  applicantName?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuePlace?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  currentVisaType?: VisaType;
  visaType?: VisaType;
  currentVisaNumber?: string;
  visaIssueDate?: string;
  visaExpiryDate?: string;
  visaIssuePlace?: string;
  requestedExtensionDuration?: number;
  extensionReason?: string;
  purpose?: string;
  studyProgram?: StudyProgram;
  universityName?: string;
  courseName?: string;
  programDuration?: string;
  enrollmentDate?: string;
  expectedGraduationDate?: string;
  reasonForExtension?: string;
  requestedExtensionPeriod?: string;
  accommodationAddress?: string;
  accommodationType?: string;
  contactPhone?: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  hasInvitationLetter?: boolean;
  invitationLetterFile?: File;
  hasFinancialProof?: boolean;
  financialProofFile?: File;
  hasInsurance?: boolean;
  insuranceFile?: File;
  additionalDocuments?: File[];
  documents?: File[];
  [key: string]: any; // Allow any additional properties
}

export interface VisaExtension {
  id: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  currentVisaType: VisaType;
  requestedExtensionDuration: number;
  purpose: string;
  studyProgram?: StudyProgram;
  universityName?: string;
  accommodationAddress: string;
  contactPhone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: string;
  submissionDate: string;
  processedDate?: string;
  documents?: string[];
}

export const visaExtensionAPI = {
  create: async (data: CreateVisaExtensionDto): Promise<VisaExtension> => {
    const formData = new FormData();
    
    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'documents' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    // Add documents
    if (data.documents) {
      data.documents.forEach((file, index) => {
        formData.append(`documents`, file);
      });
    }
    
    const response = await apiClient.post('/visa-extensions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<VisaExtension[]> => {
    const response = await apiClient.get('/visa-extensions');
    return response.data;
  },

  getById: async (id: string): Promise<VisaExtension> => {
    const response = await apiClient.get(`/visa-extensions/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateVisaExtensionDto>): Promise<VisaExtension> => {
    const response = await apiClient.put(`/visa-extensions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/visa-extensions/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<VisaExtension> => {
    const response = await apiClient.patch(`/visa-extensions/${id}/status`, { status });
    return response.data;
  }
};
