import { UserRole, UserRoleType } from '@/hooks/usePermissions';

/**
 * Get the appropriate dashboard URL based on user role
 */
export const getDashboardUrl = (userRole: UserRoleType): string => {
  switch (userRole) {
    case UserRole.ADMIN:
      return '/dashboard/admin';
    case UserRole.STUDENT:
      return '/dashboard/student';
    case UserRole.SPECIALIST:
      return '/dashboard/specialist';
    case UserRole.MANAGER:
      return '/dashboard/manager';
    case UserRole.VIEWER:
      return '/dashboard/viewer';
    case UserRole.USER:
    default:
      return '/dashboard';
  }
};

/**
 * Get the default landing page URLs for each role
 */
export const getRoleLandingPages = () => ({
  [UserRole.ADMIN]: {
    primary: '/dashboard/admin',
    secondary: '/dashboard/admin/users',
    description: 'Quản lý hệ thống'
  },
  [UserRole.USER]: {
    primary: '/dashboard',
    secondary: '/dashboard/visa',
    description: 'Tạo đơn và quản lý'
  },
  [UserRole.STUDENT]: {
    primary: '/dashboard/student',
    secondary: '/dashboard/visa/create',
    description: 'Gia hạn visa và thủ tục'
  },
  [UserRole.SPECIALIST]: {
    primary: '/dashboard/specialist',
    secondary: '/dashboard/specialist/visa-review',
    description: 'Xét duyệt và xử lý'
  },
  [UserRole.MANAGER]: {
    primary: '/dashboard/manager',
    secondary: '/dashboard/manager/visa-approval',
    description: 'Phê duyệt và ký duyệt'
  },
  [UserRole.VIEWER]: {
    primary: '/dashboard/viewer',
    secondary: '/dashboard/viewer/visa-lookup',
    description: 'Tra cứu thông tin'
  },
  [UserRole.SYSTEM]: {
    primary: '/dashboard',
    secondary: '/dashboard',
    description: 'Hệ thống tự động'
  }
});

/**
 * Check if a user can access a specific route based on their role
 */
export const canAccessRoute = (userRole: UserRoleType, route: string): boolean => {
  // Admin can access everything
  if (userRole === UserRole.ADMIN) {
    return true;
  }

  // Define role-specific route patterns
  const routePermissions = {
    [UserRole.USER]: [
      '/dashboard',
      '/dashboard/visa',
      '/dashboard/mou',
      '/dashboard/translation',
      '/dashboard/visitor'
    ],
    [UserRole.STUDENT]: [
      '/dashboard',
      '/dashboard/student',
      '/dashboard/visa/create',
      '/dashboard/visa/my',
      '/dashboard/student/guide',
      '/dashboard/student/appointments'
    ],
    [UserRole.SPECIALIST]: [
      '/dashboard',
      '/dashboard/specialist',
      '/dashboard/specialist/visa-review',
      '/dashboard/specialist/mou-review',
      '/dashboard/specialist/translation',
      '/dashboard/specialist/reports',
      '/dashboard/visa',
      '/dashboard/mou',
      '/dashboard/translation',
      '/dashboard/visitor'
    ],
    [UserRole.MANAGER]: [
      '/dashboard',
      '/dashboard/manager',
      '/dashboard/manager/visa-approval',
      '/dashboard/manager/mou-signing',
      '/dashboard/manager/visitor-approval',
      '/dashboard/manager/statistics',
      '/dashboard/manager/export',
      '/dashboard/visa',
      '/dashboard/mou',
      '/dashboard/translation',
      '/dashboard/visitor'
    ],
    [UserRole.VIEWER]: [
      '/dashboard',
      '/dashboard/viewer',
      '/dashboard/viewer/visa-lookup',
      '/dashboard/viewer/mou-lookup',
      '/dashboard/viewer/visitor-lookup',
      '/dashboard/viewer/public-stats'
    ],
    [UserRole.SYSTEM]: [
      '/dashboard'
    ]
  };

  const allowedRoutes = routePermissions[userRole] || [];
  
  // Check if the route starts with any allowed pattern
  return allowedRoutes.some(allowedRoute => 
    route === allowedRoute || route.startsWith(allowedRoute + '/')
  );
};

/**
 * Redirect to appropriate page if user doesn't have access
 */
export const getRedirectUrl = (userRole: UserRoleType, attemptedRoute: string): string => {
  if (canAccessRoute(userRole, attemptedRoute)) {
    return attemptedRoute;
  }
  
  // If user can't access the route, redirect to their default dashboard
  return getDashboardUrl(userRole);
};
