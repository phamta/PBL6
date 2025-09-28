'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, Filter, Download, Eye } from 'lucide-react';


interface SystemActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  hoatDong: string;
  thoiGian: string;
  diaChi: string;
  trangThai: 'success' | 'warning' | 'error';
  chiTiet: string;
}

const mockLogs: SystemActivityLog[] = [
  {
    id: '1',
    userId: 'user001',
    userName: 'Nguyễn Văn A',
    userRole: 'Admin',
    hoatDong: 'Đăng nhập hệ thống',
    thoiGian: '2024-01-15 08:30:45',
    diaChi: '192.168.1.100',
    trangThai: 'success',
    chiTiet: 'Đăng nhập thành công từ máy tính văn phòng'
  },
  {
    id: '2',
    userId: 'user002',
    userName: 'Trần Thị B',
    userRole: 'Manager',
    hoatDong: 'Tạo yêu cầu MOU',
    thoiGian: '2024-01-15 09:15:20',
    diaChi: '192.168.1.105',
    trangThai: 'success',
    chiTiet: 'Tạo yêu cầu MOU với đối tác Pipe Inc.'
  },
  {
    id: '3',
    userId: 'user003',
    userName: 'Lê Văn C',
    userRole: 'Specialist',
    hoatDong: 'Cập nhật trạng thái visa',
    thoiGian: '2024-01-15 10:45:30',
    diaChi: '192.168.1.110',
    trangThai: 'warning',
    chiTiet: 'Cập nhật trạng thái visa - Cần xem xét thêm'
  },
  {
    id: '4',
    userId: 'user004',
    userName: 'Phạm Thị D',
    userRole: 'Viewer',
    hoatDong: 'Truy cập báo cáo',
    thoiGian: '2024-01-15 11:20:15',
    diaChi: '192.168.1.115',
    trangThai: 'success',
    chiTiet: 'Xem báo cáo khách quốc tế'
  },
  {
    id: '5',
    userId: 'user005',
    userName: 'Hoàng Văn E',
    userRole: 'Admin',
    hoatDong: 'Xóa tài khoản người dùng',
    thoiGian: '2024-01-15 14:30:00',
    diaChi: '192.168.1.120',
    trangThai: 'error',
    chiTiet: 'Không thể xóa tài khoản - Tài khoản đang được sử dụng'
  },
];

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemActivityLog[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<SystemActivityLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date} | undefined>();

  // Filter logs based on search criteria
  useEffect(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.hoatDong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.chiTiet.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(log => log.userRole === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(log => log.trangThai === selectedStatus);
    }

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.thoiGian);
        return logDate >= dateRange.from! && logDate <= dateRange.to!;
      });
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedRole, selectedStatus, dateRange]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Thành công</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Specialist': 'bg-green-100 text-green-800',
      'Viewer': 'bg-gray-100 text-gray-800',
    };
    return <Badge className={colors[role] || 'bg-gray-100 text-gray-800'}>{role}</Badge>;
  };

  const handleExport = () => {
    // Convert to CSV and download
    const csvContent = [
      ['Người dùng', 'Vai trò', 'Hoạt động', 'Thời gian', 'Địa chỉ IP', 'Trạng thái', 'Chi tiết'],
      ...filteredLogs.map(log => [
        log.userName,
        log.userRole,
        log.hoatDong,
        log.thoiGian,
        log.diaChi,
        log.trangThai,
        log.chiTiet
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `system-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nhật ký hoạt động hệ thống</h1>
          <p className="text-gray-600">Theo dõi và quản lý các hoạt động của người dùng</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm người dùng, hoạt động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <Label>Vai trò</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Specialist">Specialist</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label>Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                  <SelectItem value="error">Lỗi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Label>Khoảng thời gian</Label>
              <Input
                type="date"
                placeholder="Từ ngày..."
                onChange={(e) => {
                  const fromDate = e.target.value ? new Date(e.target.value) : undefined;
                  setDateRange(prev => ({ ...prev, from: fromDate }));
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredLogs.length} trong tổng số {logs.length} hoạt động
        </p>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Hoạt động</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa chỉ IP</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead className="w-20">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.userName}</div>
                      <div className="text-sm text-gray-500">ID: {log.userId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(log.userRole)}</TableCell>
                  <TableCell className="font-medium">{log.hoatDong}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(log.thoiGian).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.thoiGian).toLocaleTimeString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.diaChi}</TableCell>
                  <TableCell>{getStatusBadge(log.trangThai)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={log.chiTiet}>{log.chiTiet}</div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}