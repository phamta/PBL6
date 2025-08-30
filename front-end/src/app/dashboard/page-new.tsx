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
  BarChart3, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  FileSignature,
  MessageSquare,
  GraduationCap,
  Building,
  Calendar
} from 'lucide-react';
import { usePermissions, UserRole } from '@/hooks/usePermissions';
import Link from 'next/link';

interface DashboardStats {
  totalUsers?: number;
  totalVisaApplications?: number;
  pendingApprovals?: number;
  completedThisMonth?: number;
  myApplications?: number;
  pendingReview?: number;
  totalMOUs?: number;
  activeTranslations?: number;
}

export default function DashboardPage() {
  const { userRole, getRoleDisplayName, can } = usePermissions();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [userRole]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real app, this would be API calls
      setTimeout(() => {
        const mockStats: DashboardStats = {
          totalUsers: 150,
          totalVisaApplications: 45,
          pendingApprovals: 12,
          completedThisMonth: 28,
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

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">+10% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn Visa</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisaApplications || 0}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn trong hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biên bản ghi nhớ</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMOUs || 0}</div>
            <p className="text-xs text-muted-foreground">Hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động hệ thống</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Truy cập nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Quản lý người dùng
              </Button>
            </Link>
            <Link href="/dashboard/admin/roles">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Phân quyền hệ thống
              </Button>
            </Link>
            <Link href="/dashboard/admin/statistics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Thống kê tổng quan
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông báo hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Hệ thống đang hoạt động bình thường</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">12 đơn đang chờ xử lý</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUserDashboard = () => (
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
            {can.createVisa() && (
              <Link href="/dashboard/visa/create">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo đơn xin Visa
                </Button>
              </Link>
            )}
            {can.createMOU() && (
              <Link href="/dashboard/mou/create">
                <Button variant="outline" className="w-full justify-start">
                  <FileSignature className="mr-2 h-4 w-4" />
                  Tạo Biên bản ghi nhớ
                </Button>
              </Link>
            )}
            {can.createTranslation() && (
              <Link href="/dashboard/translation/create">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Yêu cầu dịch thuật
                </Button>
              </Link>
            )}
            {can.createVisitor() && (
              <Link href="/dashboard/visitor/create">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Đăng ký khách thăm
                </Button>
              </Link>
            )}
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
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn của tôi</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myApplications || 0}</div>
            <p className="text-xs text-muted-foreground">Đơn gia hạn Visa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch hẹn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Cuộc hẹn sắp tới</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/visa/create">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Gia hạn Visa
              </Button>
            </Link>
            <Link href="/dashboard/student/guide">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Hướng dẫn thủ tục
              </Button>
            </Link>
            <Link href="/dashboard/student/appointments">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Đặt lịch hẹn
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiến độ đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Đơn gia hạn #2024-SV001</span>
                <Badge variant="secondary">Đang xét duyệt</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Nộp hồ sơ bổ sung</span>
                <Badge variant="destructive">Cần xử lý</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSpecialistDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xét duyệt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReview || 0}</div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xử lý</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách thăm</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Tuần này</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Công việc ưu tiên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/specialist/visa-review">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Xét duyệt Visa ({stats.pendingReview || 0})
              </Button>
            </Link>
            <Link href="/dashboard/specialist/mou-review">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Xét duyệt MOU
              </Button>
            </Link>
            <Link href="/dashboard/specialist/translation">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chứng thực dịch thuật
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo & Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/specialist/reports">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Báo cáo công việc
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Hiệu suất tháng này: 92%</p>
              <p>Thời gian xử lý TB: 2.5 ngày</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ phê duyệt</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals || 0}</div>
            <p className="text-xs text-muted-foreground">Cần quyết định</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã phê duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOU cần ký</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Đang chờ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu suất</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">SLA tuân thủ</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phê duyệt ưu tiên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/manager/visa-approval">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Phê duyệt Visa ({stats.pendingApprovals || 0})
              </Button>
            </Link>
            <Link href="/dashboard/manager/mou-signing">
              <Button variant="outline" className="w-full justify-start">
                <FileSignature className="mr-2 h-4 w-4" />
                Ký MOU (3)
              </Button>
            </Link>
            <Link href="/dashboard/manager/visitor-approval">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="mr-2 h-4 w-4" />
                Phê duyệt khách thăm
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê & Báo cáo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/manager/statistics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard điều hành
              </Button>
            </Link>
            <Link href="/dashboard/manager/export">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Thời gian phê duyệt TB: 1.2 ngày</p>
              <p>Tỷ lệ phê duyệt: 87%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderViewerDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa đã cấp</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Năm 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOU hoạt động</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Hiện tại</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách quốc tế</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tra cứu thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/viewer/visa-lookup">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                Tra cứu Visa
              </Button>
            </Link>
            <Link href="/dashboard/viewer/mou-lookup">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Tra cứu MOU
              </Button>
            </Link>
            <Link href="/dashboard/viewer/visitor-lookup">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="mr-2 h-4 w-4" />
                Tra cứu khách thăm
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê công khai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/viewer/public-stats">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Xem thống kê
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Cập nhật lần cuối: Hôm nay</p>
              <p>Nguồn: Hệ thống HTQT</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return renderAdminDashboard();
      case UserRole.USER:
        return renderUserDashboard();
      case UserRole.STUDENT:
        return renderStudentDashboard();
      case UserRole.SPECIALIST:
        return renderSpecialistDashboard();
      case UserRole.MANAGER:
        return renderManagerDashboard();
      case UserRole.VIEWER:
        return renderViewerDashboard();
      default:
        return renderUserDashboard();
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Xin chào, {getRoleDisplayName(userRole)}. Chào mừng bạn đến với hệ thống HTQT.
        </p>
      </div>

      {renderDashboardContent()}
    </div>
  );
}
