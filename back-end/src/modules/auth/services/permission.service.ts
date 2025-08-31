import { Injectable } from '@nestjs/common';
import { Permission } from '../../../common/enums/permission.enum';
import { ROLE_PERMISSIONS } from '../../../common/enums/role-permissions';
import { UserRole } from '../../../common/enums/user.enum';

@Injectable()
export class PermissionService {
  /**
   * Check if a user role has a specific permission
   */
  hasPermission(userRole: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
  }

  /**
   * Check if a user role has any of the specified permissions
   */
  hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Check if a user role has all of the specified permissions
   */
  hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Get all permissions for a user role
   */
  getPermissions(userRole: UserRole): Permission[] {
    return ROLE_PERMISSIONS[userRole] || [];
  }

  /**
   * Check if user can access data based on role and data scope
   */
  canAccessData(userRole: UserRole, dataScope: 'own' | 'department' | 'all' | 'public'): boolean {
    const permissions = this.getPermissions(userRole);
    
    switch (dataScope) {
      case 'own':
        return permissions.includes(Permission.DATA_VIEW_OWN) || 
               permissions.includes(Permission.DATA_VIEW_DEPARTMENT) ||
               permissions.includes(Permission.DATA_VIEW_ALL);
      
      case 'department':
        return permissions.includes(Permission.DATA_VIEW_DEPARTMENT) ||
               permissions.includes(Permission.DATA_VIEW_ALL);
      
      case 'all':
        return permissions.includes(Permission.DATA_VIEW_ALL);
      
      case 'public':
        return permissions.includes(Permission.DATA_VIEW_PUBLIC) ||
               permissions.includes(Permission.DATA_VIEW_OWN) ||
               permissions.includes(Permission.DATA_VIEW_DEPARTMENT) ||
               permissions.includes(Permission.DATA_VIEW_ALL);
      
      default:
        return false;
    }
  }

  /**
   * Check if user can perform action on specific module
   */
  canAccessModule(
    userRole: UserRole, 
    module: 'visa' | 'mou' | 'translation' | 'visitor',
    action: 'create' | 'read' | 'update' | 'delete' | 'review' | 'approve'
  ): boolean {
    const permissionKey = `${module}:${action}` as Permission;
    return this.hasPermission(userRole, permissionKey);
  }

  /**
   * Get role display name in Vietnamese
   */
  getRoleDisplayName(role: UserRole): string {
    const roleNames = {
      [UserRole.ADMIN]: 'Admin CNTT',
      [UserRole.USER]: 'Người dùng cơ sở',
      [UserRole.STUDENT]: 'Sinh viên/Học viên quốc tế',
      [UserRole.SPECIALIST]: 'Chuyên viên HTQT/KHCN&ĐN',
      [UserRole.MANAGER]: 'Lãnh đạo Phòng',
      [UserRole.VIEWER]: 'Người dùng tra cứu',
      [UserRole.SYSTEM]: 'Hệ thống',
    };
    
    return roleNames[role] || role;
  }

  /**
   * Get permissions display names in Vietnamese
   */
  getPermissionDisplayName(permission: Permission): string {
    const permissionNames = {
      // User Management
      [Permission.USER_CREATE]: 'Tạo tài khoản',
      [Permission.USER_READ]: 'Xem tài khoản',
      [Permission.USER_UPDATE]: 'Cập nhật tài khoản',
      [Permission.USER_DELETE]: 'Xóa tài khoản',
      [Permission.USER_ASSIGN_ROLE]: 'Phân quyền',

      // System
      [Permission.SYSTEM_CONFIG]: 'Cấu hình hệ thống',
      [Permission.SYSTEM_BACKUP]: 'Sao lưu hệ thống',
      [Permission.SYSTEM_LOGS]: 'Xem nhật ký hệ thống',

      // Visa
      [Permission.VISA_CREATE]: 'Tạo hồ sơ Visa',
      [Permission.VISA_READ]: 'Xem hồ sơ Visa',
      [Permission.VISA_UPDATE]: 'Cập nhật hồ sơ Visa',
      [Permission.VISA_DELETE]: 'Xóa hồ sơ Visa',
      [Permission.VISA_REVIEW]: 'Duyệt sơ bộ Visa',
      [Permission.VISA_APPROVE]: 'Phê duyệt Visa',
      [Permission.VISA_REJECT]: 'Từ chối Visa',
      [Permission.VISA_ASSIGN]: 'Phân công Visa',
      [Permission.VISA_EXPORT]: 'Xuất báo cáo Visa',

      // MOU
      [Permission.MOU_CREATE]: 'Tạo MOU',
      [Permission.MOU_READ]: 'Xem MOU',
      [Permission.MOU_UPDATE]: 'Cập nhật MOU',
      [Permission.MOU_DELETE]: 'Xóa MOU',
      [Permission.MOU_REVIEW]: 'Duyệt sơ bộ MOU',
      [Permission.MOU_APPROVE]: 'Phê duyệt MOU',
      [Permission.MOU_SIGN]: 'Ký MOU',
      [Permission.MOU_TERMINATE]: 'Chấm dứt MOU',
      [Permission.MOU_ASSIGN]: 'Phân công MOU',
      [Permission.MOU_EXPORT]: 'Xuất báo cáo MOU',

      // Translation
      [Permission.TRANSLATION_CREATE]: 'Tạo yêu cầu dịch',
      [Permission.TRANSLATION_READ]: 'Xem yêu cầu dịch',
      [Permission.TRANSLATION_UPDATE]: 'Cập nhật yêu cầu dịch',
      [Permission.TRANSLATION_DELETE]: 'Xóa yêu cầu dịch',
      [Permission.TRANSLATION_REVIEW]: 'Duyệt bản dịch',
      [Permission.TRANSLATION_APPROVE]: 'Phê duyệt bản dịch',
      [Permission.TRANSLATION_CERTIFY]: 'Xác nhận bản dịch',

      // Visitor
      [Permission.VISITOR_CREATE]: 'Tạo đoàn vào',
      [Permission.VISITOR_READ]: 'Xem đoàn vào',
      [Permission.VISITOR_UPDATE]: 'Cập nhật đoàn vào',
      [Permission.VISITOR_DELETE]: 'Xóa đoàn vào',
      [Permission.VISITOR_APPROVE]: 'Phê duyệt đoàn vào',
      [Permission.VISITOR_EXPORT]: 'Xuất báo cáo đoàn vào',

      // Reports
      [Permission.REPORT_VIEW]: 'Xem báo cáo',
      [Permission.REPORT_EXPORT]: 'Xuất báo cáo',
      [Permission.REPORT_STATS]: 'Xem thống kê',

      // Notifications
      [Permission.NOTIFICATION_SEND]: 'Gửi thông báo',
      [Permission.NOTIFICATION_MANAGE]: 'Quản lý thông báo',

      // Data Access
      [Permission.DATA_VIEW_ALL]: 'Xem toàn bộ dữ liệu',
      [Permission.DATA_VIEW_DEPARTMENT]: 'Xem dữ liệu đơn vị',
      [Permission.DATA_VIEW_OWN]: 'Xem dữ liệu cá nhân',
      [Permission.DATA_VIEW_PUBLIC]: 'Xem dữ liệu công khai',
    };

    return permissionNames[permission] || permission;
  }
}
