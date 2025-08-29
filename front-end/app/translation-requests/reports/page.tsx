'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { translationRequestAPI } from '@/lib/api/translation-request';
import { 
  TranslationStatus,
  DocumentType,
  LanguagePair,
  TRANSLATION_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  LANGUAGE_PAIR_LABELS 
} from '@/lib/types/translation-request';

export default function TranslationReportPage() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    submittingUnit: '',
    status: '',
    documentType: '',
    languagePair: '',
    format: 'EXCEL',
    year: new Date().getFullYear().toString(),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);

      // Prepare report data
      const reportData = {
        ...filters,
        status: filters.status as TranslationStatus || undefined,
        documentType: filters.documentType as DocumentType || undefined,
        languagePair: filters.languagePair as LanguagePair || undefined,
        format: filters.format as 'EXCEL' | 'PDF',
      };

      // Remove empty fields
      Object.keys(reportData).forEach(key => {
        if (reportData[key as keyof typeof reportData] === '') {
          delete reportData[key as keyof typeof reportData];
        }
      });

      await translationRequestAPI.generateReport(reportData);
      
      alert('Báo cáo đã được tạo và tải xuống thành công!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Báo Cáo Xác Nhận Bản Dịch</h1>
        <p className="text-gray-600 mt-2">
          Tạo báo cáo thống kê và xuất dữ liệu yêu cầu xác nhận bản dịch
        </p>
      </div>

      {/* Report Form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Tùy chọn báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Năm báo cáo</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange('year', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Từ ngày (tùy chọn)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Đến ngày (tùy chọn)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Đơn vị nộp</Label>
                <Input
                  placeholder="Nhập tên đơn vị..."
                  value={filters.submittingUnit}
                  onChange={(e) => handleFilterChange('submittingUnit', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả trạng thái</SelectItem>
                    {Object.entries(TRANSLATION_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Loại tài liệu</Label>
                <Select
                  value={filters.documentType}
                  onValueChange={(value) => handleFilterChange('documentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả loại</SelectItem>
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cặp ngôn ngữ</Label>
                <Select
                  value={filters.languagePair}
                  onValueChange={(value) => handleFilterChange('languagePair', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả ngôn ngữ</SelectItem>
                    {Object.entries(LANGUAGE_PAIR_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <Label>Định dạng xuất</Label>
              <Select
                value={filters.format}
                onValueChange={(value) => handleFilterChange('format', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCEL">Excel (.xlsx)</SelectItem>
                  <SelectItem value="PDF">PDF (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button 
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full md:w-auto"
                size="lg"
              >
                {loading ? 'Đang tạo báo cáo...' : 'Tạo và Tải Báo Cáo'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Năm báo cáo:</strong> Chọn năm để lấy dữ liệu trong toàn bộ năm đó. 
              Nếu chọn khoảng thời gian cụ thể, hệ thống sẽ ưu tiên sử dụng khoảng thời gian đó.
            </p>
            <p>
              <strong>Khoảng thời gian:</strong> Có thể chọn khoảng thời gian cụ thể thay vì cả năm. 
              Nếu không chọn, hệ thống sẽ lấy dữ liệu theo năm được chọn.
            </p>
            <p>
              <strong>Bộ lọc:</strong> Các bộ lọc giúp thu hẹp dữ liệu theo tiêu chí mong muốn. 
              Để trống nếu muốn lấy tất cả dữ liệu.
            </p>
            <p>
              <strong>Định dạng:</strong> Excel phù hợp để phân tích dữ liệu, PDF phù hợp để in ấn và lưu trữ.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
