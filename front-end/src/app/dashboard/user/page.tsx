'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  BookOpen, 
  UserCheck, 
  Plus,
  FileSignature,
  MessageSquare,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  myApplications?: number;
  pendingReview?: number;
  totalMOUs?: number;
  activeTranslations?: number;
}

export default function UserDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real app, this would be API calls
      setTimeout(() => {
        const mockStats: DashboardStats = {
          myApplications: 3,
          pendingReview: 8,
          totalMOUs: 15,
          activeTranslations: 6,
        };
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Đơn vị</h1>
        <p className="text-muted-foreground">
          Xin chào. Chào mừng bạn đến với hệ thống HTQT.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đơn của đơn vị</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myApplications || 0}</div>
              <p className="text-xs text-muted-foreground">Đang xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biên bản MOU</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMOUs || 0}</div>
              <p className="text-xs text-muted-foreground">Hoạt động</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dịch thuật</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTranslations || 0}</div>
              <p className="text-xs text-muted-foreground">Đang thực hiện</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tạo mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/user/visa/create">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo đơn xin Visa
                </Button>
              </Link>
              <Link href="/dashboard/user/mou/create">
                <Button variant="outline" className="w-full justify-start">
                  <FileSignature className="mr-2 h-4 w-4" />
                  Tạo Biên bản ghi nhớ
                </Button>
              </Link>
              <Link href="/dashboard/user/translation/create">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Yêu cầu dịch thuật
                </Button>
              </Link>
              <Link href="/dashboard/user/visitor/create">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Đăng ký khách thăm
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Đơn Visa #2024-001</span>
                  <Badge variant="secondary">Đang xử lý</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">MOU với ĐH ABC</span>
                  <Badge variant="default">Đã ký</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dịch thuật tài liệu</span>
                  <Badge variant="outline">Hoàn thành</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
