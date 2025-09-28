import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * User Decorator - Lấy thông tin user hiện tại từ request
 * Usage: getCurrentUser(@User() user: any)
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);