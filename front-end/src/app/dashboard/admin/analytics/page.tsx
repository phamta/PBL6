'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

interface UserStats {
  roleName: string;
  count: number;
}

interface VisaStats {
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byCountry: Array<{
    country: string;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [visaStats, setVisaStats] = useState<VisaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user stats
      const userResponse = await fetch('http://localhost:3001/admin/dashboard/user-stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      // Fetch visa stats
      const visaResponse = await fetch('http://localhost:3001/admin/dashboard/visa-stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserStats(userData);
      }

      if (visaResponse.ok) {
        const visaData = await visaResponse.json();
        setVisaStats(visaData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    const statusNames: Record<string, string> = {
      'approved': 'Đã duyệt',
      'pending': 'Chờ duyệt',
      'rejected': 'Từ chối',
      'processing': 'Đang xử lý',
    };
    return statusNames[status] || status;
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'admin': 'Quản trị viên',
      'manager': 'Quản lý',
      'specialist': 'Chuyên viên',
      'user': 'Người dùng',
      'student': 'Sinh viên',
      'viewer': 'Người xem',
    };
    return roleNames[role] || role;
  };

  const exportReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3001/admin/reports/export?range=${timeRange}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Thống kê và báo cáo tổng quan về hoạt động hệ thống
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">3 tháng qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
                    <p className="text-2xl font-bold">
                      {userStats.reduce((sum, stat) => sum + stat.count, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Đơn Visa</p>
                    <p className="text-2xl font-bold">
                      {visaStats?.byStatus.reduce((sum, stat) => sum + stat.count, 0) || 0}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tỷ lệ phê duyệt</p>
                    <p className="text-2xl font-bold text-green-600">
                      {visaStats?.byStatus.length ? 
                        Math.round((visaStats.byStatus.find(s => s.status === 'approved')?.count || 0) / 
                        visaStats.byStatus.reduce((sum, stat) => sum + stat.count, 0) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quốc gia</p>
                    <p className="text-2xl font-bold">
                      {visaStats?.byCountry.length || 0}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Statistics by Role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Thống kê người dùng theo vai trò
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">{getRoleDisplayName(stat.roleName)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{stat.count}</Badge>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(stat.count / userStats.reduce((sum, s) => sum + s.count, 0)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {userStats.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Chưa có dữ liệu thống kê
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visa Status Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Thống kê trạng thái Visa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visaStats?.byStatus.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(stat.status)}
                        >
                          {getStatusDisplayName(stat.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stat.count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(stat.count / visaStats.byStatus.reduce((sum, s) => sum + s.count, 0)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!visaStats?.byStatus.length && (
                    <p className="text-muted-foreground text-center py-4">
                      Chưa có dữ liệu visa
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top 10 quốc gia có nhiều đơn visa nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visaStats?.byCountry.slice(0, 10).map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{stat.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stat.count} đơn</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(stat.count / (visaStats.byCountry[0]?.count || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!visaStats?.byCountry.length && (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có dữ liệu về quốc gia
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Báo cáo nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo người dùng</div>
                    <div className="text-sm text-muted-foreground">Xuất chi tiết người dùng</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <BarChart3 className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo visa</div>
                    <div className="text-sm text-muted-foreground">Thống kê đơn visa</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo tháng</div>
                    <div className="text-sm text-muted-foreground">Tổng hợp theo tháng</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
