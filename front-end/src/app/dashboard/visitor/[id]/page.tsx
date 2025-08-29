'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { ArrowLeft, Edit, Download, FileText, Image } from 'lucide-react'
import { visitorAPI, Visitor } from '@/lib/visitor-api'

const PURPOSE_LABELS: Record<string, string> = {
  'Academic Exchange': 'Trao đổi học thuật',
  'Research Collaboration': 'Hợp tác nghiên cứu',
  'Conference': 'Hội nghị',
  'Workshop': 'Hội thảo',
  'Training': 'Đào tạo',
  'Business Meeting': 'Gặp gỡ kinh doanh',
  'Cultural Exchange': 'Trao đổi văn hóa',
  'Other': 'Khác',
}

const GENDER_LABELS: Record<string, string> = {
  'Male': 'Nam',
  'Female': 'Nữ',
  'Other': 'Khác',
}

export default function VisitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        setLoading(true)
        const response = await visitorAPI.getVisitor(params.id as string)
        setVisitor(response)
      } catch (error: any) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin khách',
          variant: 'destructive',
        })
        router.push('/dashboard/visitor')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchVisitor()
    }
  }, [params.id, router])

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const blob = await visitorAPI.downloadFile(filePath)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải file',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    )
  }

  if (!visitor) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Không tìm thấy khách</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chi tiết khách quốc tế</h1>
            <p className="text-muted-foreground">
              Mã khách: {visitor.visitorCode}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/visitor/${visitor.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">{visitor.fullName}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-muted-foreground">Quốc tịch:</span>
                      <p className="font-medium">{visitor.nationality}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Số hộ chiếu:</span>
                      <p className="font-medium">{visitor.passportNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Giới tính:</span>
                      <p className="font-medium">{GENDER_LABELS[visitor.gender] || visitor.gender}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày sinh:</span>
                      <p className="font-medium">{formatDate(visitor.dateOfBirth)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Chức danh:</span>
                    <p className="font-medium">{visitor.position}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cơ quan:</span>
                    <p className="font-medium">{visitor.organization}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{visitor.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <p className="font-medium">{visitor.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin chuyến thăm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Thời gian đến:</span>
                    <p className="font-medium">{formatDateTime(visitor.arrivalDateTime)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thời gian rời:</span>
                    <p className="font-medium">{formatDateTime(visitor.departureDateTime)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Đơn vị mời:</span>
                    <p className="font-medium">{visitor.invitingUnit}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Mục đích:</span>
                    <Badge variant="secondary" className="ml-2">
                      {PURPOSE_LABELS[visitor.purpose] || visitor.purpose}
                    </Badge>
                  </div>
                  {visitor.purposeDetails && (
                    <div>
                      <span className="text-muted-foreground">Chi tiết mục đích:</span>
                      <p className="font-medium mt-1">{visitor.purposeDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-muted-foreground">Mã khách:</span>
                <p className="font-medium">{visitor.visitorCode}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ngày tạo:</span>
                <p className="font-medium">{formatDateTime(visitor.createdAt)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                <p className="font-medium">{formatDateTime(visitor.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          {(visitor.passportScanPath || visitor.documentPath) && (
            <Card>
              <CardHeader>
                <CardTitle>Tài liệu đính kèm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {visitor.passportScanPath && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4" />
                      <span className="text-sm">Scan hộ chiếu</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(visitor.passportScanPath!, 'passport-scan')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {visitor.documentPath && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Tài liệu khác</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(visitor.documentPath!, 'document')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
