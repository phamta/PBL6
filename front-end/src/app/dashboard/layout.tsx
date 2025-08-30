'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Plus, 
  BarChart3, 
  Settings, 
  User, 
  Bell,
  Menu,
  X,
  Home,
  LogOut,
  Users,
  Shield,
  BookOpen,
  FileCheck,
  UserCheck,
  GraduationCap,
  Eye,
  FileSignature,
  ClipboardCheck,
  Building,
  Search,
  Download,
  Calendar,
  MessageSquare,
  ChevronDown,
  UserCircle
} from 'lucide-react'
import { usePermissions, UserRole } from '@/hooks/usePermissions'
import { authHelpers } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { UserProfileCard } from '@/components/auth/UserProfileCard'
import { AuthDebug } from '@/components/debug/AuthDebug'

interface NavItem {
  name: string;
  href: string;
  icon: any;
  permission?: string;
  roles?: string[];
}

const baseNavigation: NavItem[] = [
  {
    name: 'Trang chủ',
    href: '/dashboard',
    icon: Home,
  },
]

const adminNavigation: NavItem[] = [
  ...baseNavigation,
  {
    name: 'Quản lý người dùng',
    href: '/dashboard/admin/users',
    icon: Users,
    permission: 'user:read',
  },
  {
    name: 'Phân quyền',
    href: '/dashboard/admin/roles',
    icon: Shield,
    permission: 'user:assign_role',
  },
  {
    name: 'Cấu hình hệ thống',
    href: '/dashboard/admin/system',
    icon: Settings,
    permission: 'system:config',
  },
  {
    name: 'Nhật ký hệ thống',
    href: '/dashboard/admin/logs',
    icon: FileText,
    permission: 'system:logs',
  },
  {
    name: 'Thống kê tổng quan',
    href: '/dashboard/admin/statistics',
    icon: BarChart3,
    permission: 'report:stats',
  },
]

const userNavigation: NavItem[] = [
  ...baseNavigation,
  {
    name: 'Tạo đơn Visa',
    href: '/dashboard/visa/create',
    icon: Plus,
    permission: 'visa:create',
  },
  {
    name: 'Đơn Visa của tôi',
    href: '/dashboard/visa/my-applications',
    icon: FileText,
    permission: 'visa:read',
  },
  {
    name: 'Tạo Biên bản ghi nhớ',
    href: '/dashboard/mou/create',
    icon: FileSignature,
    permission: 'mou:create',
  },
  {
    name: 'Biên bản của đơn vị',
    href: '/dashboard/mou',
    icon: BookOpen,
    permission: 'mou:read',
  },
  {
    name: 'Yêu cầu dịch thuật',
    href: '/dashboard/translation/create',
    icon: MessageSquare,
    permission: 'translation:create',
  },
  {
    name: 'Đăng ký khách',
    href: '/dashboard/visitor/create',
    icon: UserCheck,
    permission: 'visitor:create',
  },
]

const studentNavigation: NavItem[] = [
  ...baseNavigation,
  {
    name: 'Đơn gia hạn Visa',
    href: '/dashboard/visa/create',
    icon: Plus,
    permission: 'visa:create',
  },
  {
    name: 'Đơn của tôi',
    href: '/dashboard/visa/my-applications',
    icon: FileText,
    permission: 'visa:read',
  },
  {
    name: 'Tài liệu hướng dẫn',
    href: '/dashboard/student/guide',
    icon: BookOpen,
  },
  {
    name: 'Lịch hẹn',
    href: '/dashboard/student/appointments',
    icon: Calendar,
  },
]

const specialistNavigation: NavItem[] = [
  ...baseNavigation,
  {
    name: 'Xét duyệt Visa',
    href: '/dashboard/specialist/visa-review',
    icon: ClipboardCheck,
    permission: 'visa:review',
  },
  {
    name: 'Xét duyệt MOU',
    href: '/dashboard/specialist/mou-review',
    icon: FileCheck,
    permission: 'mou:review',
  },
  {
    name: 'Dịch thuật',
    href: '/dashboard/specialist/translation',
    icon: MessageSquare,
    permission: 'translation:review',
  },
  {
    name: 'Quản lý khách',
    href: '/dashboard/specialist/visitor',
    icon: UserCheck,
    permission: 'visitor:read',
  },
  {
    name: 'Báo cáo',
    href: '/dashboard/specialist/reports',
    icon: BarChart3,
    permission: 'report:view',
  },
]

const managerNavigation: NavItem[] = [
  ...baseNavigation,
  {
    name: 'Phê duyệt Visa',
    href: '/dashboard/manager/visa-approval',
    icon: FileCheck,
    permission: 'visa:approve',
  },
  {
    name: 'Phê duyệt MOU',
    href: '/dashboard/manager/mou-approval',
    icon: FileSignature,
    permission: 'mou:approve',
  },
  {
    name: 'Ký MOU',
    href: '/dashboard/manager/mou-signing',
    icon: BookOpen,
    permission: 'mou:sign',
  },
  {
    name: 'Phê duyệt khách',
    href: '/dashboard/manager/visitor-approval',
    icon: UserCheck,
    permission: 'visitor:approve',
  },
  {
    name: 'Thống kê & Báo cáo',
    href: '/dashboard/manager/statistics',
    icon: BarChart3,
    permission: 'report:stats',
  },
  {
    name: 'Xuất báo cáo',
    href: '/dashboard/manager/export',
    icon: Download,
    permission: 'report:export',
  },
]

const viewerNavigation: NavItem[] = [
  ...baseNavigation,
  {
    name: 'Tra cứu Visa',
    href: '/dashboard/viewer/visa-lookup',
    icon: Search,
    permission: 'visa:read',
  },
  {
    name: 'Tra cứu MOU',
    href: '/dashboard/viewer/mou-lookup',
    icon: BookOpen,
    permission: 'mou:read',
  },
  {
    name: 'Tra cứu khách',
    href: '/dashboard/viewer/visitor-lookup',
    icon: UserCheck,
    permission: 'visitor:read',
  },
  {
    name: 'Thống kê công khai',
    href: '/dashboard/viewer/public-stats',
    icon: BarChart3,
    permission: 'report:view',
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { userRole, hasPermission, getRoleDisplayName } = usePermissions()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get navigation based on user role
  const navigation = useMemo(() => {
    switch (userRole) {
      case UserRole.ADMIN:
        return adminNavigation;
      case UserRole.USER:
        return userNavigation;
      case UserRole.STUDENT:
        return studentNavigation;
      case UserRole.SPECIALIST:
        return specialistNavigation;
      case UserRole.MANAGER:
        return managerNavigation;
      case UserRole.VIEWER:
        return viewerNavigation;
      default:
        return baseNavigation;
    }
  }, [userRole])

  // Filter navigation items based on permissions
  const filteredNavigation = useMemo(() => {
    return navigation.filter(item => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    });
  }, [navigation, hasPermission])

  const getRoleTitle = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return 'Hệ thống quản trị';
      case UserRole.USER:
        return 'Cổng thông tin đơn vị';
      case UserRole.STUDENT:
        return 'Cổng thông tin sinh viên';
      case UserRole.SPECIALIST:
        return 'Hệ thống xét duyệt';
      case UserRole.MANAGER:
        return 'Hệ thống phê duyệt';
      case UserRole.VIEWER:
        return 'Hệ thống tra cứu';
      default:
        return 'Cổng thông tin HTQT';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{getRoleTitle()}</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:bg-white lg:shadow-sm lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{getRoleTitle()}</h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Đăng nhập với vai trò:</p>
              <p className="text-sm font-medium text-gray-900">{getRoleDisplayName(userRole)}</p>
            </div>
            <LogoutButton variant="outline" fullWidth={true} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">
                {filteredNavigation.find(item => item.href === pathname)?.name || 'Trang chủ'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden sm:block text-sm font-medium">
                    {authHelpers.getUser()?.name || 'Người dùng'}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 z-50">
                    <UserProfileCard onClose={() => setUserMenuOpen(false)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Auth Debug Component - only in development */}
      {process.env.NODE_ENV === 'development' && <AuthDebug />}
    </div>
  )
}
