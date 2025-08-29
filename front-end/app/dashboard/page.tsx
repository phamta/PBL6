'use client'

import { useEffect, useState } from 'react'
import { authHelpers } from '@/lib/auth'

export default function DashboardPage() {
  interface User {
    fullName: string
    email: string
    role: string
    department?: string
  }

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = authHelpers.getUser()
    setUser(userData)
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn đến với Hệ thống Quản lý Hợp tác Quốc tế!
        </p>
        {user && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-blue-900">Thông tin người dùng</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p><strong>Họ tên:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Vai trò:</strong> {user.role}</p>
              {user.department && <p><strong>Phòng ban:</strong> {user.department}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📄</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">MOU</h3>
              <p className="text-sm text-gray-500">Biên bản ghi nhớ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📋</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Visa</h3>
              <p className="text-sm text-gray-500">Hồ sơ gia hạn visa</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Visitor</h3>
              <p className="text-sm text-gray-500">Đoàn khách quốc tế</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📝</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Translation</h3>
              <p className="text-sm text-gray-500">Xác nhận bản dịch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
