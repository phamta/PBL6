'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MOUFormData {
  donViDeXuat: string;
  tenDoiTac: string;
  quocGia: string;
  diaChi: string;
  namThanhLap: number;
  linhVucHoatDong: string;
  congNgheThongTin: string;
  capKi: string;
  loaiVanBanKyKet: string;
  lyDoVaMucDichKyKet: string;
  nguoiLienHePhuTrachHopTac: string;
  cacTepDinhKem: string[];
  ghiChu: string;
}

export default function MOUPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MOUFormData>({
    donViDeXuat: '',
    tenDoiTac: '',
    quocGia: 'Nhật Bản',
    diaChi: '',
    namThanhLap: new Date().getFullYear(),
    linhVucHoatDong: '',
    congNgheThongTin: '',
    capKi: 'Cấp Trường',
    loaiVanBanKyKet: 'MOU',
    lyDoVaMucDichKyKet: '',
    nguoiLienHePhuTrachHopTac: '',
    cacTepDinhKem: [],
    ghiChu: '',
  });

  const [isDraft, setIsDraft] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (field: keyof MOUFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setFormData(prev => ({
        ...prev,
        cacTepDinhKem: [...prev.cacTepDinhKem, ...newFiles.map(f => f.name)]
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      cacTepDinhKem: prev.cacTepDinhKem.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (draft: boolean = false) => {
    try {
      // Here you would typically send the data to your API
      const submissionData = {
        ...formData,
        trangThai: draft ? 'draft' : 'pending'
      };
      
      console.log('Submitting MOU:', submissionData);
      
      toast({
        title: draft ? 'Lưu nháp thành công' : 'Đã gửi thành công',
        description: draft 
          ? 'Biểu mẫu MOU đã được lưu dưới dạng nháp'
          : 'Biểu mẫu MOU đã được gửi để xem xét',
      });

      // Reset form if not draft
      if (!draft) {
        setFormData({
          donViDeXuat: '',
          tenDoiTac: '',
          quocGia: 'Nhật Bản',
          diaChi: '',
          namThanhLap: new Date().getFullYear(),
          linhVucHoatDong: '',
          congNgheThongTin: '',
          capKi: 'Cấp Trường',
          loaiVanBanKyKet: 'MOU',
          lyDoVaMucDichKyKet: '',
          nguoiLienHePhuTrachHopTac: '',
          cacTepDinhKem: [],
          ghiChu: '',
        });
        setUploadedFiles([]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi biểu mẫu',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          ĐKDN
        </Badge>
        <h1 className="text-2xl font-bold">Biểu mẫu điện tử để xuất ký MOU</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Điền đầy đủ thông tin theo mẫu tờ trình
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Đơn vị đề xuất</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Đơn vị đề xuất */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="donViDeXuat">Khoa/Công nghệ thông tin</Label>
              <Select onValueChange={(value) => handleInputChange('donViDeXuat', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Khoa Công nghệ thông tin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="khoa-cntt">Khoa Công nghệ thông tin</SelectItem>
                  <SelectItem value="khoa-kinh-te">Khoa Kinh tế</SelectItem>
                  <SelectItem value="khoa-ngoai-ngu">Khoa Ngoại ngữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tên đối tác */}
          <div>
            <Label htmlFor="tenDoiTac">Tên đối tác</Label>
            <Input
              id="tenDoiTac"
              placeholder="Pipe Inc."
              value={formData.tenDoiTac}
              onChange={(e) => handleInputChange('tenDoiTac', e.target.value)}
            />
          </div>

          {/* Quốc gia và Địa chỉ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quocGia">Quốc gia</Label>
              <Select value={formData.quocGia} onValueChange={(value) => handleInputChange('quocGia', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nhật Bản">Nhật Bản</SelectItem>
                  <SelectItem value="Mỹ">Mỹ</SelectItem>
                  <SelectItem value="Hàn Quốc">Hàn Quốc</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="diaChi">Địa chỉ</Label>
              <Input
                id="diaChi"
                value={formData.diaChi}
                onChange={(e) => handleInputChange('diaChi', e.target.value)}
              />
            </div>
          </div>

          {/* Năm thành lập và Lĩnh vực hoạt động */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="namThanhLap">Năm thành lập</Label>
              <Select value={formData.namThanhLap.toString()} onValueChange={(value) => handleInputChange('namThanhLap', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="linhVucHoatDong">Lĩnh vực hoạt động</Label>
              <Select onValueChange={(value) => handleInputChange('linhVucHoatDong', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Công nghệ thông tin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cntt">Công nghệ thông tin</SelectItem>
                  <SelectItem value="kinh-te">Kinh tế</SelectItem>
                  <SelectItem value="giao-duc">Giáo dục</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loại văn bản ký kết */}
          <div>
            <Label htmlFor="loaiVanBanKyKet">Loại văn bản ký kết</Label>
            <Select value={formData.loaiVanBanKyKet} onValueChange={(value) => handleInputChange('loaiVanBanKyKet', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOU">MOU</SelectItem>
                <SelectItem value="Agreement">Agreement</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cấp ký */}
          <div>
            <Label htmlFor="capKi">Cấp ký</Label>
            <Select value={formData.capKi} onValueChange={(value) => handleInputChange('capKi', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cấp Trường">Cấp Trường</SelectItem>
                <SelectItem value="Cấp Khoa">Cấp Khoa</SelectItem>
                <SelectItem value="Cấp Bộ">Cấp Bộ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lý do và mục đích ký kết */}
          <div>
            <Label htmlFor="lyDoVaMucDichKyKet">Lý do và mục đích ký kết</Label>
            <Textarea
              id="lyDoVaMucDichKyKet"
              rows={4}
              value={formData.lyDoVaMucDichKyKet}
              onChange={(e) => handleInputChange('lyDoVaMucDichKyKet', e.target.value)}
            />
          </div>

          {/* Người liên hệ phụ trách hợp tác */}
          <div>
            <Label htmlFor="nguoiLienHePhuTrachHopTac">Người liên hệ phụ trách hợp tác</Label>
            <Input
              id="nguoiLienHePhuTrachHopTac"
              value={formData.nguoiLienHePhuTrachHopTac}
              onChange={(e) => handleInputChange('nguoiLienHePhuTrachHopTac', e.target.value)}
            />
          </div>

          {/* Trạng thái xử lý */}
          <div>
            <Label>Trạng thái xử lý</Label>
            <Badge variant="outline" className="ml-2">
              Đã gửi
            </Badge>
          </div>

          {/* Các tệp đính kèm */}
          <div>
            <Label>Các tệp đính kèm</Label>
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
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  hoặc kéo và thả tệp vào đây
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
          </div>

          {/* Ghi chú */}
          <div>
            <Label htmlFor="ghiChu">Ghi chú</Label>
            <Textarea
              id="ghiChu"
              rows={3}
              value={formData.ghiChu}
              onChange={(e) => handleInputChange('ghiChu', e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
            >
              Lưu nháp
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Gửi yêu cầu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}