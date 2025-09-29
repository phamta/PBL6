import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ACTION_KEY } from '../../decorators/require-action.decorator';

/**
 * Action Guard - Kiểm tra quyền truy cập dựa trên action codes trong JWT
 * Thay thế cho RolesGuard cũ sử dụng UserRole enum
 * Sử dụng với decorator @RequireAction()
 */
@Injectable()
export class ActionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy action code được yêu cầu từ decorator @RequireAction
    const requiredAction = this.reflector.getAllAndOverride<string>(REQUIRE_ACTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không có action yêu cầu thì cho phép truy cập
    if (!requiredAction) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Không có thông tin người dùng');
    }

    const userActions = user.actions || [];
    
    // Kiểm tra user có action được yêu cầu không
    const hasAction = userActions.includes(requiredAction);

    if (!hasAction) {
      throw new ForbiddenException(
        `Không có quyền thực hiện hành động: ${requiredAction}`
      );
    }

    return true;
  }
}