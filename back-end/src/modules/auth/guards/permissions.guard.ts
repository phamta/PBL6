import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../../common/enums/permission.enum';
import { ROLE_PERMISSIONS } from '../../../common/enums/role-permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    // Get permissions from the user's primary role (first role)
    const primaryRole = user.roles[0]?.roleName;
    const userPermissions = ROLE_PERMISSIONS[primaryRole] || [];
    
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
