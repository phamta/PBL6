import { authHelpers } from '@/lib/auth';

// Frontend role constants matching backend
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user', 
  STUDENT: 'student',
  SPECIALIST: 'specialist',
  MANAGER: 'manager',
  VIEWER: 'viewer',
  SYSTEM: 'system',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Permission interface
export interface Permission {
  // User Management
  USER_CREATE: 'user:create';
  USER_READ: 'user:read';
  USER_UPDATE: 'user:update';
  USER_DELETE: 'user:delete';
  USER_ASSIGN_ROLE: 'user:assign_role';

  // System Configuration
  SYSTEM_CONFIG: 'system:config';
  SYSTEM_BACKUP: 'system:backup';
  SYSTEM_LOGS: 'system:logs';

  // Visa Management
  VISA_CREATE: 'visa:create';
  VISA_READ: 'visa:read';
  VISA_UPDATE: 'visa:update';
  VISA_DELETE: 'visa:delete';
  VISA_REVIEW: 'visa:review';
  VISA_APPROVE: 'visa:approve';
  VISA_REJECT: 'visa:reject';
  VISA_ASSIGN: 'visa:assign';
  VISA_EXPORT: 'visa:export';

  // MOU Management
  MOU_CREATE: 'mou:create';
  MOU_READ: 'mou:read';
  MOU_UPDATE: 'mou:update';
  MOU_DELETE: 'mou:delete';
  MOU_REVIEW: 'mou:review';
  MOU_APPROVE: 'mou:approve';
  MOU_SIGN: 'mou:sign';
  MOU_TERMINATE: 'mou:terminate';
  MOU_ASSIGN: 'mou:assign';
  MOU_EXPORT: 'mou:export';

  // Translation Management
  TRANSLATION_CREATE: 'translation:create';
  TRANSLATION_READ: 'translation:read';
  TRANSLATION_UPDATE: 'translation:update';
  TRANSLATION_DELETE: 'translation:delete';
  TRANSLATION_REVIEW: 'translation:review';
  TRANSLATION_APPROVE: 'translation:approve';
  TRANSLATION_CERTIFY: 'translation:certify';

  // Visitor Management
  VISITOR_CREATE: 'visitor:create';
  VISITOR_READ: 'visitor:read';
  VISITOR_UPDATE: 'visitor:update';
  VISITOR_DELETE: 'visitor:delete';
  VISITOR_APPROVE: 'visitor:approve';
  VISITOR_EXPORT: 'visitor:export';

  // Reports
  REPORT_VIEW: 'report:view';
  REPORT_EXPORT: 'report:export';
  REPORT_STATS: 'report:stats';

  // Notifications
  NOTIFICATION_SEND: 'notification:send';
  NOTIFICATION_MANAGE: 'notification:manage';

  // Data Access
  DATA_VIEW_ALL: 'data:view_all';
  DATA_VIEW_DEPARTMENT: 'data:view_department';
  DATA_VIEW_OWN: 'data:view_own';
  DATA_VIEW_PUBLIC: 'data:view_public';
}

// Role-Permission Mapping (matching backend)
const ROLE_PERMISSIONS: Record<UserRoleType, string[]> = {
  [UserRole.ADMIN]: [
    // Full system access
    'user:create', 'user:read', 'user:update', 'user:delete', 'user:assign_role',
    'system:config', 'system:backup', 'system:logs',
    'data:view_all', 'report:view', 'report:export', 'report:stats',
    'notification:manage',
    // All module permissions
    'visa:create', 'visa:read', 'visa:update', 'visa:delete', 'visa:review', 
    'visa:approve', 'visa:reject', 'visa:assign', 'visa:export',
    'mou:create', 'mou:read', 'mou:update', 'mou:delete', 'mou:review',
    'mou:approve', 'mou:sign', 'mou:terminate', 'mou:assign', 'mou:export',
    'translation:create', 'translation:read', 'translation:update', 'translation:delete',
    'translation:review', 'translation:approve', 'translation:certify',
    'visitor:create', 'visitor:read', 'visitor:update', 'visitor:delete',
    'visitor:approve', 'visitor:export',
  ],

  [UserRole.USER]: [
    // Department level access
    'data:view_department',
    'visa:create', 'visa:read', 'visa:update',
    'mou:create', 'mou:read', 'mou:update',
    'translation:create', 'translation:read', 'translation:update',
    'visitor:create', 'visitor:read', 'visitor:update',
  ],

  [UserRole.STUDENT]: [
    // Own data only access
    'data:view_own',
    'visa:create', 'visa:read', 'visa:update',
  ],

  [UserRole.SPECIALIST]: [
    // Processing and review access
    'data:view_all',
    'visa:read', 'visa:review', 'visa:assign',
    'mou:read', 'mou:review', 'mou:assign',
    'translation:read', 'translation:review', 'translation:certify',
    'visitor:read', 'visitor:update',
    'report:view', 'report:export',
  ],

  [UserRole.MANAGER]: [
    // Approval level access
    'data:view_all',
    'visa:read', 'visa:approve', 'visa:reject', 'visa:export',
    'mou:read', 'mou:approve', 'mou:sign', 'mou:terminate', 'mou:export',
    'translation:read', 'translation:approve',
    'visitor:read', 'visitor:approve', 'visitor:export',
    'report:view', 'report:export', 'report:stats',
  ],

  [UserRole.VIEWER]: [
    // Read-only public access
    'data:view_public',
    'visa:read', 'mou:read', 'translation:read', 'visitor:read',
    'report:view',
  ],

  [UserRole.SYSTEM]: [
    // System automation access
    'notification:send',
    'data:view_all',
    'visa:read', 'mou:read',
  ],
};

export const usePermissions = () => {
  const user = authHelpers.getUser();

  /**
   * Check if current user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role as UserRoleType] || [];
    return userPermissions.includes(permission);
  };

  /**
   * Check if current user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user?.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role as UserRoleType] || [];
    return permissions.some(permission => userPermissions.includes(permission));
  };

  /**
   * Check if current user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user?.role) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role as UserRoleType] || [];
    return permissions.every(permission => userPermissions.includes(permission));
  };

  /**
   * Check if user can access data based on role and data scope
   */
  const canAccessData = (dataScope: 'own' | 'department' | 'all' | 'public'): boolean => {
    switch (dataScope) {
      case 'own':
        return hasAnyPermission(['data:view_own', 'data:view_department', 'data:view_all']);
      case 'department':
        return hasAnyPermission(['data:view_department', 'data:view_all']);
      case 'all':
        return hasPermission('data:view_all');
      case 'public':
        return hasAnyPermission(['data:view_public', 'data:view_own', 'data:view_department', 'data:view_all']);
      default:
        return false;
    }
  };

  /**
   * Check if user can perform action on specific module
   */
  const canAccessModule = (
    module: 'visa' | 'mou' | 'translation' | 'visitor',
    action: 'create' | 'read' | 'update' | 'delete' | 'review' | 'approve'
  ): boolean => {
    const permission = `${module}:${action}`;
    return hasPermission(permission);
  };

  /**
   * Get user role display name in Vietnamese
   */
  const getRoleDisplayName = (role?: UserRoleType): string => {
    const roleNames = {
      [UserRole.ADMIN]: 'Admin CNTT',
      [UserRole.USER]: 'Người dùng cơ sở',
      [UserRole.STUDENT]: 'Sinh viên/Học viên quốc tế',
      [UserRole.SPECIALIST]: 'Chuyên viên HTQT/KHCN&ĐN',
      [UserRole.MANAGER]: 'Lãnh đạo Phòng',
      [UserRole.VIEWER]: 'Người dùng tra cứu',
      [UserRole.SYSTEM]: 'Hệ thống',
    };
    
    return roleNames[role as UserRoleType] || role || 'Không xác định';
  };

  /**
   * Check specific role-based actions
   */
  const can = {
    // User management
    createUser: () => hasPermission('user:create'),
    manageUsers: () => hasPermission('user:read'),
    assignRoles: () => hasPermission('user:assign_role'),
    
    // System
    configureSystem: () => hasPermission('system:config'),
    viewSystemLogs: () => hasPermission('system:logs'),
    
    // MOU
    createMOU: () => hasPermission('mou:create'),
    viewMOU: () => hasPermission('mou:read'),
    editMOU: () => hasPermission('mou:update'),
    deleteMOU: () => hasPermission('mou:delete'),
    reviewMOU: () => hasPermission('mou:review'),
    approveMOU: () => hasPermission('mou:approve'),
    signMOU: () => hasPermission('mou:sign'),
    terminateMOU: () => hasPermission('mou:terminate'),
    exportMOU: () => hasPermission('mou:export'),
    
    // Visa
    createVisa: () => hasPermission('visa:create'),
    viewVisa: () => hasPermission('visa:read'),
    editVisa: () => hasPermission('visa:update'),
    deleteVisa: () => hasPermission('visa:delete'),
    reviewVisa: () => hasPermission('visa:review'),
    approveVisa: () => hasPermission('visa:approve'),
    rejectVisa: () => hasPermission('visa:reject'),
    exportVisa: () => hasPermission('visa:export'),
    
    // Translation
    createTranslation: () => hasPermission('translation:create'),
    viewTranslation: () => hasPermission('translation:read'),
    editTranslation: () => hasPermission('translation:update'),
    deleteTranslation: () => hasPermission('translation:delete'),
    reviewTranslation: () => hasPermission('translation:review'),
    approveTranslation: () => hasPermission('translation:approve'),
    certifyTranslation: () => hasPermission('translation:certify'),
    
    // Visitor
    createVisitor: () => hasPermission('visitor:create'),
    viewVisitor: () => hasPermission('visitor:read'),
    editVisitor: () => hasPermission('visitor:update'),
    deleteVisitor: () => hasPermission('visitor:delete'),
    approveVisitor: () => hasPermission('visitor:approve'),
    exportVisitor: () => hasPermission('visitor:export'),
    
    // Reports
    viewReports: () => hasPermission('report:view'),
    exportReports: () => hasPermission('report:export'),
    viewStatistics: () => hasPermission('report:stats'),
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessData,
    canAccessModule,
    getRoleDisplayName,
    can,
    userRole: user?.role as UserRoleType,
    isAdmin: user?.role === UserRole.ADMIN,
    isUser: user?.role === UserRole.USER,
    isStudent: user?.role === UserRole.STUDENT,
    isSpecialist: user?.role === UserRole.SPECIALIST,
    isManager: user?.role === UserRole.MANAGER,
    isViewer: user?.role === UserRole.VIEWER,
    isSystem: user?.role === UserRole.SYSTEM,
  };
};
