'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Languages, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Calendar,
  User,
  Globe,
  Download,
  Upload
} from 'lucide-react';

interface TranslationRequest {
  id: string;
  requesterName: string;
  email: string;
  department: string;
  documentType: string;
  sourceLanguage: string;
  targetLanguage: string;
  purpose: string;
  submissionDate: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  originalDocument: string;
  translatedDocument?: string;
  estimatedDays: number;
  actualDays?: number;
}

// Mock data cho demo
const mockTranslationRequests: TranslationRequest[] = [
  {
    id: '1',
    requesterName: 'TS. Nguyễn Văn An',
    email: 'nvan.an@dut.udn.vn',
    department: 'Khoa Công nghệ Thông tin',
    documentType: 'Hợp tác nghiên cứu',
    sourceLanguage: 'Tiếng Việt',
    targetLanguage: 'English',
    purpose: 'Ký kết MOU với đại học Mỹ',
    submissionDate: '2025-08-25',
    deadline: '2025-09-05',
    status: 'completed',
    priority: 'high',
    originalDocument: 'mou_vietnam_university.docx',
    translatedDocument: 'mou_vietnam_university_en.docx',
    estimatedDays: 7,
    actualDays: 6
  },
  {
    id: '2',
    requesterName: 'ThS. Trần Thị Bình',
    email: 'tt.binh@dut.udn.vn',
    department: 'Phòng HTQT',
    documentType: 'Thư mời tham dự hội thảo',
    sourceLanguage: 'English',
    targetLanguage: 'Tiếng Việt',
    purpose: 'Gửi thư mời chuyên gia nước ngoài',
    submissionDate: '2025-08-28',
    deadline: '2025-09-10',
    status: 'in_progress',
    priority: 'medium',
    originalDocument: 'invitation_letter_conference.pdf',
    estimatedDays: 5,
  },
  {
    id: '3',
    requesterName: 'PGS. Lê Minh Cường',
    email: 'lm.cuong@dut.udn.vn',
    department: 'Khoa Cơ khí',
    documentType: 'Báo cáo nghiên cứu',
    sourceLanguage: 'Tiếng Việt',
    targetLanguage: 'English',
    purpose: 'Nộp bài cho tạp chí quốc tế',
    submissionDate: '2025-08-30',
    deadline: '2025-09-15',
    status: 'pending',
    priority: 'urgent',
    originalDocument: 'research_report_mechanical.docx',
    estimatedDays: 10,
  },
  {
    id: '4',
    requesterName: 'TS. Phạm Văn Dũng',
    email: 'pv.dung@dut.udn.vn',
    department: 'Khoa Điện - Điện tử',
    documentType: 'Đề cương dự án',
    sourceLanguage: 'English',
    targetLanguage: 'Tiếng Việt',
    purpose: 'Trình bày dự án hợp tác với đối tác Hàn Quốc',
    submissionDate: '2025-08-20',
    deadline: '2025-08-30',
    status: 'cancelled',
    priority: 'low',
    originalDocument: 'project_proposal_korea.pdf',
    estimatedDays: 8,
  },
  {
    id: '5',
    requesterName: 'ThS. Hoàng Thị Linh',
    email: 'ht.linh@dut.udn.vn',
    department: 'Phòng Đào tạo',
    documentType: 'Chương trình học',
    sourceLanguage: 'Tiếng Việt',
    targetLanguage: 'English',
    purpose: 'Trao đổi chương trình với trường đối tác',
    submissionDate: '2025-08-29',
    deadline: '2025-09-12',
    status: 'in_progress',
    priority: 'medium',
    originalDocument: 'curriculum_program.docx',
    estimatedDays: 6,
  }
];

export default function TranslationRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TranslationRequest[]>(mockTranslationRequests);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<TranslationRequest | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Chờ xử lý
        </Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Languages className="h-3 w-3 mr-1" />
          Đang dịch
        </Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Hoàn thành
        </Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Đã hủy
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Khẩn cấp</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Thấp</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(req => req.status === 'pending').length,
    in_progress: requests.filter(req => req.status === 'in_progress').length,
    completed: requests.filter(req => req.status === 'completed').length,
    cancelled: requests.filter(req => req.status === 'cancelled').length,
  };

  const isOverdue = (deadline: string, status: string) => {
    if (status === 'completed' || status === 'cancelled') return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <Languages className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Quản lý yêu cầu dịch thuật</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Hệ thống quản lý hợp tác quốc tế - Trường ĐH Bách Khoa Đà Nẵng
              </p>
            </div>
          </div>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Tạo yêu cầu dịch thuật
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-blue-700">Tổng yêu cầu</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-yellow-700">Chờ xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.in_progress}</div>
              <div className="text-sm text-blue-700">Đang dịch</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
              <div className="text-sm text-green-700">Hoàn thành</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
              <div className="text-sm text-red-700">Đã hủy</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, phòng ban, loại tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_progress">Đang dịch</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Languages className="h-5 w-5" />
            Danh sách yêu cầu dịch thuật ({filteredRequests.length})
          </CardTitle>
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
                    <TableHead>Người yêu cầu</TableHead>
                    <TableHead>Tài liệu</TableHead>
                    <TableHead>Ngôn ngữ</TableHead>
                    <TableHead>Thời hạn</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className={isOverdue(request.deadline, request.status) ? 'bg-red-50' : ''}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            {request.requesterName}
                          </div>
                          <div className="text-sm text-muted-foreground">{request.email}</div>
                          <div className="text-sm text-muted-foreground">{request.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.documentType}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {request.originalDocument}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{request.sourceLanguage}</div>
                          <div className="text-center">↓</div>
                          <div>{request.targetLanguage}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.deadline).toLocaleDateString('vi-VN')}
                          </div>
                          {isOverdue(request.deadline, request.status) && (
                            <div className="text-red-600 text-xs mt-1">Quá hạn</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                            className="hover:bg-blue-50 hover:border-blue-200"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-50 hover:border-green-200"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {request.translatedDocument && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-green-50 hover:border-green-200"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-800">
                <Languages className="h-5 w-5" />
                Chi tiết yêu cầu dịch thuật - {selectedRequest.documentType}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Người yêu cầu</label>
                  <p className="text-sm">{selectedRequest.requesterName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phòng ban</label>
                  <p className="text-sm">{selectedRequest.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Loại tài liệu</label>
                  <p className="text-sm">{selectedRequest.documentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Từ ngôn ngữ</label>
                  <p className="text-sm">{selectedRequest.sourceLanguage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sang ngôn ngữ</label>
                  <p className="text-sm">{selectedRequest.targetLanguage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ngày nộp</label>
                  <p className="text-sm">{new Date(selectedRequest.submissionDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Thời hạn</label>
                  <p className="text-sm">{new Date(selectedRequest.deadline).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mức độ ưu tiên</label>
                  <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Mục đích sử dụng</label>
                <p className="text-sm mt-1">{selectedRequest.purpose}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tài liệu gốc</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      <FileText className="h-3 w-3 mr-1" />
                      {selectedRequest.originalDocument}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {selectedRequest.translatedDocument && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tài liệu đã dịch</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-green-200 text-green-600">
                        <FileText className="h-3 w-3 mr-1" />
                        {selectedRequest.translatedDocument}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Thời gian dự kiến</label>
                  <p className="text-sm">{selectedRequest.estimatedDays} ngày</p>
                </div>
                {selectedRequest.actualDays && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Thời gian thực tế</label>
                    <p className="text-sm">{selectedRequest.actualDays} ngày</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Đóng
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Cập nhật trạng thái
                </Button>
                {selectedRequest.status === 'in_progress' && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Tải lên bản dịch
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
