'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authHelpers } from '@/lib/auth';
import { UserRole } from '@/hooks/usePermissions';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (authHelpers.isAuthenticated()) {
      const user = authHelpers.getUser();
      const userRole = user?.role;
      
      // Redirect based on user role to their specific dashboard
      switch (userRole) {
        case UserRole.ADMIN:
          router.push('/dashboard'); // Admin dashboard with AdminLayout
          break;
        case UserRole.USER:
          router.push('/dashboard'); // User dashboard with UserLayout
          break;
        case UserRole.STUDENT:
          router.push('/dashboard'); // Student dashboard with StudentLayout
          break;
        case UserRole.SPECIALIST:
          router.push('/dashboard'); // Specialist dashboard with SpecialistLayout
          break;
        case UserRole.MANAGER:
          router.push('/dashboard'); // Manager dashboard with ManagerLayout
          break;
        case UserRole.VIEWER:
          router.push('/dashboard'); // Viewer dashboard with ViewerLayout
          break;
        default:
          router.push('/dashboard'); // Default to dashboard
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}
