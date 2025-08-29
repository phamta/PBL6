'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { CalendarIcon, Upload } from 'lucide-react'
import { 
  visitorAPI, 
  CreateVisitorDto, 
  UpdateVisitorDto, 
  Visitor, 
  VisitorGender, 
  VisitorPurpose 
} from '@/lib/visitor-api'

interface VisitorFormProps {
  initialData?: Partial<Visitor>
  isEditing?: boolean
  visitorId?: string
}

const GENDER_OPTIONS = [
  { value: VisitorGender.MALE, label: 'Nam' },
  { value: VisitorGender.FEMALE, label: 'Nữ' },
  { value: VisitorGender.OTHER, label: 'Khác' },
]

const PURPOSE_OPTIONS = [
  { value: VisitorPurpose.ACADEMIC_EXCHANGE, label: 'Trao đổi học thuật' },
  { value: VisitorPurpose.RESEARCH_COLLABORATION, label: 'Hợp tác nghiên cứu' },
  { value: VisitorPurpose.CONFERENCE, label: 'Hội nghị' },
  { value: VisitorPurpose.WORKSHOP, label: 'Hội thảo' },
  { value: VisitorPurpose.TRAINING, label: 'Đào tạo' },
  { value: VisitorPurpose.BUSINESS_MEETING, label: 'Gặp gỡ kinh doanh' },
  { value: VisitorPurpose.CULTURAL_EXCHANGE, label: 'Trao đổi văn hóa' },
  { value: VisitorPurpose.OTHER, label: 'Khác' },
]

export default function VisitorForm({ initialData, isEditing, visitorId }: VisitorFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [passportScanFile, setPassportScanFile] = useState<File | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<CreateVisitorDto | UpdateVisitorDto>({
    fullName: initialData?.fullName || '',
    nationality: initialData?.nationality || '',
    passportNumber: initialData?.passportNumber || '',
    gender: initialData?.gender || VisitorGender.MALE,
    dateOfBirth: initialData?.dateOfBirth || '',
    position: initialData?.position || '',
    organization: initialData?.organization || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    arrivalDateTime: initialData?.arrivalDateTime ? 
      new Date(initialData.arrivalDateTime).toISOString().slice(0, 16) : '',
    departureDateTime: initialData?.departureDateTime ? 
      new Date(initialData.departureDateTime).toISOString().slice(0, 16) : '',
    purpose: initialData?.purpose || VisitorPurpose.ACADEMIC_EXCHANGE,
    purposeDetails: initialData?.purposeDetails || '',
    invitingUnit: initialData?.invitingUnit || '',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: CreateVisitorDto | UpdateVisitorDto) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (type: 'passportScan' | 'document', file: File | null) => {
    if (type === 'passportScan') {
      setPassportScanFile(file)
    } else {
      setDocumentFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.nationality || !formData.passportNumber) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const files = {
        passportScan: passportScanFile || undefined,
        document: documentFile || undefined,
      }

      if (isEditing && visitorId) {
        await visitorAPI.updateVisitor(visitorId, formData as UpdateVisitorDto, files)
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin khách thành công',
        })
      } else {
        await visitorAPI.createVisitor(formData as CreateVisitorDto, files)
        toast({
          title: 'Thành công',
          description: 'Thêm khách mới thành công',
        })
      }

      router.push('/dashboard/visitor')
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Có lỗi xảy ra',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Quốc tịch *</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Nhập quốc tịch"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportNumber">Số hộ chiếu *</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                placeholder="Nhập số hộ chiếu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Chức danh *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Nhập chức danh"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="organization">Cơ quan *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="Nhập tên cơ quan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chuyến thăm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalDateTime">Thời gian đến *</Label>
              <Input
                id="arrivalDateTime"
                type="datetime-local"
                value={formData.arrivalDateTime}
                onChange={(e) => handleInputChange('arrivalDateTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureDateTime">Thời gian rời *</Label>
              <Input
                id="departureDateTime"
                type="datetime-local"
                value={formData.departureDateTime}
                onChange={(e) => handleInputChange('departureDateTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Mục đích *</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange('purpose', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mục đích" />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invitingUnit">Đơn vị mời *</Label>
              <Input
                id="invitingUnit"
                value={formData.invitingUnit}
                onChange={(e) => handleInputChange('invitingUnit', e.target.value)}
                placeholder="Nhập đơn vị mời"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="purposeDetails">Chi tiết mục đích</Label>
              <Textarea
                id="purposeDetails"
                value={formData.purposeDetails}
                onChange={(e) => handleInputChange('purposeDetails', e.target.value)}
                placeholder="Nhập chi tiết mục đích chuyến thăm"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu đính kèm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportScan">Scan hộ chiếu</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="passportScan"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange('passportScan', e.target.files?.[0] || null)}
                  className="file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Định dạng: JPG, PNG, PDF. Tối đa 10MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Tài liệu khác</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="document"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange('document', e.target.files?.[0] || null)}
                  className="file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Định dạng: JPG, PNG, PDF. Tối đa 10MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
        </Button>
      </div>
    </form>
  )
}
