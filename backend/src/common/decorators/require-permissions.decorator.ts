import { SetMetadata } from '@nestjs/common';

/**
 * Decorator để yêu cầu permissions cụ thể để truy cập endpoint
 * @param permissions - Mảng các permission codes cần thiết
 */
export const RequirePermissions = (...permissions: string[]) => 
  SetMetadata('permissions', permissions);