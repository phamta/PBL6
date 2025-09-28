'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisaExtensionFormData {
  hoTen: string;
  ngaySinh: string;
  quocTich: string;
  soHoChieu: string;
  ngayCapHoChieu: string;
  noiCapHoChieu: string;
  ngayHetHanHoChieu: string;
  loaiVisa: string;
  soVisa: string;
  ngayCapVisa: string;
  ngayHetHanVisa: string;
  ngayNhapCanh: string;
  cuaKhauNhapCanh: string;
  mucDichNhapCanh: string;
  diaChiOVietNam: string;
  lyDoXinGiaHan: string;
  thoiGianGiaHanMongMuon: number;
  donViBaoLanh: string;
  diaChiDonViBaoLanh: string;
  nguoiDaiDienBaoLanh: string;
  soDienThoaiLienHe: string;
  emailLienHe: string;
  cacGiayToDinhKem: string[];
  ghiChu: string;
}

export default function VisaExtensionPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<VisaExtensionFormData>({
    hoTen: '',
    ngaySinh: '',
    quocTich: '',
    soHoChieu: '',
    ngayCapHoChieu: '',
    noiCapHoChieu: '',
    ngayHetHanHoChieu: '',
    loaiVisa: 'DT',
    soVisa: '',
    ngayCapVisa: '',
    ngayHetHanVisa: '',
    ngayNhapCanh: '',
    cuaKhauNhapCanh: '',
    mucDichNhapCanh: '',
    diaChiOVietNam: '',
    lyDoXinGiaHan: '',
    thoiGianGiaHanMongMuon: 30,
    donViBaoLanh: '',
    diaChiDonViBaoLanh: '',
    nguoiDaiDienBaoLanh: '',
    soDienThoaiLienHe: '',
    emailLienHe: '',
    cacGiayToDinhKem: [],
    ghiChu: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (field: keyof VisaExtensionFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setFormData(prev => ({
        ...prev,
        cacGiayToDinhKem: [...prev.cacGiayToDinhKem, ...newFiles.map(f => f.name)]
      }));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      cacGiayToDinhKem: prev.cacGiayToDinhKem.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (draft: boolean = false) => {
    try {
      const submissionData = {
        ...formData,
        trangThai: draft ? 'draft' : 'pending'
      };
      
      console.log('Submitting visa extension:', submissionData);
      
      toast({
        title: draft ? 'Lưu nháp thành công' : 'Đã gửi thành công',
        description: draft 
          ? 'Đơn xin gia hạn visa đã được lưu dưới dạng nháp'
          : 'Đơn xin gia hạn visa đã được gửi để xem xét',
      });

      if (!draft) {
        // Reset form
        setFormData({
          hoTen: '',
          ngaySinh: '',
          quocTich: '',
          soHoChieu: '',
          ngayCapHoChieu: '',
          noiCapHoChieu: '',
          ngayHetHanHoChieu: '',
          loaiVisa: 'DT',
          soVisa: '',
          ngayCapVisa: '',
          ngayHetHanVisa: '',
          ngayNhapCanh: '',
          cuaKhauNhapCanh: '',
          mucDichNhapCanh: '',
          diaChiOVietNam: '',
          lyDoXinGiaHan: '',
          thoiGianGiaHanMongMuon: 30,
          donViBaoLanh: '',
          diaChiDonViBaoLanh: '',
          nguoiDaiDienBaoLanh: '',
          soDienThoaiLienHe: '',
          emailLienHe: '',
          cacGiayToDinhKem: [],
          ghiChu: '',
        });
        setUploadedFiles([]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi đơn xin gia hạn',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          VISA
        </Badge>
        <h1 className="text-2xl font-bold">Đơn xin gia hạn tạm trú</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Điền đầy đủ thông tin để xin gia hạn tạm trú tại Việt Nam
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-6">
        {/* Thông tin cá nhân */}
        <Card>
          <CardHeader>
            <CardTitle>I. Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoTen">Họ và tên *</Label>
                <Input
                  id="hoTen"
                  value={formData.hoTen}
                  onChange={(e) => handleInputChange('hoTen', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ngaySinh">Ngày sinh *</Label>
                <Input
                  id="ngaySinh"
                  type="date"
                  value={formData.ngaySinh}
                  onChange={(e) => handleInputChange('ngaySinh', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="quocTich">Quốc tịch *</Label>
              <Select value={formData.quocTich} onValueChange={(value) => handleInputChange('quocTich', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quốc tịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Japan">Nhật Bản</SelectItem>
                  <SelectItem value="Korea">Hàn Quốc</SelectItem>
                  <SelectItem value="China">Trung Quốc</SelectItem>
                  <SelectItem value="USA">Mỹ</SelectItem>
                  <SelectItem value="UK">Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin hộ chiếu */}
        <Card>
          <CardHeader>
            <CardTitle>II. Thông tin hộ chiếu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soHoChieu">Số hộ chiếu *</Label>
                <Input
                  id="soHoChieu"
                  value={formData.soHoChieu}
                  onChange={(e) => handleInputChange('soHoChieu', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ngayCapHoChieu">Ngày cấp *</Label>
                <Input
                  id="ngayCapHoChieu"
                  type="date"
                  value={formData.ngayCapHoChieu}
                  onChange={(e) => handleInputChange('ngayCapHoChieu', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="noiCapHoChieu">Nơi cấp *</Label>
                <Input
                  id="noiCapHoChieu"
                  value={formData.noiCapHoChieu}
                  onChange={(e) => handleInputChange('noiCapHoChieu', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ngayHetHanHoChieu">Ngày hết hạn *</Label>
                <Input
                  id="ngayHetHanHoChieu"
                  type="date"
                  value={formData.ngayHetHanHoChieu}
                  onChange={(e) => handleInputChange('ngayHetHanHoChieu', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin visa hiện tại */}
        <Card>
          <CardHeader>
            <CardTitle>III. Thông tin visa hiện tại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="loaiVisa">Loại visa *</Label>
                <Select value={formData.loaiVisa} onValueChange={(value) => handleInputChange('loaiVisa', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DT">DT (Du lịch)</SelectItem>
                    <SelectItem value="DN">DN (Doanh nhân)</SelectItem>
                    <SelectItem value="DH">DH (Du học)</SelectItem>
                    <SelectItem value="LD">LD (Lao động)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="soVisa">Số visa *</Label>
                <Input
                  id="soVisa"
                  value={formData.soVisa}
                  onChange={(e) => handleInputChange('soVisa', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ngayCapVisa">Ngày cấp visa *</Label>
                <Input
                  id="ngayCapVisa"
                  type="date"
                  value={formData.ngayCapVisa}
                  onChange={(e) => handleInputChange('ngayCapVisa', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ngayHetHanVisa">Ngày hết hạn visa *</Label>
                <Input
                  id="ngayHetHanVisa"
                  type="date"
                  value={formData.ngayHetHanVisa}
                  onChange={(e) => handleInputChange('ngayHetHanVisa', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ngayNhapCanh">Ngày nhập cảnh *</Label>
                <Input
                  id="ngayNhapCanh"
                  type="date"
                  value={formData.ngayNhapCanh}
                  onChange={(e) => handleInputChange('ngayNhapCanh', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cuaKhauNhapCanh">Cửa khẩu nhập cảnh *</Label>
              <Input
                id="cuaKhauNhapCanh"
                value={formData.cuaKhauNhapCanh}
                onChange={(e) => handleInputChange('cuaKhauNhapCanh', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin gia hạn */}
        <Card>
          <CardHeader>
            <CardTitle>IV. Thông tin xin gia hạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mucDichNhapCanh">Mục đích nhập cảnh *</Label>
              <Textarea
                id="mucDichNhapCanh"
                value={formData.mucDichNhapCanh}
                onChange={(e) => handleInputChange('mucDichNhapCanh', e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="lyDoXinGiaHan">Lý do xin gia hạn *</Label>
              <Textarea
                id="lyDoXinGiaHan"
                value={formData.lyDoXinGiaHan}
                onChange={(e) => handleInputChange('lyDoXinGiaHan', e.target.value)}
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="thoiGianGiaHanMongMuon">Thời gian gia hạn mong muốn (ngày) *</Label>
              <Select 
                value={formData.thoiGianGiaHanMongMuon.toString()} 
                onValueChange={(value) => handleInputChange('thoiGianGiaHanMongMuon', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 ngày</SelectItem>
                  <SelectItem value="30">30 ngày</SelectItem>
                  <SelectItem value="60">60 ngày</SelectItem>
                  <SelectItem value="90">90 ngày</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="diaChiOVietNam">Địa chỉ ở Việt Nam *</Label>
              <Textarea
                id="diaChiOVietNam"
                value={formData.diaChiOVietNam}
                onChange={(e) => handleInputChange('diaChiOVietNam', e.target.value)}
                rows={2}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin đơn vị bảo lãnh */}
        <Card>
          <CardHeader>
            <CardTitle>V. Thông tin đơn vị bảo lãnh (nếu có)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="donViBaoLanh">Tên đơn vị bảo lãnh</Label>
              <Input
                id="donViBaoLanh"
                value={formData.donViBaoLanh}
                onChange={(e) => handleInputChange('donViBaoLanh', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="diaChiDonViBaoLanh">Địa chỉ đơn vị bảo lãnh</Label>
              <Textarea
                id="diaChiDonViBaoLanh"
                value={formData.diaChiDonViBaoLanh}
                onChange={(e) => handleInputChange('diaChiDonViBaoLanh', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="nguoiDaiDienBaoLanh">Người đại diện bảo lãnh</Label>
              <Input
                id="nguoiDaiDienBaoLanh"
                value={formData.nguoiDaiDienBaoLanh}
                onChange={(e) => handleInputChange('nguoiDaiDienBaoLanh', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin liên hệ */}
        <Card>
          <CardHeader>
            <CardTitle>VI. Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soDienThoaiLienHe">Số điện thoại *</Label>
                <Input
                  id="soDienThoaiLienHe"
                  value={formData.soDienThoaiLienHe}
                  onChange={(e) => handleInputChange('soDienThoaiLienHe', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emailLienHe">Email *</Label>
                <Input
                  id="emailLienHe"
                  type="email"
                  value={formData.emailLienHe}
                  onChange={(e) => handleInputChange('emailLienHe', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tài liệu đính kèm */}
        <Card>
          <CardHeader>
            <CardTitle>VII. Tài liệu đính kèm</CardTitle>
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
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: PDF, JPG, PNG, DOC, DOCX (tối đa 10MB mỗi file)
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

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Tài liệu cần thiết:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bản photo hộ chiếu (có công chứng)</li>
                <li>Bản photo visa hiện tại</li>
                <li>Giấy tờ chứng minh lý do gia hạn</li>
                <li>Đơn xin gia hạn (có ký tên và ngày tháng)</li>
                <li>Ảnh 4x6 cm (nền trắng)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Ghi chú */}
        <Card>
          <CardHeader>
            <CardTitle>VIII. Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="ghiChu"
              placeholder="Thông tin bổ sung (nếu có)..."
              value={formData.ghiChu}
              onChange={(e) => handleInputChange('ghiChu', e.target.value)}
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gửi đơn xin gia hạn
          </Button>
        </div>
      </form>
    </div>
  );
}