'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccompanyingPerson {
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
}

interface InternationalGuestFormData {
  title: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuePlace: string;
  visaNumber: string;
  visaType: string;
  visaIssueDate: string;
  visaExpiryDate: string;
  entryDate: string;
  entryPort: string;
  purposeOfVisit: string;
  addressInVietnam: string;
  contactPhone: string;
  contactEmail: string;
  organizationName: string;
  organizationAddress: string;
  organizationContact: string;
  visitDuration: string;
  accommodationInfo: string;
  emergencyContact: string;
  emergencyContactPhone: string;
  healthDeclaration: string;
  previousVisits: string;
  accompanyingPersons: AccompanyingPerson[];
  additionalNotes: string;
  attachments: string[];
}

export default function InternationalGuestPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InternationalGuestFormData>({
    title: '',
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuePlace: '',
    visaNumber: '',
    visaType: 'DT',
    visaIssueDate: '',
    visaExpiryDate: '',
    entryDate: '',
    entryPort: '',
    purposeOfVisit: '',
    addressInVietnam: '',
    contactPhone: '',
    contactEmail: '',
    organizationName: '',
    organizationAddress: '',
    organizationContact: '',
    visitDuration: '',
    accommodationInfo: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    healthDeclaration: '',
    previousVisits: '',
    accompanyingPersons: [],
    additionalNotes: '',
    attachments: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (field: keyof InternationalGuestFormData, value: any) => {
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

  const addAccompanyingPerson = () => {
    setFormData(prev => ({
      ...prev,
      accompanyingPersons: [
        ...prev.accompanyingPersons,
        {
          fullName: '',
          relationship: '',
          dateOfBirth: '',
          nationality: '',
          passportNumber: '',
        }
      ]
    }));
  };

  const removeAccompanyingPerson = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accompanyingPersons: prev.accompanyingPersons.filter((_, i) => i !== index)
    }));
  };

  const updateAccompanyingPerson = (index: number, field: keyof AccompanyingPerson, value: string) => {
    setFormData(prev => ({
      ...prev,
      accompanyingPersons: prev.accompanyingPersons.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      )
    }));
  };

  const handleSubmit = async (draft: boolean = false) => {
    try {
      const submissionData = {
        ...formData,
        status: draft ? 'draft' : 'pending'
      };
      
      console.log('Submitting international guest report:', submissionData);
      
      toast({
        title: draft ? 'Lưu nháp thành công' : 'Đã gửi thành công',
        description: draft 
          ? 'Báo cáo khách quốc tế đã được lưu dưới dạng nháp'
          : 'Báo cáo khách quốc tế đã được gửi để xem xét',
      });

      if (!draft) {
        // Reset form
        setFormData({
          title: '',
          fullName: '',
          dateOfBirth: '',
          nationality: '',
          passportNumber: '',
          passportIssueDate: '',
          passportExpiryDate: '',
          passportIssuePlace: '',
          visaNumber: '',
          visaType: 'DT',
          visaIssueDate: '',
          visaExpiryDate: '',
          entryDate: '',
          entryPort: '',
          purposeOfVisit: '',
          addressInVietnam: '',
          contactPhone: '',
          contactEmail: '',
          organizationName: '',
          organizationAddress: '',
          organizationContact: '',
          visitDuration: '',
          accommodationInfo: '',
          emergencyContact: '',
          emergencyContactPhone: '',
          healthDeclaration: '',
          previousVisits: '',
          accompanyingPersons: [],
          additionalNotes: '',
          attachments: [],
        });
        setUploadedFiles([]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi báo cáo',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          GUEST
        </Badge>
        <h1 className="text-2xl font-bold">Báo cáo khách quốc tế</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Báo cáo thông tin chi tiết về khách quốc tế đến thăm
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-6">
        {/* Thông tin chung */}
        <Card>
          <CardHeader>
            <CardTitle>I. Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề báo cáo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="VD: Báo cáo tiếp đón đoàn khách Nhật Bản"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên khách chính *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationality">Quốc tịch *</Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quốc tịch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Japan">Nhật Bản</SelectItem>
                    <SelectItem value="Korea">Hàn Quốc</SelectItem>
                    <SelectItem value="China">Trung Quốc</SelectItem>
                    <SelectItem value="USA">Mỹ</SelectItem>
                    <SelectItem value="UK">Anh</SelectItem>
                    <SelectItem value="Germany">Đức</SelectItem>
                    <SelectItem value="France">Pháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="passportNumber">Số hộ chiếu *</Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin hộ chiếu */}
        <Card>
          <CardHeader>
            <CardTitle>II. Thông tin hộ chiếu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="passportIssueDate">Ngày cấp *</Label>
                <Input
                  id="passportIssueDate"
                  type="date"
                  value={formData.passportIssueDate}
                  onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="passportExpiryDate">Ngày hết hạn *</Label>
                <Input
                  id="passportExpiryDate"
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="passportIssuePlace">Nơi cấp *</Label>
                <Input
                  id="passportIssuePlace"
                  value={formData.passportIssuePlace}
                  onChange={(e) => handleInputChange('passportIssuePlace', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin visa */}
        <Card>
          <CardHeader>
            <CardTitle>III. Thông tin visa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="visaNumber">Số visa *</Label>
                <Input
                  id="visaNumber"
                  value={formData.visaNumber}
                  onChange={(e) => handleInputChange('visaNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="visaType">Loại visa *</Label>
                <Select value={formData.visaType} onValueChange={(value) => handleInputChange('visaType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DT">DT (Du lịch)</SelectItem>
                    <SelectItem value="DN">DN (Doanh nhân)</SelectItem>
                    <SelectItem value="DH">DH (Du học)</SelectItem>
                    <SelectItem value="LD">LD (Lao động)</SelectItem>
                    <SelectItem value="TT">TT (Thăm thân)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visaIssueDate">Ngày cấp visa *</Label>
                <Input
                  id="visaIssueDate"
                  type="date"
                  value={formData.visaIssueDate}
                  onChange={(e) => handleInputChange('visaIssueDate', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visaExpiryDate">Ngày hết hạn visa *</Label>
                <Input
                  id="visaExpiryDate"
                  type="date"
                  value={formData.visaExpiryDate}
                  onChange={(e) => handleInputChange('visaExpiryDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="entryDate">Ngày nhập cảnh *</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => handleInputChange('entryDate', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="entryPort">Cửa khẩu nhập cảnh *</Label>
              <Input
                id="entryPort"
                value={formData.entryPort}
                onChange={(e) => handleInputChange('entryPort', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin chuyến thăm */}
        <Card>
          <CardHeader>
            <CardTitle>IV. Thông tin chuyến thăm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="purposeOfVisit">Mục đích chuyến thăm *</Label>
              <Textarea
                id="purposeOfVisit"
                value={formData.purposeOfVisit}
                onChange={(e) => handleInputChange('purposeOfVisit', e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="visitDuration">Thời gian lưu trú dự kiến *</Label>
              <Input
                id="visitDuration"
                value={formData.visitDuration}
                onChange={(e) => handleInputChange('visitDuration', e.target.value)}
                placeholder="VD: 5 ngày (từ 15/01 đến 20/01/2024)"
                required
              />
            </div>
            <div>
              <Label htmlFor="addressInVietnam">Địa chỉ lưu trú tại Việt Nam *</Label>
              <Textarea
                id="addressInVietnam"
                value={formData.addressInVietnam}
                onChange={(e) => handleInputChange('addressInVietnam', e.target.value)}
                rows={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="accommodationInfo">Thông tin nơi ở *</Label>
              <Textarea
                id="accommodationInfo"
                value={formData.accommodationInfo}
                onChange={(e) => handleInputChange('accommodationInfo', e.target.value)}
                rows={2}
                placeholder="VD: Khách sạn ABC, phòng 101"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin tổ chức */}
        <Card>
          <CardHeader>
            <CardTitle>V. Thông tin tổ chức tiếp đón</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="organizationName">Tên tổ chức *</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="organizationAddress">Địa chỉ tổ chức *</Label>
              <Textarea
                id="organizationAddress"
                value={formData.organizationAddress}
                onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                rows={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="organizationContact">Người liên hệ *</Label>
              <Input
                id="organizationContact"
                value={formData.organizationContact}
                onChange={(e) => handleInputChange('organizationContact', e.target.value)}
                required
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
                <Label htmlFor="contactPhone">Số điện thoại *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Người liên hệ khẩn cấp</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">SĐT khẩn cấp</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Người đi cùng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              VII. Người đi cùng
              <Button type="button" onClick={addAccompanyingPerson} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm người
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.accompanyingPersons.map((person, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Người đi cùng #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAccompanyingPerson(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Họ và tên</Label>
                    <Input
                      value={person.fullName}
                      onChange={(e) => updateAccompanyingPerson(index, 'fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Mối quan hệ</Label>
                    <Input
                      value={person.relationship}
                      onChange={(e) => updateAccompanyingPerson(index, 'relationship', e.target.value)}
                      placeholder="VD: Vợ/chồng, con, đồng nghiệp"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Ngày sinh</Label>
                    <Input
                      type="date"
                      value={person.dateOfBirth}
                      onChange={(e) => updateAccompanyingPerson(index, 'dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Quốc tịch</Label>
                    <Input
                      value={person.nationality}
                      onChange={(e) => updateAccompanyingPerson(index, 'nationality', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Số hộ chiếu</Label>
                    <Input
                      value={person.passportNumber}
                      onChange={(e) => updateAccompanyingPerson(index, 'passportNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.accompanyingPersons.length === 0 && (
              <p className="text-gray-500 text-center py-4">Chưa có người đi cùng</p>
            )}
          </CardContent>
        </Card>

        {/* Thông tin bổ sung */}
        <Card>
          <CardHeader>
            <CardTitle>VIII. Thông tin bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="healthDeclaration">Tờ khai y tế</Label>
              <Textarea
                id="healthDeclaration"
                value={formData.healthDeclaration}
                onChange={(e) => handleInputChange('healthDeclaration', e.target.value)}
                rows={3}
                placeholder="Tình trạng sức khỏe, các bệnh có thể ảnh hưởng..."
              />
            </div>
            <div>
              <Label htmlFor="previousVisits">Lịch sử nhập cảnh</Label>
              <Textarea
                id="previousVisits"
                value={formData.previousVisits}
                onChange={(e) => handleInputChange('previousVisits', e.target.value)}
                rows={3}
                placeholder="Các lần nhập cảnh Việt Nam trước đây..."
              />
            </div>
            <div>
              <Label htmlFor="additionalNotes">Ghi chú khác</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={3}
                placeholder="Thông tin bổ sung khác..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Tài liệu đính kèm */}
        <Card>
          <CardHeader>
            <CardTitle>IX. Tài liệu đính kèm</CardTitle>
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
              <p className="font-medium mb-2">Tài liệu thường cần thiết:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ảnh chụp hộ chiếu và visa</li>
                <li>Thư mời/Giấy xác nhận từ tổ chức</li>
                <li>Lịch trình chuyến thăm</li>
                <li>Ảnh chụp chung với khách</li>
                <li>Báo cáo hoạt động (nếu có)</li>
              </ul>
            </div>
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
            className="bg-green-600 hover:bg-green-700"
          >
            Gửi báo cáo
          </Button>
        </div>
      </form>
    </div>
  );
}