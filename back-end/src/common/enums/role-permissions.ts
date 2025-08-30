import { Permission } from './permission.enum';
import { UserRole } from './user.enum';

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [UserRole.ADMIN]: [
    // Full system access
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ASSIGN_ROLE,
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_BACKUP,
    Permission.SYSTEM_LOGS,
    
    // All other permissions
    Permission.MOU_CREATE,
    Permission.MOU_READ,
    Permission.MOU_UPDATE,
    Permission.MOU_DELETE,
    Permission.MOU_REVIEW,
    Permission.MOU_APPROVE,
    Permission.MOU_SIGN,
    Permission.MOU_TERMINATE,
    Permission.MOU_ASSIGN,
    Permission.MOU_EXPORT,
    
    Permission.VISA_CREATE,
    Permission.VISA_READ,
    Permission.VISA_UPDATE,
    Permission.VISA_DELETE,
    Permission.VISA_REVIEW,
    Permission.VISA_APPROVE,
    Permission.VISA_REJECT,
    Permission.VISA_ASSIGN,
    Permission.VISA_EXPORT,
    
    Permission.TRANSLATION_CREATE,
    Permission.TRANSLATION_READ,
    Permission.TRANSLATION_UPDATE,
    Permission.TRANSLATION_DELETE,
    Permission.TRANSLATION_REVIEW,
    Permission.TRANSLATION_APPROVE,
    Permission.TRANSLATION_CERTIFY,
    
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_UPDATE,
    Permission.VISITOR_DELETE,
    Permission.VISITOR_APPROVE,
    Permission.VISITOR_EXPORT,
    
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.REPORT_STATS,
    
    Permission.NOTIFICATION_SEND,
    Permission.NOTIFICATION_MANAGE,
    
    Permission.DATA_VIEW_ALL,
    Permission.DATA_VIEW_DEPARTMENT,
    Permission.DATA_VIEW_OWN,
    Permission.DATA_VIEW_PUBLIC,
  ],

  [UserRole.MANAGER]: [
    // Department management
    Permission.USER_READ,
    Permission.USER_UPDATE, // Can edit department users
    
    // All business functions
    Permission.MOU_CREATE,
    Permission.MOU_READ,
    Permission.MOU_UPDATE,
    Permission.MOU_DELETE,
    Permission.MOU_REVIEW,
    Permission.MOU_APPROVE,
    Permission.MOU_SIGN,
    Permission.MOU_TERMINATE,
    Permission.MOU_ASSIGN,
    Permission.MOU_EXPORT,
    
    Permission.VISA_CREATE,
    Permission.VISA_READ,
    Permission.VISA_UPDATE,
    Permission.VISA_DELETE,
    Permission.VISA_REVIEW,
    Permission.VISA_APPROVE,
    Permission.VISA_REJECT,
    Permission.VISA_ASSIGN,
    Permission.VISA_EXPORT,
    
    Permission.TRANSLATION_CREATE,
    Permission.TRANSLATION_READ,
    Permission.TRANSLATION_UPDATE,
    Permission.TRANSLATION_DELETE,
    Permission.TRANSLATION_REVIEW,
    Permission.TRANSLATION_APPROVE,
    Permission.TRANSLATION_CERTIFY,
    
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_UPDATE,
    Permission.VISITOR_DELETE,
    Permission.VISITOR_APPROVE,
    Permission.VISITOR_EXPORT,
    
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.REPORT_STATS,
    
    Permission.NOTIFICATION_SEND,
    Permission.NOTIFICATION_MANAGE,
    
    Permission.DATA_VIEW_ALL,
    Permission.DATA_VIEW_DEPARTMENT,
    Permission.DATA_VIEW_OWN,
    Permission.DATA_VIEW_PUBLIC,
  ],

  [UserRole.SPECIALIST]: [
    // Basic operations
    Permission.USER_READ, // View only
    
    Permission.MOU_CREATE,
    Permission.MOU_READ,
    Permission.MOU_UPDATE,
    Permission.MOU_REVIEW,
    
    Permission.VISA_CREATE,
    Permission.VISA_READ,
    Permission.VISA_UPDATE,
    Permission.VISA_REVIEW,
    
    Permission.TRANSLATION_CREATE,
    Permission.TRANSLATION_READ,
    Permission.TRANSLATION_UPDATE,
    Permission.TRANSLATION_REVIEW,
    
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_UPDATE,
    
    Permission.REPORT_VIEW,
    
    Permission.NOTIFICATION_SEND,
    
    Permission.DATA_VIEW_DEPARTMENT,
    Permission.DATA_VIEW_OWN,
    Permission.DATA_VIEW_PUBLIC,
  ],

  [UserRole.STUDENT]: [
    // Self-service only
    Permission.USER_READ, // Own profile only
    Permission.USER_UPDATE, // Own profile only
    
    Permission.VISA_CREATE, // Own applications
    Permission.VISA_READ, // Own visas
    
    Permission.TRANSLATION_READ, // View translations
    
    Permission.NOTIFICATION_SEND, // Basic notifications
    
    Permission.DATA_VIEW_OWN,
    Permission.DATA_VIEW_PUBLIC,
  ],

  [UserRole.USER]: [
    // Limited access for faculty
    Permission.USER_READ, // Own profile
    Permission.USER_UPDATE, // Own profile
    
    Permission.MOU_READ, // View MOUs related to faculty
    
    Permission.VISITOR_CREATE, // Invite visitors
    Permission.VISITOR_READ,
    
    Permission.TRANSLATION_READ,
    
    Permission.REPORT_VIEW,
    
    Permission.DATA_VIEW_DEPARTMENT,
    Permission.DATA_VIEW_OWN,
    Permission.DATA_VIEW_PUBLIC,
  ],

  [UserRole.VIEWER]: [
    // Read-only access
    Permission.MOU_READ,
    Permission.VISA_READ,
    Permission.TRANSLATION_READ,
    Permission.VISITOR_READ,
    Permission.REPORT_VIEW,
    Permission.DATA_VIEW_PUBLIC,
  ],

  [UserRole.SYSTEM]: [
    // Automated system functions
    Permission.NOTIFICATION_SEND,
    Permission.NOTIFICATION_MANAGE,
    Permission.SYSTEM_LOGS,
  ],
};

// Helper function to get permissions for a role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Helper function to check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
}
