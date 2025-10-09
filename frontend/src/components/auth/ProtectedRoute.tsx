/**
 * ProtectedRoute Component
 * Bảo vệ routes yêu cầu authentication và role cụ thể
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { RoleCode } from '@/lib/auth/roles';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: (RoleCode | string)[];
  redirectTo?: string;
}

/**
 * Component bảo vệ route với authentication và role-based access
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAnyRole, dashboardRoute } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Nếu chưa đăng nhập, redirect to login
      if (!isAuthenticated) {
        console.log('🚫 Not authenticated, redirecting to login');
        router.push(redirectTo);
        return;
      }

      // Nếu có yêu cầu role cụ thể
      if (allowedRoles && allowedRoles.length > 0) {
        // Kiểm tra user có role được phép không
        if (!hasAnyRole(allowedRoles)) {
          console.log('🚫 User does not have required roles, redirecting to:', dashboardRoute);
          // Redirect về dashboard tương ứng với role của user
          router.push(dashboardRoute);
        } else {
          console.log('✅ User has required roles, access granted');
        }
      }
    }
  }, [isAuthenticated, isLoading, hasAnyRole, allowedRoles, router, redirectTo]);

  // Show loading khi đang check authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa authenticated hoặc không có quyền, không render gì
  if (!isAuthenticated) {
    return null;
  }

  // Nếu có yêu cầu role nhưng user không có role phù hợp
  if (allowedRoles && allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return null;
  }

  // Render children nếu pass tất cả checks
  return <>{children}</>;
}

export default ProtectedRoute;
