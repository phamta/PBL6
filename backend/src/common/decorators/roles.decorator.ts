import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Roles Decorator - Đánh dấu endpoint cần quyền truy cập cụ thể
 * Usage: @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);