'use client'

import { usePermissions, UserRole } from '@/hooks/usePermissions'
import AdminLayout from './AdminLayout'
import UserLayout from './UserLayout'
import StudentLayout from './StudentLayout'
import SpecialistLayout from './SpecialistLayout'
import ManagerLayout from './ManagerLayout'
import ViewerLayout from './ViewerLayout'

export default function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userRole } = usePermissions()

  // Show loading while role is being determined
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giao diện...</p>
        </div>
      </div>
    )
  }

  // Render appropriate layout based on user role
  switch (userRole) {
    case UserRole.ADMIN:
      return <AdminLayout>{children}</AdminLayout>
    
    case UserRole.USER:
      return <UserLayout>{children}</UserLayout>
    
    case UserRole.STUDENT:
      return <StudentLayout>{children}</StudentLayout>
    
    case UserRole.SPECIALIST:
      return <SpecialistLayout>{children}</SpecialistLayout>
    
    case UserRole.MANAGER:
      return <ManagerLayout>{children}</ManagerLayout>
    
    case UserRole.VIEWER:
      return <ViewerLayout>{children}</ViewerLayout>
    
    default:
      // Fallback to user layout for unknown roles
      return <UserLayout>{children}</UserLayout>
  }
}
