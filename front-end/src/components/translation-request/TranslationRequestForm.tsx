'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { translationRequestAPI } from '@/lib/api/translation-request';
import { 
  DocumentType, 
  LanguagePair, 
  CreateTranslationRequestForm,
  DOCUMENT_TYPE_LABELS,
  LANGUAGE_PAIR_LABELS 
} from '@/lib/types/translation-request';

interface TranslationRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TranslationRequestForm({ onSuccess, onCancel }: TranslationRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTranslationRequestForm>({
    originalDocumentTitle: '',
    documentType: DocumentType.ACADEMIC_PAPER,
    languagePair: LanguagePair.EN_VI,
    purpose: '',
    submittingUnit: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.originalDocumentTitle.trim() || !formData.purpose.trim() || !formData.submittingUnit.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        originalDocumentTitle: formData.originalDocumentTitle,
        documentType: formData.documentType,
        languagePair: formData.languagePair,
        purpose: formData.purpose,
        submittingUnit: formData.submittingUnit,
      };

      await translationRequestAPI.create(submitData);
      
      alert('Tạo yêu cầu xác nhận bản dịch thành công!');
      
      // Reset form
      setFormData({
        originalDocumentTitle: '',
        documentType: DocumentType.ACADEMIC_PAPER,
        languagePair: LanguagePair.EN_VI,
        purpose: '',
        submittingUnit: '',
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error creating translation request:', error);
      alert('Có lỗi xảy ra khi tạo yêu cầu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateTranslationRequestForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tạo Yêu Cầu Xác Nhận Bản Dịch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Original Document Title */}
          <div className="space-y-2">
            <Label htmlFor="originalDocumentTitle">
              Tên tài liệu gốc <span className="text-red-500">*</span>
            </Label>
            <Input
              id="originalDocumentTitle"
              value={formData.originalDocumentTitle}
              onChange={(e) => handleInputChange('originalDocumentTitle', e.target.value)}
              placeholder="Nhập tên tài liệu gốc"
              required
            />
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="documentType">
              Loại tài liệu <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.documentType}
              onValueChange={(value: DocumentType) => handleInputChange('documentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại tài liệu" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Pair */}
          <div className="space-y-2">
            <Label htmlFor="languagePair">
              Cặp ngôn ngữ <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.languagePair}
              onValueChange={(value: LanguagePair) => handleInputChange('languagePair', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cặp ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGE_PAIR_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">
              Mục đích sử dụng <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              placeholder="Mô tả mục đích sử dụng bản dịch..."
              rows={3}
              required
            />
          </div>

          {/* Submitting Unit */}
          <div className="space-y-2">
            <Label htmlFor="submittingUnit">
              Đơn vị nộp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="submittingUnit"
              value={formData.submittingUnit}
              onChange={(e) => handleInputChange('submittingUnit', e.target.value)}
              placeholder="Nhập tên đơn vị nộp"
              required
            />
          </div>

          {/* File Upload Sections */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tài liệu gốc</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, originalFile: file }));
                  }
                }}
              />
              <p className="text-sm text-gray-500">
                Định dạng hỗ trợ: PDF, Word, Excel, PowerPoint, Text, Image (tối đa 10MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Bản dịch (nếu có)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, translatedFile: file }));
                  }
                }}
              />
              <p className="text-sm text-gray-500">
                Tải lên bản dịch sẵn có (nếu có) để KHCN&ĐN xem xét
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Đang xử lý...' : 'Tạo Yêu Cầu'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Hủy
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
