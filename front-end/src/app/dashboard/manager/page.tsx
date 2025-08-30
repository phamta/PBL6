'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  FileSignature, 
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  BookOpen,
  UserCheck,
  Target,
  Award,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const { isManager } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isManager) {
      router.push('/dashboard');
    }
  }, [isManager, router]);

  if (!isManager) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Không có quyền truy cập</h2>
          <p className="text-muted-foreground mt-2">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Lãnh đạo</h1>
        <p className="text-muted-foreground">
          Trưởng Phòng HTQT - Phê duyệt và giám sát hoạt động
        </p>
      </div>

      {/* Manager Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ phê duyệt</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-muted-foreground">Cần quyết định</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã phê duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">28</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOU cần ký</CardTitle>
            <FileSignature className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-muted-foreground">Đang chờ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA tuân thủ</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <p className="text-xs text-muted-foreground">Mục tiêu: 90%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Priority Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Phê duyệt ưu tiên
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/manager/visa-approval">
              <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                <FileText className="mr-2 h-4 w-4" />
                Phê duyệt Visa (12)
                <Badge variant="secondary" className="ml-auto bg-white text-red-600">Urgent</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/manager/mou-signing">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <FileSignature className="mr-2 h-4 w-4" />
                Ký MOU (3)
                <Badge variant="secondary" className="ml-auto bg-white text-blue-600">High</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/manager/visitor-approval">
              <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
                <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                Phê duyệt khách thăm (5)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Hiệu suất phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Thời gian phê duyệt TB</span>
                <span className="font-medium text-green-600">1.2 ngày</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mục tiêu: 2 ngày</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tỷ lệ phê duyệt</span>
                <span className="font-medium text-blue-600">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Hiệu suất nhân viên</span>
                <span className="font-medium text-purple-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-500" />
              Mục quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-red-800">MOU ĐH Quốc gia Singapore</p>
                  <p className="text-xs text-red-700">Cần ký trước 05/09/2024</p>
                </div>
                <Badge variant="destructive" className="text-xs">2 ngày</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-orange-800">Báo cáo tháng 8</p>
                  <p className="text-xs text-orange-700">Gửi Hiệu trưởng</p>
                </div>
                <Badge variant="secondary" className="text-xs">5 ngày</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-blue-800">Họp Ban Giám hiệu</p>
                  <p className="text-xs text-blue-700">Thứ 5, 9:00 AM</p>
                </div>
                <Badge variant="outline" className="text-xs">3 ngày</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Thống kê phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <p className="text-xs text-muted-foreground">Đơn Visa/năm</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">23</div>
                <p className="text-xs text-muted-foreground">MOU hoạt động</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <p className="text-xs text-muted-foreground">Khách quốc tế</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <p className="text-xs text-muted-foreground">Dự án hợp tác</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Quản lý chiến lược
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/manager/strategic-plan">
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Kế hoạch chiến lược
              </Button>
            </Link>
            <Link href="/dashboard/manager/partnerships">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Quản lý đối tác
              </Button>
            </Link>
            <Link href="/dashboard/manager/budget">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ngân sách HTQT
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Reports & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Báo cáo điều hành
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/manager/executive-dashboard">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard điều hành
              </Button>
            </Link>
            <Link href="/dashboard/manager/monthly-report">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Báo cáo tháng
              </Button>
            </Link>
            <Link href="/dashboard/manager/export">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Báo cáo định kỳ</p>
              <p className="text-xs">• Tuần: Thứ 2 hàng tuần</p>
              <p className="text-xs">• Tháng: Ngày 5 hàng tháng</p>
              <p className="text-xs">• Quý: Ngày 15 đầu quý</p>
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Quản lý nhân sự
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Chuyên viên HTQT</span>
                <Badge variant="default">3 người</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chuyên viên KHCN&ĐN</span>
                <Badge variant="default">2 người</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nhân viên hành chính</span>
                <Badge variant="secondary">1 người</Badge>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <Link href="/dashboard/manager/team-performance">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Đánh giá hiệu suất
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Lịch công tác
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-sm">Họp Ban Giám hiệu</p>
                <p className="text-xs text-muted-foreground">Thứ 5, 9:00 - 11:00 AM</p>
                <p className="text-xs text-blue-600">Phòng họp A</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-sm">Ký MOU với ĐH Seoul</p>
                <p className="text-xs text-muted-foreground">Thứ 6, 14:00 PM</p>
                <p className="text-xs text-green-600">Trực tuyến</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="font-medium text-sm">Đánh giá hiệu suất Q3</p>
                <p className="text-xs text-muted-foreground">Tuần tới</p>
                <p className="text-xs text-orange-600">Deadline: 15/09</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
