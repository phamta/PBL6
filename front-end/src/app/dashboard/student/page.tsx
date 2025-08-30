'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  BookOpen, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { isStudent } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isStudent) {
      router.push('/dashboard');
    }
  }, [isStudent, router]);

  if (!isStudent) {
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Sinh viên</h1>
        <p className="text-muted-foreground">
          Chào mừng sinh viên/học viên quốc tế - Trường ĐHSPKT Hưng Yên
        </p>
      </div>

      {/* Student Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn của tôi</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa hiện tại</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Còn hiệu lực</div>
            <p className="text-xs text-muted-foreground">Đến 15/12/2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thông báo</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Thông báo mới</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Dịch vụ nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/visa/create">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Gia hạn Visa
              </Button>
            </Link>
            <Link href="/dashboard/student/appointments">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Đặt lịch hẹn
              </Button>
            </Link>
            <Link href="/dashboard/student/guide">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Hướng dẫn thủ tục
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Tình trạng đơn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Đơn gia hạn #2024-SV001</p>
                <p className="text-xs text-muted-foreground">Nộp ngày: 20/08/2024</p>
              </div>
              <Badge variant="secondary">Đang xét duyệt</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Nộp hồ sơ bổ sung</p>
                <p className="text-xs text-muted-foreground">Hạn: 05/09/2024</p>
              </div>
              <Badge variant="destructive">Cần xử lý</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Đơn gia hạn #2024-SV002</p>
                <p className="text-xs text-muted-foreground">Hoàn thành: 15/08/2024</p>
              </div>
              <Badge variant="default" className="bg-green-600">Đã duyệt</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Thông báo quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="font-medium text-sm text-yellow-800">Nhắc nhở gia hạn Visa</p>
              <p className="text-xs text-yellow-700">Visa sẽ hết hạn trong 90 ngày. Vui lòng chuẩn bị hồ sơ gia hạn.</p>
              <p className="text-xs text-muted-foreground mt-1">2 ngày trước</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="font-medium text-sm text-blue-800">Lịch hẹn sắp tới</p>
              <p className="text-xs text-blue-700">Cuộc hẹn tại Phòng HTQT vào 9:00 AM, ngày 02/09/2024</p>
              <p className="text-xs text-muted-foreground mt-1">1 ngày trước</p>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Thông tin hữu ích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/student/visa-guide">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Hướng dẫn gia hạn Visa
              </Button>
            </Link>
            <Link href="/dashboard/student/documents">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Mẫu hồ sơ & Tài liệu
              </Button>
            </Link>
            <Link href="/dashboard/student/faq">
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" />
                Câu hỏi thường gặp
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Phòng HTQT</p>
                <p className="text-xs text-muted-foreground">0221.862.3322 - Ext: 115</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-sm">Email hỗ trợ</p>
                <p className="text-xs text-muted-foreground">htqt@utehy.edu.vn</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium text-sm">Địa chỉ</p>
                <p className="text-xs text-muted-foreground">Phòng A201, Tòa nhà A</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Tiến độ học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tín chỉ hoàn thành</span>
                <span>85/120</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '71%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Kỳ học hiện tại</span>
                <span>2024.1</span>
              </div>
              <p className="text-xs text-muted-foreground">GPA: 3.75/4.0</p>
            </div>
            
            <div>
              <p className="font-medium text-sm">Dự kiến tốt nghiệp</p>
              <p className="text-xs text-muted-foreground">Tháng 6/2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
