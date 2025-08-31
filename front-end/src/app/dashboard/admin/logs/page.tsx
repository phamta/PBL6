'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Download,
  User,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { buildApiUrl, API_ENDPOINTS, downloadFile, APP_CONFIG } from '@/lib/api';

interface SystemLog {
  id: string;
  action: string;
  level: 'info' | 'warning' | 'error' | 'success';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    fullName: string;
  };
}

interface LogsResponse {
  logs: SystemLog[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = buildApiUrl(API_ENDPOINTS.admin.systemLogs, {
        page: currentPage,
        limit: 20
      });
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: LogsResponse = await response.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      } else {
        toast.error('Không thể tải nhật ký hệ thống');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getActionDisplayName = (action: string) => {
    const actions: Record<string, string> = {
      'login': 'Đăng nhập',
      'logout': 'Đăng xuất',
      'create_user': 'Tạo người dùng',
      'update_user': 'Cập nhật người dùng',
      'delete_user': 'Xóa người dùng',
      'assign_role': 'Phân quyền',
      'revoke_role': 'Thu hồi quyền',
      'create_visa': 'Tạo đơn visa',
      'update_visa': 'Cập nhật visa',
      'approve_visa': 'Phê duyệt visa',
      'reject_visa': 'Từ chối visa',
      'system_config': 'Cấu hình hệ thống',
    };
    return actions[action] || action;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user?.username && log.user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const exportLogs = async () => {
    try {
      const filename = `system-logs-${new Date().getTime()}.csv`;
      const exportEndpoint = `${API_ENDPOINTS.admin.systemLogs}?export=true`;
      await downloadFile(exportEndpoint, filename);
      toast.success('Xuất báo cáo thành công');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Nhật ký hệ thống</h1>
              <p className="text-muted-foreground">
                Theo dõi và giám sát hoạt động - {APP_CONFIG.universityName}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={exportLogs} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mô tả, hành động, người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="info">Thông tin</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="warning">Cảnh báo</SelectItem>
                <SelectItem value="error">Lỗi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng số log</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lỗi</p>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter(log => log.level === 'error').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cảnh báo</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {logs.filter(log => log.level === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thành công</p>
                <p className="text-2xl font-bold text-green-600">
                  {logs.filter(log => log.level === 'success').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký hoạt động ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {logs.length === 0 ? 'Chưa có nhật ký nào' : 'Không tìm thấy nhật ký phù hợp'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-2" />
                            {formatDate(log.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLogIcon(log.level)}
                            <Badge 
                              variant="secondary" 
                              className={getLogBadgeColor(log.level)}
                            >
                              {log.level}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getActionDisplayName(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.user ? (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-2" />
                              <div>
                                <div className="text-sm font-medium">{log.user.fullName}</div>
                                <div className="text-xs text-muted-foreground">@{log.user.username}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Hệ thống</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="text-sm truncate">{log.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {log.ipAddress || 'N/A'}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
