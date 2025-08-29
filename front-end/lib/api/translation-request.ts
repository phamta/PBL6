// API client for Translation Request operations
import { TranslationStatus } from '../types/translation-request';

export interface CreateTranslationRequestData {
  originalDocumentTitle: string;
  documentType: string;
  languagePair: string;
  purpose: string;
  submittingUnit: string;
  originalFilePath?: string;
  translatedFilePath?: string;
}

export interface UpdateTranslationRequestData {
  originalDocumentTitle?: string;
  documentType?: string;
  languagePair?: string;
  purpose?: string;
  submittingUnit?: string;
  originalFilePath?: string;
  translatedFilePath?: string;
}

export interface TranslationRequestFilters {
  submittingUnit?: string;
  status?: TranslationStatus;
  documentType?: string;
  languagePair?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReviewTranslationRequestData {
  reviewComments: string;
}

export interface GenerateReportData {
  startDate?: string;
  endDate?: string;
  submittingUnit?: string;
  status?: TranslationStatus;
  documentType?: string;
  languagePair?: string;
  format: 'EXCEL' | 'PDF';
  year?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class TranslationRequestAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/translation-requests${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle non-JSON responses (like file downloads)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Create new translation request
  async create(data: CreateTranslationRequestData) {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get all translation requests with filters
  async getAll(filters: TranslationRequestFilters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.request(endpoint);
  }

  // Get translation request by ID
  async getById(id: string) {
    return this.request(`/${id}`);
  }

  // Update translation request
  async update(id: string, data: UpdateTranslationRequestData) {
    return this.request(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Get statistics for dashboard
  async getStatistics() {
    return this.request('/statistics');
  }

  // Admin actions (KHCN_DN only)
  async startReview(id: string) {
    return this.request(`/${id}/start-review`, {
      method: 'POST',
    });
  }

  async approve(id: string) {
    return this.request(`/${id}/approve`, {
      method: 'POST',
    });
  }

  async reject(id: string, data: ReviewTranslationRequestData) {
    return this.request(`/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async requestRevision(id: string, data: ReviewTranslationRequestData) {
    return this.request(`/${id}/request-revision`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Report generation
  async generateReport(data: GenerateReportData) {
    const response = await this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Handle file download
    if (response instanceof Response) {
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'translation-report';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }

    return response;
  }

  // File downloads
  async downloadOriginalDocument(id: string) {
    const response = await this.request(`/${id}/download/original`);
    
    if (response instanceof Response) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `original-document-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  async downloadTranslatedDocument(id: string) {
    const response = await this.request(`/${id}/download/translated`);
    
    if (response instanceof Response) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `translated-document-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  async downloadConfirmationDocument(id: string) {
    const response = await this.request(`/${id}/download/confirmation`);
    
    if (response instanceof Response) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `confirmation-document-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }
}

export const translationRequestAPI = new TranslationRequestAPI();
