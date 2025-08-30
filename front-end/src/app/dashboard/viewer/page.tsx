'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Search, 
  BarChart3, 
  FileText,
  BookOpen,
  UserCheck,
  Calendar,
  Download,
  Filter,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function ViewerDashboard() {
  const { isViewer } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isViewer) {
      router.push('/dashboard');
    }
  }, [isViewer, router]);

  if (!isViewer) {
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Tra cứu</h1>
        <p className="text-muted-foreground">
          Tra cứu thông tin công khai - Hệ thống HTQT ĐHSPKT Hưng Yên
        </p>
      </div>

      {/* Public Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa đã cấp</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-xs text-muted-foreground">Năm 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOU hoạt động</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">23</div>
            <p className="text-xs text-muted-foreground">Hiện tại</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách quốc tế</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">89</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án hợp tác</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">45</div>
            <p className="text-xs text-muted-foreground">Đang thực hiện</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Search & Lookup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Tra cứu nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/viewer/visa-lookup">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Eye className="mr-2 h-4 w-4" />
                Tra cứu Visa
              </Button>
            </Link>
            <Link href="/dashboard/viewer/mou-lookup">
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                <BookOpen className="mr-2 h-4 w-4" />
                Tra cứu MOU
              </Button>
            </Link>
            <Link href="/dashboard/viewer/visitor-lookup">
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <UserCheck className="mr-2 h-4 w-4" />
                Tra cứu khách thăm
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Advanced Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Tìm kiếm nâng cao
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/viewer/advanced-search">
              <Button variant="outline" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                Tìm kiếm đa điều kiện
              </Button>
            </Link>
            <Link href="/dashboard/viewer/date-range">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Tìm theo khoảng thời gian
              </Button>
            </Link>
            <Link href="/dashboard/viewer/status-filter">
              <Button variant="outline" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                Lọc theo trạng thái
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Public Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Thống kê công khai
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/viewer/public-stats">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Xem thống kê tổng quan
              </Button>
            </Link>
            <Link href="/dashboard/viewer/annual-report">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Báo cáo thường niên
              </Button>
            </Link>
            <Link href="/dashboard/viewer/download-reports">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Tải xuống báo cáo
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Tổng quan hoạt động HTQT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">28</div>
                <p className="text-sm text-muted-foreground">Quốc gia đối tác</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">156</div>
                <p className="text-sm text-muted-foreground">Tổng số Visa</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1,245</div>
                <p className="text-sm text-muted-foreground">Khách quốc tế</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <p className="text-sm text-muted-foreground">Dự án hợp tác</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Top 5 quốc gia đối tác</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hàn Quốc</span>
                    <span className="font-medium">45 MOU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nhật Bản</span>
                    <span className="font-medium">32 MOU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Singapore</span>
                    <span className="font-medium">28 MOU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đài Loan</span>
                    <span className="font-medium">23 MOU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thái Lan</span>
                    <span className="font-medium">18 MOU</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Hoạt động theo tháng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tháng 8/2024</span>
                    <span className="font-medium">23 hoạt động</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tháng 7/2024</span>
                    <span className="font-medium">31 hoạt động</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tháng 6/2024</span>
                    <span className="font-medium">28 hoạt động</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tháng 5/2024</span>
                    <span className="font-medium">35 hoạt động</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tháng 4/2024</span>
                    <span className="font-medium">29 hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information & Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Hướng dẫn & Thông tin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/viewer/search-guide">
              <Button variant="outline" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                Hướng dẫn tra cứu
              </Button>
            </Link>
            <Link href="/dashboard/viewer/data-info">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Thông tin dữ liệu
              </Button>
            </Link>
            <Link href="/dashboard/viewer/contact">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="mr-2 h-4 w-4" />
                Liên hệ hỗ trợ
              </Button>
            </Link>
            
            <div className="text-sm text-muted-foreground mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Lưu ý quan trọng:</p>
              <p className="text-xs mt-1">• Chỉ hiển thị thông tin công khai</p>
              <p className="text-xs">• Dữ liệu cập nhật hàng ngày</p>
              <p className="text-xs">• Liên hệ HTQT để được hỗ trợ</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            Thông tin nguồn dữ liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Cập nhật lần cuối:</p>
              <p className="text-muted-foreground">31/08/2024 - 18:30</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Nguồn dữ liệu:</p>
              <p className="text-muted-foreground">Hệ thống HTQT ĐHSPKT Hưng Yên</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Liên hệ hỗ trợ:</p>
              <p className="text-muted-foreground">htqt@utehy.edu.vn</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
