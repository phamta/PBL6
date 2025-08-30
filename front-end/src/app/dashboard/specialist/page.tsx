'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  FileText, 
  BookOpen, 
  MessageSquare,
  UserCheck,
  BarChart3,
  AlertTriangle,
  Calendar,
  Eye,
  Edit
} from 'lucide-react';
import Link from 'next/link';

export default function SpecialistDashboard() {
  const { isSpecialist } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isSpecialist) {
      router.push('/dashboard');
    }
  }, [isSpecialist, router]);

  if (!isSpecialist) {
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Chuyên viên</h1>
        <p className="text-muted-foreground">
          Chuyên viên HTQT/KHCN&ĐN - Xét duyệt và xử lý các yêu cầu
        </p>
      </div>

      {/* Specialist Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xét duyệt</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xử lý</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">28</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch thuật</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">6</div>
            <p className="text-xs text-muted-foreground">Đang thực hiện</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu suất</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Priority Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Công việc ưu tiên
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/specialist/visa-review">
              <Button variant="outline" className="w-full justify-start border-red-200 hover:bg-red-50">
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Xét duyệt Visa (8)
                <Badge variant="destructive" className="ml-auto">Urgent</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/specialist/mou-review">
              <Button variant="outline" className="w-full justify-start border-orange-200 hover:bg-orange-50">
                <BookOpen className="mr-2 h-4 w-4 text-orange-600" />
                Xét duyệt MOU (3)
                <Badge variant="secondary" className="ml-auto">High</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/specialist/translation">
              <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50">
                <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />
                Chứng thực dịch thuật (6)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Đơn mới nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div>
                <p className="font-medium text-sm">Visa #2024-V089</p>
                <p className="text-xs text-muted-foreground">Nguyễn Văn A - Gia hạn</p>
                <p className="text-xs text-red-600">Quá hạn 2 ngày</p>
              </div>
              <div className="flex space-x-1">
                <Link href="/dashboard/visa/2024-V089">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/dashboard/visa/2024-V089/review">
                  <Button size="sm" variant="default">
                    <Edit className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <div>
                <p className="font-medium text-sm">MOU #2024-M015</p>
                <p className="text-xs text-muted-foreground">ĐH ABC - Hợp tác nghiên cứu</p>
                <p className="text-xs text-yellow-600">Còn 1 ngày</p>
              </div>
              <div className="flex space-x-1">
                <Link href="/dashboard/mou/2024-M015">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/dashboard/mou/2024-M015/review">
                  <Button size="sm" variant="default">
                    <Edit className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div>
                <p className="font-medium text-sm">Translation #2024-T023</p>
                <p className="text-xs text-muted-foreground">Bằng cấp - Tiếng Anh</p>
                <p className="text-xs text-blue-600">Mới gửi</p>
              </div>
              <div className="flex space-x-1">
                <Link href="/dashboard/translation/2024-T023">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/dashboard/translation/2024-T023/review">
                  <Button size="sm" variant="default">
                    <Edit className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics & Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Thống kê hiệu suất
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Thời gian xử lý TB</span>
                <span className="font-medium">2.5 ngày</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mục tiêu: 3 ngày</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tỷ lệ phê duyệt</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '89%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Số đơn xử lý</span>
                <span className="font-medium">156 đơn</span>
              </div>
              <p className="text-xs text-muted-foreground">Từ đầu năm</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/specialist/pending">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Tất cả đơn chờ xử lý
              </Button>
            </Link>
            <Link href="/dashboard/specialist/templates">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Mẫu văn bản
              </Button>
            </Link>
            <Link href="/dashboard/specialist/calendar">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Lịch làm việc
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Báo cáo & Xuất dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/specialist/reports">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Báo cáo công việc
              </Button>
            </Link>
            <Link href="/dashboard/specialist/export">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Xuất danh sách
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Báo cáo hàng tuần</p>
              <p className="text-xs">Cập nhật: Thứ 2 hàng tuần</p>
              <p className="text-xs">Gửi đến: Lãnh đạo phòng</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Thông báo hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <p className="font-medium text-sm text-red-800">Đơn quá hạn xử lý</p>
              <p className="text-xs text-red-700">5 đơn Visa đã quá thời hạn quy định (3 ngày)</p>
              <p className="text-xs text-muted-foreground mt-1">30 phút trước</p>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="font-medium text-sm text-yellow-800">Cuộc họp sắp tới</p>
              <p className="text-xs text-yellow-700">Họp Phòng HTQT - 14:00 hôm nay</p>
              <p className="text-xs text-muted-foreground mt-1">2 giờ trước</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="font-medium text-sm text-blue-800">Cập nhật hệ thống</p>
              <p className="text-xs text-blue-700">Tính năng mới: Xem trước tài liệu PDF</p>
              <p className="text-xs text-muted-foreground mt-1">1 ngày trước</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
