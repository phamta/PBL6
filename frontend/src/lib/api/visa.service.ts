import axiosClient from './axios';
import { API_ENDPOINTS } from './config';

export type VisaStatus = 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'EXTENDED' | 'CANCELLED';

export interface ForeignStudent {
  id: string;
  fullName: string;
  nationality: string;
  status: string;
}

export interface VisaWithRelations {
  id: string;
  holderName: string;
  holderCountry: string;
  passportNumber: string;
  visaNumber: string;
  issueDate: string;
  expirationDate: string;
  purpose: string;
  sponsorUnit: string;
  status: VisaStatus;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  dateOfBirth?: string;
  visaType?: string;
  entryDate?: string;
  program?: string;
  department?: string;
  supervisorName?: string;
  email?: string;
  phone?: string;
  na5Request?: boolean;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
    unitId?: string;
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
  extensions: any[]; // VisaExtension[]
  foreignStudents: ForeignStudent[];
}

export interface VisaListResult {
  visas: VisaWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterVisaDto {
  search?: string;
  status?: VisaStatus;
  statuses?: VisaStatus[];
  holderCountry?: string;
  sponsorUnit?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  expirationDateFrom?: string;
  expirationDateTo?: string;
  expiringWithinDays?: string;
  createdBy?: string;
  approvedBy?: string;
  partnerId?: string;
  unitId?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InternationalMember {
  id: string;
  visaId: string;
  fullName: string;
  nationality: string;
  visaType: string;
  department: string;
  visaExpiry: string;
  startDate: string;
  expectedEndDate: string;
  status: 'active' | 'pending' | 'expiring-soon' | 'extension-requested';
  program: string;
  supervisor: string;
  passportNo: string;
  visaNumber: string;
  lastEntry: string;
  visaCode: string;
  extensionRequest?: {
    requestedExpiry: string;
    submittedDate: string;
    reason: string;
    timeline: Array<{
      step: string;
      date: string;
      status: 'completed' | 'current' | 'pending';
      note?: string;
    }>;
  };
}

class VisaService {
  async list(params: FilterVisaDto = {}): Promise<VisaListResult> {
    const response = await axiosClient.get(API_ENDPOINTS.VISAS.LIST, { params });
    return response.data;
  }

  async getById(id: string): Promise<VisaWithRelations> {
    const response = await axiosClient.get(API_ENDPOINTS.VISAS.DETAIL(id));
    return response.data;
  }

  // Get all international members (foreign students) for officer view
  async getAllInternationalMembers(): Promise<InternationalMember[]> {
    try {
      // For officer role, get all foreign students from all units
      const response = await axiosClient.get(API_ENDPOINTS.VISAS.FOREIGN_STUDENTS_ALL);
      const students = response.data.data || response.data;

      console.log('Raw foreign students data:', students);

      // Transform each student to InternationalMember format
      const transformedMembers = await Promise.all(
        students.map((student: any) => this.transformForeignStudentToInternationalMember(student))
      );

      console.log('Transformed members:', transformedMembers);
      return transformedMembers;
    } catch (error) {
      console.error('Error fetching international members:', error);
      throw error;
    }
  }

  // Transform visa data to international member format
  transformToInternationalMember(visa: VisaWithRelations): InternationalMember {
    const status = visa.status === 'ACTIVE' ? 'active' :
                   visa.status === 'EXPIRING' ? 'extension-requested' : 'pending';

    // Get primary foreign student if exists
    const primaryStudent = visa.foreignStudents?.[0];

    return {
      id: visa.id,
      visaId: visa.id, // Add missing visaId field
      fullName: primaryStudent?.fullName || visa.holderName,
      nationality: primaryStudent?.nationality || visa.holderCountry,
      visaType: visa.visaType || 'Student Visa',
      department: visa.department || visa.unit?.name || 'Unknown',
      visaExpiry: visa.expirationDate,
      startDate: visa.entryDate || visa.issueDate,
      expectedEndDate: visa.expirationDate,
      status,
      program: visa.program || 'Academic Program',
      supervisor: visa.supervisorName || 'TBD',
      passportNo: visa.passportNumber,
      visaNumber: visa.visaNumber,
      lastEntry: visa.entryDate || visa.issueDate,
      visaCode: visa.visaType || 'F-1',
      // Add extension request if there are pending extensions
      extensionRequest: visa.extensions?.some(ext => ext.status === 'PENDING') ? {
        requestedExpiry: visa.extensions.find(ext => ext.status === 'PENDING')?.newExpirationDate || '',
        submittedDate: visa.extensions.find(ext => ext.status === 'PENDING')?.createdAt || '',
        reason: visa.extensions.find(ext => ext.status === 'PENDING')?.reason || '',
        timeline: [
          { step: "Nộp đơn", date: visa.extensions.find(ext => ext.status === 'PENDING')?.createdAt || '', status: "completed", note: "Đơn đã được nộp" },
          { step: "Xét duyệt", date: "", status: "current", note: "Đang chờ admin xem xét" },
          { step: "Phê duyệt", date: "", status: "pending" },
          { step: "Cấp công văn NA5", date: "", status: "pending" },
          { step: "Hoàn thành", date: "", status: "pending" },
        ],
      } : undefined,
    };
  }

  // Get international members from foreign students by current user's unit
  async getInternationalMembers(): Promise<InternationalMember[]> {
    try {
      console.log('Calling API:', API_ENDPOINTS.VISAS.FOREIGN_STUDENTS_BY_MYUNIT);
      const response = await axiosClient.get(API_ENDPOINTS.VISAS.FOREIGN_STUDENTS_BY_MYUNIT);
      console.log('API Response:', response);
      const foreignStudents = response.data || [];
      console.log('Foreign students data:', foreignStudents);

      const transformed = foreignStudents.map((student: any) => this.transformForeignStudentToInternationalMember(student));
      console.log('Transformed data:', transformed);

      return transformed;
    } catch (error) {
      console.error('Error fetching international members:', error);
      return [];
    }
  }

  // Transform foreign student data to international member format
  transformForeignStudentToInternationalMember(student: any): InternationalMember {
    try {
      console.log('Transforming student:', student);

      const visa = student.visa;
      const unit = student.unit;

      console.log('Visa data:', visa);
      console.log('Unit data:', unit);

      // Check if visa is expiring soon (within 90 days)
      const expiryDate = new Date(visa?.expirationDate || student.expectedEndDate);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isExpiringSoon = daysUntilExpiry <= 90;

      console.log('Expiry calculation:', { expiryDate, today, daysUntilExpiry, isExpiringSoon });
      let status: 'active' | 'pending' | 'expiring-soon' | 'extension-requested' = 'active';

      // Kiểm tra nếu đã có extension request đang pending
      const hasPendingExtension = (visa?.extensions as any)?.some((ext: any) => ext.status === 'PENDING');

      if (hasPendingExtension) {
        status = 'extension-requested'; // đã gửi yêu cầu gia hạn
      } else if (visa?.status === 'EXPIRED' || visa?.status === 'CANCELLED') {
        status = 'pending';
      } else if (isExpiringSoon) {
        status = 'expiring-soon'; // visa sắp hết hạn, cần lập đơn gia hạn
      } else if (visa?.status === 'EXPIRING') {
        status = 'extension-requested'; // đã gửi yêu cầu gia hạn
      }

      const result = {
        id: student.id,
        visaId: visa?.id || student.visaId,
        fullName: student.fullName,
        nationality: student.nationality,
        visaType: visa?.purpose ? `${visa.purpose} Visa` : 'Student Visa',
        department: unit?.name || student.program || 'Unknown',
        visaExpiry: visa?.expirationDate || student.expectedEndDate,
        startDate: visa?.issueDate || student.startDate,
        expectedEndDate: visa?.expirationDate || student.expectedEndDate,
        status,
        program: student.program || 'Academic Program',
        supervisor: student.supervisor || 'TBD',
        passportNo: student.passportNumber,
        visaNumber: visa?.visaNumber || 'N/A',
        lastEntry: visa?.entryDate || visa?.issueDate || student.startDate,
        visaCode: visa?.purpose || 'F-1',
        // Only add extension request if there are actual pending extensions in database
        extensionRequest: (visa?.extensions as any)?.some((ext: any) => ext.status === 'PENDING') ? {
          requestedExpiry: (visa.extensions as any).find((ext: any) => ext.status === 'PENDING')?.newExpirationDate || '',
          submittedDate: (visa.extensions as any).find((ext: any) => ext.status === 'PENDING')?.createdAt || '',
          reason: (visa.extensions as any).find((ext: any) => ext.status === 'PENDING')?.reason || '',
          timeline: [
            { step: "Nộp đơn", date: (visa.extensions as any).find((ext: any) => ext.status === 'PENDING')?.createdAt || '', status: "completed" as const, note: "Đơn đã được nộp" },
            { step: "Xét duyệt", date: "", status: "current" as const, note: "Đang chờ admin xem xét" },
            { step: "Phê duyệt", date: "", status: "pending" as const },
            { step: "Cấp công văn NA5", date: "", status: "pending" as const },
            { step: "Hoàn thành", date: "", status: "pending" as const },
          ],
        } : undefined,
      };

      console.log('Transform result:', result);
      return result;
    } catch (error) {
      console.error('Error transforming student:', student, error);
      throw error;
    }
  }

  async createExtension(visaId: string, extensionData: {
    newExpirationDate: string;
    reason: string;
  }) {
    try {
      const response = await axiosClient.post(
        API_ENDPOINTS.VISAS.CREATE_EXTENSION(visaId),
        {
          visaId,
          ...extensionData,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating visa extension:', error);
      throw error;
    }
  }

  async approveExtension(extensionId: string, approvalData: {
    action: 'APPROVE' | 'REJECT';
    comments?: string;
  }) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axiosClient.post(
        API_ENDPOINTS.VISAS.APPROVE_EXTENSION(extensionId),
        {
          action: approvalData.action,
          comments: approvalData.comments,
          approvedBy: user.id,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error approving visa extension:', error);
      throw error;
    }
  }
}

export const visaService = new VisaService();