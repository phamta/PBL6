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
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Calendar,
  User,
  Globe,
  Plane
} from 'lucide-react';

interface VisaApplication {
  id: string;
  applicantName: string;
  email: string;
  passportNumber: string;
  nationality: string;
  visaType: string;
  purpose: string;
  submissionDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  processingDays: number;
  documents: string[];
}

// Mock data cho demo
const mockVisaApplications: VisaApplication[] = [
  {
    id: '1',
    applicantName: 'John Smith',
    email: 'john.smith@university.edu',
    passportNumber: 'US123456789',
    nationality: 'United States',
    visaType: 'Academic Exchange',
    purpose: 'Research collaboration with HTQT Department',
    submissionDate: '2025-08-25',
    status: 'approved',
    processingDays: 7,
    documents: ['passport.pdf', 'invitation_letter.pdf', 'research_proposal.pdf']
  },
  {
    id: '2',
    applicantName: 'Maria Garcia',
    email: 'maria.garcia@tech.es',
    passportNumber: 'ES987654321',
    nationality: 'Spain',
    visaType: 'Business Visa',
    purpose: 'Technology transfer and partnership discussion',
    submissionDate: '2025-08-28',
    status: 'reviewing',
    processingDays: 4,
    documents: ['passport.pdf', 'business_letter.pdf', 'company_profile.pdf']
  },
  {
    id: '3',
    applicantName: 'Li Wei',
    email: 'li.wei@beijing.edu.cn',
    passportNumber: 'CN456789123',
    nationality: 'China',
    visaType: 'Student Exchange',
    purpose: 'Semester exchange program in Engineering',
    submissionDate: '2025-08-30',
    status: 'pending',
    processingDays: 2,
    documents: ['passport.pdf', 'student_record.pdf', 'exchange_agreement.pdf']
  },
  {
    id: '4',
    applicantName: 'Sarah Johnson',
    email: 'sarah.j@research.uk',
    passportNumber: 'UK789123456',
    nationality: 'United Kingdom',
    visaType: 'Research Visa',
    purpose: 'Joint research project on AI and Machine Learning',
    submissionDate: '2025-08-20',
    status: 'rejected',
    processingDays: 12,
    documents: ['passport.pdf', 'research_proposal.pdf', 'cv.pdf']
  },
  {
    id: '5',
    applicantName: 'Hans Mueller',
    email: 'hans.mueller@uni.de',
    passportNumber: 'DE321654987',
    nationality: 'Germany',
    visaType: 'Academic Exchange',
    purpose: 'Guest lecturer for International Business course',
    submissionDate: '2025-08-29',
    status: 'reviewing',
    processingDays: 3,
    documents: ['passport.pdf', 'academic_cv.pdf', 'lecture_plan.pdf']
  }
];

export default function VisaApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<VisaApplication[]>(mockVisaApplications);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Chờ xử lý
        </Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <FileText className="h-3 w-3 mr-1" />
          Đang xem xét
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã duyệt
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Từ chối
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Quản lý hồ sơ VISA</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Hệ thống quản lý hợp tác quốc tế - Trường ĐH Bách Khoa Đà Nẵng
              </p>
            </div>
          </div>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Thêm hồ sơ VISA
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-blue-700">Tổng hồ sơ</div>
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
              <div className="text-2xl font-bold text-blue-600">{statusCounts.reviewing}</div>
              <div className="text-sm text-blue-700">Đang xem xét</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
              <div className="text-sm text-green-700">Đã duyệt</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-red-700">Từ chối</div>
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
                placeholder="Tìm kiếm theo tên, email, quốc tịch..."
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
                <SelectItem value="reviewing">Đang xem xét</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Danh sách hồ sơ VISA ({filteredApplications.length})
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
                    <TableHead>Người nộp đơn</TableHead>
                    <TableHead>Thông tin VISA</TableHead>
                    <TableHead>Mục đích</TableHead>
                    <TableHead>Ngày nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian xử lý</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            {application.applicantName}
                          </div>
                          <div className="text-sm text-muted-foreground">{application.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {application.passportNumber} • {application.nationality}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.visaType}</div>
                          <div className="text-sm text-muted-foreground">
                            {application.documents.length} tài liệu
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={application.purpose}>
                          {application.purpose}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-2" />
                          {new Date(application.submissionDate).toLocaleDateString('vi-VN')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {application.processingDays} ngày
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
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

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="h-5 w-5" />
                Chi tiết hồ sơ VISA - {selectedApplication.applicantName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Họ tên</label>
                  <p className="text-sm">{selectedApplication.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Số hộ chiếu</label>
                  <p className="text-sm">{selectedApplication.passportNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Quốc tịch</label>
                  <p className="text-sm">{selectedApplication.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Loại VISA</label>
                  <p className="text-sm">{selectedApplication.visaType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Mục đích</label>
                <p className="text-sm mt-1">{selectedApplication.purpose}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Tài liệu đính kèm</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                      <FileText className="h-3 w-3 mr-1" />
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Đóng
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Cập nhật trạng thái
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
