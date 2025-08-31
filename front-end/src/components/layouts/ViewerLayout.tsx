'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Bell,
  Menu,
  X,
  Home,
  BookOpen,
  UserCheck,
  BarChart3,
  Eye,
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
}

const viewerNavigation: NavItem[] = [
  {
    name: 'Trang chủ',
    href: '/dashboard',
    icon: Home,
  },
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

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { userRole, hasPermission } = usePermissions()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Redirect if not viewer
  useEffect(() => {
    if (userRole && userRole !== UserRole.VIEWER) {
      router.push('/dashboard')
    }
  }, [userRole, router])

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

  // Filter navigation items based on permissions
  const filteredNavigation = viewerNavigation.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  if (userRole !== UserRole.VIEWER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-teal-700">👁️ Hệ thống tra cứu</h2>
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
                          ? 'bg-teal-100 text-teal-700'
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
          <div className="p-6 border-b bg-teal-50">
            <h2 className="text-xl font-bold text-teal-700">👁️ Hệ thống tra cứu</h2>
            <p className="text-sm text-teal-600 mt-1">Information Lookup System</p>
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
                          ? 'bg-teal-100 text-teal-700'
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
            <div className="mb-3 px-3 py-2 bg-teal-50 rounded-lg">
              <p className="text-xs text-teal-600 mb-1">Đăng nhập với vai trò:</p>
              <p className="text-sm font-medium text-teal-700">Người dùng tra cứu</p>
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
                    {authHelpers.getUser()?.name || 'Viewer'}
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
