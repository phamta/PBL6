import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ACTION_KEY } from '../decorators/require-action.decorator';
import { RbacService } from '../services/rbac/rbac.service';

@Injectable()
export class ActionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAction = this.reflector.getAllAndOverride<string>(REQUIRE_ACTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredAction) {
      return true; // No action required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assume user is set by AuthGuard

    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasPermission = await this.rbacService.checkUserPermission(user.id, requiredAction);
    
    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required action: ${requiredAction}`,
      );
    }

    return true;
  }
}