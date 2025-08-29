'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, FileText, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface Mou {
  id: string;
  title: string;
  partnerOrganization: string;
  partnerCountry: string;
  partnerContact?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  proposedDate?: string;
  signedDate?: string;
  effectiveDate?: string;
  expiryDate?: string;
  objectives?: string;
  scope?: string;
  benefits?: string;
  terms?: string;
  notes?: string;
  department?: string;
  faculty?: string;
  reviewComments?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    fullName: string;
    email: string;
  };
  assignee?: {
    fullName: string;
    email: string;
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

const priorityLabels = {
  'low': 'Thấp',
  'medium': 'Trung bình',
  'high': 'Cao',
  'urgent': 'Khẩn cấp',
};

export default function MouDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mou, setMou] = useState<Mou | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<string>('');
  const [reviewComments, setReviewComments] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchMou();
    fetchUser();
  }, [params.id]);

  const fetchMou = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/mou/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const mouData = await response.json();
        setMou(mouData);
      } else {
        toast.error('Không thể tải thông tin MOU');
      }
    } catch (error) {
      console.error('Error fetching MOU:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const handleReview = async () => {
    if (!reviewAction) {
      toast.error('Vui lòng chọn hành động');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/mou/${params.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: reviewAction,
          reviewComments,
        }),
      });

      if (response.ok) {
        toast.success('Cập nhật trạng thái thành công');
        setShowReviewForm(false);
        fetchMou();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error reviewing MOU:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  const canReview = user && ['admin', 'khoa', 'phong'].includes(user.role) && 
                    mou && ['proposing', 'pending_supplement'].includes(mou.status);

  const canApprove = user && ['admin', 'khoa'].includes(user.role) && 
                     mou && mou.status === 'reviewing';

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!mou) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Không tìm thấy MOU</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{mou.title}</h1>
            <p className="text-muted-foreground">
              Chi tiết thỏa thuận hợp tác
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {canReview && (
            <Button onClick={() => setShowReviewForm(true)}>
              <Clock className="h-4 w-4 mr-2" />
              Xem xét
            </Button>
          )}
          <Link href={`/dashboard/mou/${mou.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Thông tin cơ bản
                <Badge className={statusColors[mou.status as keyof typeof statusColors]}>
                  {statusLabels[mou.status as keyof typeof statusLabels]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tổ chức đối tác</Label>
                  <p className="text-sm">{mou.partnerOrganization}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Quốc gia</Label>
                  <p className="text-sm">{mou.partnerCountry}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Loại hợp tác</Label>
                  <p className="text-sm">{typeLabels[mou.type as keyof typeof typeLabels]}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mức độ ưu tiên</Label>
                  <p className="text-sm">{priorityLabels[mou.priority as keyof typeof priorityLabels]}</p>
                </div>
                {mou.proposedDate && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ngày đề xuất</Label>
                    <p className="text-sm">{new Date(mou.proposedDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
                {mou.signedDate && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ngày ký</Label>
                    <p className="text-sm">{new Date(mou.signedDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                <p className="text-sm mt-1">{mou.description}</p>
              </div>
            </CardContent>
          </Card>

          {mou.objectives && (
            <Card>
              <CardHeader>
                <CardTitle>Mục tiêu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{mou.objectives}</p>
              </CardContent>
            </Card>
          )}

          {mou.scope && (
            <Card>
              <CardHeader>
                <CardTitle>Phạm vi hợp tác</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{mou.scope}</p>
              </CardContent>
            </Card>
          )}

          {mou.terms && (
            <Card>
              <CardHeader>
                <CardTitle>Điều khoản</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{mou.terms}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin quản lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mou.creator && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Người tạo</Label>
                  <p className="text-sm">{mou.creator.fullName}</p>
                  <p className="text-xs text-muted-foreground">{mou.creator.email}</p>
                </div>
              )}
              
              {mou.assignee && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Người phụ trách</Label>
                  <p className="text-sm">{mou.assignee.fullName}</p>
                  <p className="text-xs text-muted-foreground">{mou.assignee.email}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
                <p className="text-sm">{new Date(mou.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</Label>
                <p className="text-sm">{new Date(mou.updatedAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </CardContent>
          </Card>

          {mou.partnerContact && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Người liên hệ</Label>
                  <p className="text-sm">{mou.partnerContact}</p>
                </div>
                {mou.partnerEmail && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{mou.partnerEmail}</p>
                  </div>
                )}
                {mou.partnerPhone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Điện thoại</Label>
                    <p className="text-sm">{mou.partnerPhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(mou.reviewComments || mou.rejectionReason) && (
            <Card>
              <CardHeader>
                <CardTitle>Nhận xét</CardTitle>
              </CardHeader>
              <CardContent>
                {mou.reviewComments && (
                  <div className="mb-3">
                    <Label className="text-sm font-medium text-muted-foreground">Nhận xét xem xét</Label>
                    <p className="text-sm mt-1">{mou.reviewComments}</p>
                  </div>
                )}
                {mou.rejectionReason && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Lý do từ chối</Label>
                    <p className="text-sm mt-1 text-red-600">{mou.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Xem xét MOU</CardTitle>
              <CardDescription>
                Cập nhật trạng thái và thêm nhận xét
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Hành động</Label>
                <Select value={reviewAction} onValueChange={setReviewAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hành động" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviewing">Chuyển sang duyệt</SelectItem>
                    <SelectItem value="pending_supplement">Yêu cầu bổ sung</SelectItem>
                    <SelectItem value="approved">Phê duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Nhận xét</Label>
                <Textarea
                  value={reviewComments}
                  onChange={(e: any) => setReviewComments(e.target.value)}
                  placeholder="Nhập nhận xét..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Hủy
                </Button>
                <Button onClick={handleReview}>
                  Xác nhận
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
