// Permission enum for the application
export enum Permission {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_ASSIGN_ROLE = 'user:assign_role',

  // System Configuration
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_LOGS = 'system:logs',

  // Visa Management
  VISA_CREATE = 'visa:create',
  VISA_READ = 'visa:read',
  VISA_UPDATE = 'visa:update',
  VISA_DELETE = 'visa:delete',
  VISA_REVIEW = 'visa:review',
  VISA_APPROVE = 'visa:approve',
  VISA_REJECT = 'visa:reject',
  VISA_ASSIGN = 'visa:assign',
  VISA_EXPORT = 'visa:export',

  // MOU Management
  MOU_CREATE = 'mou:create',
  MOU_READ = 'mou:read',
  MOU_UPDATE = 'mou:update',
  MOU_DELETE = 'mou:delete',
  MOU_REVIEW = 'mou:review',
  MOU_APPROVE = 'mou:approve',
  MOU_SIGN = 'mou:sign',
  MOU_TERMINATE = 'mou:terminate',
  MOU_ASSIGN = 'mou:assign',
  MOU_EXPORT = 'mou:export',

  // Translation Management
  TRANSLATION_CREATE = 'translation:create',
  TRANSLATION_READ = 'translation:read',
  TRANSLATION_UPDATE = 'translation:update',
  TRANSLATION_DELETE = 'translation:delete',
  TRANSLATION_REVIEW = 'translation:review',
  TRANSLATION_APPROVE = 'translation:approve',
  TRANSLATION_CERTIFY = 'translation:certify',

  // Visitor Management
  VISITOR_CREATE = 'visitor:create',
  VISITOR_READ = 'visitor:read',
  VISITOR_UPDATE = 'visitor:update',
  VISITOR_DELETE = 'visitor:delete',
  VISITOR_APPROVE = 'visitor:approve',
  VISITOR_EXPORT = 'visitor:export',

  // Reports
  REPORT_VIEW = 'report:view',
  REPORT_EXPORT = 'report:export',
  REPORT_STATS = 'report:stats',

  // Notifications
  NOTIFICATION_SEND = 'notification:send',
  NOTIFICATION_MANAGE = 'notification:manage',

  // Data Access
  DATA_VIEW_ALL = 'data:view_all',
  DATA_VIEW_DEPARTMENT = 'data:view_department',
  DATA_VIEW_OWN = 'data:view_own',
  DATA_VIEW_PUBLIC = 'data:view_public',
}
