'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authHelpers } from '@/lib/auth'
import { UserRole, UserRoleType } from '@/hooks/usePermissions'
import { getDashboardUrl } from '@/lib/role-navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call real API using authHelpers
      const response = await authHelpers.login({ email, password })
      
      if (response.success && response.data) {
        // Get user role from response
        const userRole = response.data.user.role || UserRole.USER
        
        // Redirect to appropriate dashboard based on role
        const dashboardUrl = getDashboardUrl(userRole as UserRoleType)
        
        console.log(`Redirecting ${userRole} to: ${dashboardUrl}`)
        router.push(dashboardUrl)
      } else {
        setError(response.message || 'Đăng nhập thất bại')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response?.status === 401) {
        setError('Email hoặc mật khẩu không đúng')
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.')
      } else if (error.message) {
        setError(error.message)
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearData = () => {
    authHelpers.removeToken()
    authHelpers.removeUser()
    localStorage.clear()
    setError('')
    alert('Đã xóa dữ liệu cache. Vui lòng thử đăng nhập lại.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            PBL6 - Hệ thống Quản lý Hợp tác Quốc tế
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Thông tin đăng nhập:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• <strong>Email:</strong> admin@htqt.edu.vn</p>
              <p>• <strong>Mật khẩu:</strong> 123456</p>
              <p className="mt-2 text-red-600">
                <strong>Lưu ý:</strong> Backend phải chạy trên localhost:3001
              </p>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
