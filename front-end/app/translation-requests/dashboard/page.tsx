'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { translationRequestAPI } from '@/lib/api/translation-request';
import { TranslationRequestStatistics } from '@/lib/types/translation-request';
import Link from 'next/link';

export default function TranslationDashboardPage() {
  const [statistics, setStatistics] = useState<TranslationRequestStatistics>({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    needsRevision: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, this would come from authentication context
  const userRole = 'KHCN_DN'; // or 'USER'

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await translationRequestAPI.getStatistics();
      setStatistics(response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Không thể tải thông tin thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const statisticsCards = [
    {
      title: 'Tổng số yêu cầu',
      value: statistics.total,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '📊',
    },
    {
      title: 'Chờ xử lý',
      value: statistics.pending,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '⏳',
    },
    {
      title: 'Đang xem xét',
      value: statistics.underReview,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '👀',
    },
    {
      title: 'Đã duyệt',
      value: statistics.approved,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '✅',
    },
    {
      title: 'Từ chối',
      value: statistics.rejected,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '❌',
    },
    {
      title: 'Cần chỉnh sửa',
      value: statistics.needsRevision,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '✏️',
    },
  ];

  const quickActions = [
    {
      title: 'Tạo yêu cầu mới',
      description: 'Tạo yêu cầu xác nhận bản dịch mới',
      href: '/translation-requests',
      icon: '➕',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Xem tất cả yêu cầu',
      description: 'Xem danh sách tất cả yêu cầu',
      href: '/translation-requests',
      icon: '📋',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Tạo báo cáo',
      description: 'Tạo báo cáo thống kê và xuất dữ liệu',
      href: '/translation-requests/reports',
      icon: '📈',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Xác Nhận Bản Dịch</h1>
        <p className="text-gray-600 mt-2">
          Tổng quan về hệ thống quản lý yêu cầu xác nhận bản dịch
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Card className="col-span-full">
            <CardContent className="p-6">
              <div className="text-center text-red-600">{error}</div>
            </CardContent>
          </Card>
        ) : (
          statisticsCards.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-l-4 border-l-gray-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color} text-white text-xl`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity or Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vai trò hiện tại:</span>
                <span className="font-medium">
                  {userRole === 'KHCN_DN' ? 'Quản trị viên KHCN&ĐN' : 'Người dùng'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngày cập nhật:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái hệ thống:</span>
                <span className="font-medium text-green-600">Hoạt động</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle>Hỗ trợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Hướng dẫn sử dụng:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tạo yêu cầu xác nhận bản dịch mới</li>
                  <li>• Theo dõi trạng thái yêu cầu</li>
                  <li>• Tải xuống tài liệu và giấy xác nhận</li>
                  <li>• Tạo báo cáo thống kê</li>
                </ul>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Xem hướng dẫn chi tiết
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
