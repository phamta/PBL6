export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  warnings?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseBuilder {
  static success<T>(data?: T, message = 'Operation completed successfully'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, errors?: string[]): ApiResponse {
    return {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    pagination: PaginatedResponse<T>['pagination'],
    message = 'Data retrieved successfully'
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    };
  }
}
