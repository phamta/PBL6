import { User } from '../../modules/user/entities/user.entity';
import { UserRole } from '../enums/user.enum';

/**
 * Utility functions for user role checking
 */
export class UserUtils {
  /**
   * Check if user has a specific role
   */
  static hasRole(user: User, role: UserRole): boolean {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    return user.roles.some(userRole => userRole.roleName === role);
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: User, roles: UserRole[]): boolean {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    const userRoleNames = user.roles.map(role => role.roleName);
    return roles.some(role => userRoleNames.includes(role));
  }

  /**
   * Get user's primary role (first role)
   */
  static getPrimaryRole(user: User): UserRole | null {
    if (!user || !user.roles || user.roles.length === 0) {
      return null;
    }
    return user.roles[0].roleName as UserRole;
  }

  /**
   * Get all user roles as array of strings
   */
  static getAllRoles(user: User): UserRole[] {
    if (!user || !user.roles || user.roles.length === 0) {
      return [];
    }
    return user.roles.map(role => role.roleName as UserRole);
  }
}
