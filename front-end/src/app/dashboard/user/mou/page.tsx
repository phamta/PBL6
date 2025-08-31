'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Download, Filter, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Mou {
  id: string;
  title: string;
  partnerOrganization: string;
  partnerCountry: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
  signedDate?: string;
  expiryDate?: string;
  creator?: {
    fullName: string;
  };
}

const statusColors = {
  'proposing': 'bg-yellow-100 text-yellow-800',
  'reviewing': 'bg-blue-100 text-blue-800',
  'pending_supplement': 'bg-orange-100 text-orange-800',
  'approved': 'bg-green-100 text-green-800',
  'signed': 'bg-emerald-100 text-emerald-800',
  'rejected': 'bg-red-100 text-red-800',
  'expired': 'bg-gray-100 text-gray-800',
  'terminated': 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  'proposing': 'Đang đề xuất',
  'reviewing': 'Đang duyệt',
  'pending_supplement': 'Yêu cầu bổ sung',
  'approved': 'Đã duyệt',
  'signed': 'Đã ký',
  'rejected': 'Từ chối',
  'expired': 'Hết hạn',
  'terminated': 'Chấm dứt',
};

const typeLabels = {
  'academic_cooperation': 'Hợp tác học thuật',
  'research_collaboration': 'Hợp tác nghiên cứu',
  'student_exchange': 'Trao đổi sinh viên',
  'faculty_exchange': 'Trao đổi giảng viên',
  'training_cooperation': 'Hợp tác đào tạo',
  'other': 'Khác',
};

export default function MouListPage() {
  const [mous, setMous] = useState<Mou[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    partnerCountry: '',
    type: '',
    year: '',
  });

  // Helper function để đảm bảo mous luôn là array
  const safeMous = Array.isArray(mous) ? mous : [];

  useEffect(() => {
    fetchMous();
  }, [filters]);

  const fetchMous = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token đăng nhập');
        setMous([]);
        return;
      }

      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:3001/api/v1/mou?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('MOU API Response:', result); // Debug log
        
        // Đảm bảo setMous nhận được một array
        if (Array.isArray(result)) {
          setMous(result);
        } else if (result && Array.isArray(result.data)) {
          setMous(result.data);
        } else {
          console.error('Unexpected response format:', result);
          setMous([]);
          toast.error('Định dạng dữ liệu không đúng');
        }
      } else {
        console.error('API Error:', response.status, response.statusText);
        toast.error('Không thể tải danh sách MOU');
        setMous([]);
      }
    } catch (error) {
      console.error('Error fetching MOUs:', error);
      toast.error('Lỗi kết nối server');
      setMous([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa MOU này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/mou/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Xóa MOU thành công');
        fetchMous();
      } else {
        toast.error('Không thể xóa MOU');
      }
    } catch (error) {
      console.error('Error deleting MOU:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  const exportExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:3001/api/v1/reports/mou/excel?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `mou-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Xuất Excel thành công');
      } else {
        toast.error('Không thể xuất Excel');
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý MOU</h1>
          <p className="text-muted-foreground">
            Quản lý thỏa thuận hợp tác quốc tế
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Link href="/dashboard/user/mou/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo MOU mới
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Loại hợp tác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Quốc gia"
              value={filters.partnerCountry}
              onChange={(e) => setFilters(prev => ({ ...prev, partnerCountry: e.target.value }))}
            />

            <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Danh sách MOU</CardTitle>
          <CardDescription>
            Tổng cộng: {safeMous.length} MOU
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Đối tác</TableHead>
                  <TableHead>Quốc gia</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : safeMous.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  safeMous.map((mou) => (
                    <TableRow key={mou.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{mou.title}</div>
                          {mou.creator && (
                            <div className="text-sm text-muted-foreground">
                              Tạo bởi: {mou.creator.fullName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{mou.partnerOrganization}</TableCell>
                      <TableCell>{mou.partnerCountry}</TableCell>
                      <TableCell>{typeLabels[mou.type as keyof typeof typeLabels] || mou.type}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[mou.status as keyof typeof statusColors]}>
                          {statusLabels[mou.status as keyof typeof statusLabels] || mou.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(mou.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/user/mou/${mou.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/user/mou/${mou.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(mou.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
