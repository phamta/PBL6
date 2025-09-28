'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Calendar, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationCertificateFormData {
  requestType: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantAddress: string;
  organizationName: string;
  organizationAddress: string;
  organizationContact: string;
  documentType: string;
  documentTitle: string;
  documentLanguage: string;
  targetLanguage: string;
  documentDescription: string;
  pageCount: number;
  urgencyLevel: string;
  requestedDeliveryDate: string;
  deliveryMethod: string;
  deliveryAddress: string;
  translatorPreference: string;
  certificationLevel: string;
  purpose: string;
  additionalRequirements: string;
  attachments: string[];
  notes: string;
}

export default function TranslationCertificatePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TranslationCertificateFormData>({
    requestType: 'translation',
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantAddress: '',
    organizationName: '',
    organizationAddress: '',
    organizationContact: '',
    documentType: '',
    documentTitle: '',
    documentLanguage: 'vi',
    targetLanguage: 'en',
    documentDescription: '',
    pageCount: 1,
    urgencyLevel: 'normal',
    requestedDeliveryDate: '',
    deliveryMethod: 'pickup',
    deliveryAddress: '',
    translatorPreference: '',
    certificationLevel: 'standard',
    purpose: '',
    additionalRequirements: '',
    attachments: [],
    notes: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (field: keyof TranslationCertificateFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles.map(f => f.name)]
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const calculateEstimatedCost = () => {
    const baseRate = 50000; // VND per page
    const urgencyMultiplier = formData.urgencyLevel === 'urgent' ? 1.5 : 1;
    const certificationMultiplier = formData.certificationLevel === 'notarized' ? 1.3 : 1;
    
    return Math.round(formData.pageCount * baseRate * urgencyMultiplier * certificationMultiplier);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleSubmit = async (draft: boolean = false) => {
    try {
      const submissionData = {
        ...formData,
        estimatedCost: calculateEstimatedCost(),
        status: draft ? 'draft' : 'pending'
      };
      
      console.log('Submitting translation certificate request:', submissionData);
      
      toast({
        title: draft ? 'Lưu nháp thành công' : 'Đã gửi thành công',
        description: draft 
          ? 'Yêu cầu chứng thực dịch thuật đã được lưu dưới dạng nháp'
          : 'Yêu cầu chứng thực dịch thuật đã được gửi để xem xét',
      });

      if (!draft) {
        // Reset form
        setFormData({
          requestType: 'translation',
          applicantName: '',
          applicantPhone: '',
          applicantEmail: '',
          applicantAddress: '',
          organizationName: '',
          organizationAddress: '',
          organizationContact: '',
          documentType: '',
          documentTitle: '',
          documentLanguage: 'vi',
          targetLanguage: 'en',
          documentDescription: '',
          pageCount: 1,
          urgencyLevel: 'normal',
          requestedDeliveryDate: '',
          deliveryMethod: 'pickup',
          deliveryAddress: '',
          translatorPreference: '',
          certificationLevel: 'standard',
          purpose: '',
          additionalRequirements: '',
          attachments: [],
          notes: '',
        });
        setUploadedFiles([]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi yêu cầu',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          <Languages className="h-3 w-3 mr-1" />
          TRANS
        </Badge>
        <h1 className="text-2xl font-bold">Yêu cầu chứng thực dịch thuật</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Điền thông tin để yêu cầu dịch thuật và chứng thực tài liệu
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-6">
        {/* Loại yêu cầu */}
        <Card>
          <CardHeader>
            <CardTitle>I. Loại yêu cầu</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="requestType">Dịch vụ yêu cầu *</Label>
              <Select value={formData.requestType} onValueChange={(value) => handleInputChange('requestType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="translation">Dịch thuật</SelectItem>
                  <SelectItem value="certification">Chứng thực</SelectItem>
                  <SelectItem value="both">Dịch thuật + Chứng thực</SelectItem>
                  <SelectItem value="revision">Kiểm tra lại bản dịch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin người yêu cầu */}
        <Card>
          <CardHeader>
            <CardTitle>II. Thông tin người yêu cầu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Họ và tên *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicantPhone">Số điện thoại *</Label>
                <Input
                  id="applicantPhone"
                  value={formData.applicantPhone}
                  onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="applicantEmail">Email *</Label>
              <Input
                id="applicantEmail"
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="applicantAddress">Địa chỉ *</Label>
              <Textarea
                id="applicantAddress"
                value={formData.applicantAddress}
                onChange={(e) => handleInputChange('applicantAddress', e.target.value)}
                rows={2}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin tổ chức (nếu có) */}
        <Card>
          <CardHeader>
            <CardTitle>III. Thông tin tổ chức (nếu có)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="organizationName">Tên tổ chức</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="organizationAddress">Địa chỉ tổ chức</Label>
              <Textarea
                id="organizationAddress"
                value={formData.organizationAddress}
                onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="organizationContact">Người liên hệ</Label>
              <Input
                id="organizationContact"
                value={formData.organizationContact}
                onChange={(e) => handleInputChange('organizationContact', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin tài liệu */}
        <Card>
          <CardHeader>
            <CardTitle>IV. Thông tin tài liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentType">Loại tài liệu *</Label>
                <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Học thuật</SelectItem>
                    <SelectItem value="legal">Pháp lý</SelectItem>
                    <SelectItem value="medical">Y tế</SelectItem>
                    <SelectItem value="business">Kinh doanh</SelectItem>
                    <SelectItem value="personal">Cá nhân</SelectItem>
                    <SelectItem value="technical">Kỹ thuật</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentTitle">Tên tài liệu *</Label>
                <Input
                  id="documentTitle"
                  value={formData.documentTitle}
                  onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="documentLanguage">Ngôn ngữ gốc *</Label>
                <Select value={formData.documentLanguage} onValueChange={(value) => handleInputChange('documentLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">Tiếng Anh</SelectItem>
                    <SelectItem value="ja">Tiếng Nhật</SelectItem>
                    <SelectItem value="ko">Tiếng Hàn</SelectItem>
                    <SelectItem value="zh">Tiếng Trung</SelectItem>
                    <SelectItem value="fr">Tiếng Pháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetLanguage">Ngôn ngữ đích *</Label>
                <Select value={formData.targetLanguage} onValueChange={(value) => handleInputChange('targetLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">Tiếng Anh</SelectItem>
                    <SelectItem value="ja">Tiếng Nhật</SelectItem>
                    <SelectItem value="ko">Tiếng Hàn</SelectItem>
                    <SelectItem value="zh">Tiếng Trung</SelectItem>
                    <SelectItem value="fr">Tiếng Pháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pageCount">Số trang *</Label>
                <Input
                  id="pageCount"
                  type="number"
                  min="1"
                  value={formData.pageCount}
                  onChange={(e) => handleInputChange('pageCount', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="documentDescription">Mô tả tài liệu *</Label>
              <Textarea
                id="documentDescription"
                value={formData.documentDescription}
                onChange={(e) => handleInputChange('documentDescription', e.target.value)}
                rows={3}
                placeholder="Mô tả ngắn gọn về nội dung tài liệu..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Yêu cầu dịch thuật */}
        <Card>
          <CardHeader>
            <CardTitle>V. Yêu cầu dịch thuật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgencyLevel">Mức độ khẩn cấp *</Label>
                <Select value={formData.urgencyLevel} onValueChange={(value) => handleInputChange('urgencyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Bình thường (5-7 ngày)</SelectItem>
                    <SelectItem value="urgent">Gấp (2-3 ngày)</SelectItem>
                    <SelectItem value="emergency">Khẩn cấp (24h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="certificationLevel">Mức độ chứng thực *</Label>
                <Select value={formData.certificationLevel} onValueChange={(value) => handleInputChange('certificationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Tiêu chuẩn</SelectItem>
                    <SelectItem value="certified">Có chứng thực</SelectItem>
                    <SelectItem value="notarized">Công chứng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="requestedDeliveryDate">Ngày yêu cầu hoàn thành</Label>
              <Input
                id="requestedDeliveryDate"
                type="date"
                value={formData.requestedDeliveryDate}
                onChange={(e) => handleInputChange('requestedDeliveryDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="purpose">Mục đích sử dụng *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                rows={2}
                placeholder="VD: Nộp hồ sơ du học, xin visa, thủ tục pháp lý..."
                required
              />
            </div>

            <div>
              <Label htmlFor="translatorPreference">Yêu cầu về dịch giả</Label>
              <Input
                id="translatorPreference"
                value={formData.translatorPreference}
                onChange={(e) => handleInputChange('translatorPreference', e.target.value)}
                placeholder="VD: Có chuyên môn y tế, kinh nghiệm pháp lý..."
              />
            </div>

            <div>
              <Label htmlFor="additionalRequirements">Yêu cầu bổ sung</Label>
              <Textarea
                id="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                rows={3}
                placeholder="Các yêu cầu đặc biệt về định dạng, thuật ngữ, v.v..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Phương thức giao nhận */}
        <Card>
          <CardHeader>
            <CardTitle>VI. Phương thức giao nhận</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deliveryMethod">Phương thức nhận kết quả *</Label>
              <Select value={formData.deliveryMethod} onValueChange={(value) => handleInputChange('deliveryMethod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Đến nhận trực tiếp</SelectItem>
                  <SelectItem value="delivery">Giao tận nơi</SelectItem>
                  <SelectItem value="email">Email (bản mềm)</SelectItem>
                  <SelectItem value="both">Email + Bản cứng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(formData.deliveryMethod === 'delivery' || formData.deliveryMethod === 'both') && (
              <div>
                <Label htmlFor="deliveryAddress">Địa chỉ giao hàng *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  rows={2}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chi phí ước tính */}
        <Card>
          <CardHeader>
            <CardTitle>VII. Chi phí ước tính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Số trang:</span>
                <span>{formData.pageCount} trang</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Mức độ khẩn cấp:</span>
                <span>
                  {formData.urgencyLevel === 'urgent' ? '+50%' : 
                   formData.urgencyLevel === 'emergency' ? '+100%' : 'Bình thường'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Chứng thực:</span>
                <span>
                  {formData.certificationLevel === 'certified' ? '+20%' : 
                   formData.certificationLevel === 'notarized' ? '+30%' : 'Tiêu chuẩn'}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Tổng ước tính:</span>
                <span className="text-blue-600">{formatCurrency(calculateEstimatedCost())}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Giá cuối cùng có thể thay đổi tùy theo độ phức tạp của tài liệu
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tài liệu đính kèm */}
        <Card>
          <CardHeader>
            <CardTitle>VIII. Tài liệu đính kèm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="fileUpload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    Chọn tệp để tải lên
                  </span>
                  <Input
                    id="fileUpload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: PDF, JPG, PNG, DOC, DOCX, TXT (tối đa 20MB mỗi file)
                </p>
              </div>
            </div>

            {/* Hiển thị files đã upload */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Lưu ý khi tải tài liệu:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tài liệu phải rõ ràng, đầy đủ các trang</li>
                <li>Định dạng ưu tiên: PDF, DOC, DOCX</li>
                <li>Ảnh chụp phải sáng, không bị mờ</li>
                <li>Tải lên cả bản gốc và bản scan (nếu có)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Ghi chú */}
        <Card>
          <CardHeader>
            <CardTitle>IX. Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              placeholder="Ghi chú bổ sung..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => handleSubmit(true)}
          >
            Lưu nháp
          </Button>
          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </div>
  );
}