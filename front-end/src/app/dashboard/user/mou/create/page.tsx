'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CreateMouData {
  title: string;
  partnerOrganization: string;
  partnerCountry: string;
  partnerContact: string;
  partnerEmail: string;
  partnerPhone: string;
  description: string;
  type: string;
  priority: string;
  proposedDate: string;
  effectiveDate: string;
  expiryDate: string;
  objectives: string;
  scope: string;
  benefits: string;
  terms: string;
  notes: string;
  department: string;
  faculty: string;
}

const mouTypes = [
  { value: 'academic_cooperation', label: 'Hợp tác học thuật' },
  { value: 'research_collaboration', label: 'Hợp tác nghiên cứu' },
  { value: 'student_exchange', label: 'Trao đổi sinh viên' },
  { value: 'faculty_exchange', label: 'Trao đổi giảng viên' },
  { value: 'training_cooperation', label: 'Hợp tác đào tạo' },
  { value: 'other', label: 'Khác' },
];

const priorities = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
  { value: 'urgent', label: 'Khẩn cấp' },
];

export default function CreateMouPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMouData>({
    title: '',
    partnerOrganization: '',
    partnerCountry: '',
    partnerContact: '',
    partnerEmail: '',
    partnerPhone: '',
    description: '',
    type: 'academic_cooperation',
    priority: 'medium',
    proposedDate: '',
    effectiveDate: '',
    expiryDate: '',
    objectives: '',
    scope: '',
    benefits: '',
    terms: '',
    notes: '',
    department: '',
    faculty: '',
  });

  const handleInputChange = (field: keyof CreateMouData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.partnerOrganization || !formData.partnerCountry || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/v1/mou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Tạo MOU thành công');
        router.push('/dashboard/user/mou');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Không thể tạo MOU');
      }
    } catch (error) {
      console.error('Error creating MOU:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo MOU mới</h1>
          <p className="text-muted-foreground">
            Tạo thỏa thuận hợp tác quốc tế mới
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản về MOU
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề MOU *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề MOU"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerOrganization">Tổ chức đối tác *</Label>
                <Input
                  id="partnerOrganization"
                  value={formData.partnerOrganization}
                  onChange={(e) => handleInputChange('partnerOrganization', e.target.value)}
                  placeholder="Tên tổ chức đối tác"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerCountry">Quốc gia *</Label>
                <Input
                  id="partnerCountry"
                  value={formData.partnerCountry}
                  onChange={(e) => handleInputChange('partnerCountry', e.target.value)}
                  placeholder="Quốc gia của đối tác"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại hợp tác</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hợp tác" />
                  </SelectTrigger>
                  <SelectContent>
                    {mouTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proposedDate">Ngày đề xuất</Label>
                <Input
                  id="proposedDate"
                  type="date"
                  value={formData.proposedDate}
                  onChange={(e) => handleInputChange('proposedDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả chi tiết về MOU"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin đối tác</CardTitle>
            <CardDescription>
              Thông tin liên hệ của đối tác
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnerContact">Người liên hệ</Label>
                <Input
                  id="partnerContact"
                  value={formData.partnerContact}
                  onChange={(e) => handleInputChange('partnerContact', e.target.value)}
                  placeholder="Tên người liên hệ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerEmail">Email liên hệ</Label>
                <Input
                  id="partnerEmail"
                  type="email"
                  value={formData.partnerEmail}
                  onChange={(e) => handleInputChange('partnerEmail', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerPhone">Số điện thoại</Label>
                <Input
                  id="partnerPhone"
                  value={formData.partnerPhone}
                  onChange={(e) => handleInputChange('partnerPhone', e.target.value)}
                  placeholder="Số điện thoại liên hệ"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiết hợp tác</CardTitle>
            <CardDescription>
              Thông tin chi tiết về nội dung hợp tác
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="objectives">Mục tiêu</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="Mục tiêu của MOU"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope">Phạm vi hợp tác</Label>
              <Textarea
                id="scope"
                value={formData.scope}
                onChange={(e) => handleInputChange('scope', e.target.value)}
                placeholder="Phạm vi và lĩnh vực hợp tác"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefits">Lợi ích mong đợi</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                placeholder="Lợi ích mong đợi từ hợp tác"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Điều khoản</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                placeholder="Các điều khoản chính của MOU"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Khoa/Phòng</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Khoa/Phòng phụ trách"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Khoa</Label>
                <Input
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  placeholder="Khoa liên quan"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Ghi chú thêm"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Đang lưu...' : 'Tạo MOU'}
          </Button>
        </div>
      </form>
    </div>
  );
}
