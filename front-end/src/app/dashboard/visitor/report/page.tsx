'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react'
import { visitorAPI, VisitorReportDto, ReportFormat, ReportPeriod } from '@/lib/visitor-api'

const FORMAT_OPTIONS = [
  { value: ReportFormat.EXCEL, label: 'Excel (.xlsx)', icon: FileSpreadsheet },
  { value: ReportFormat.PDF, label: 'PDF (.pdf)', icon: FileText },
  { value: ReportFormat.WORD, label: 'Word (.doc)', icon: FileText },
]

const PERIOD_OPTIONS = [
  { value: ReportPeriod.CUSTOM, label: 'Tùy chọn thời gian' },
  { value: ReportPeriod.MONTHLY, label: 'Theo tháng' },
  { value: ReportPeriod.QUARTERLY, label: 'Theo quý' },
  { value: ReportPeriod.YEARLY, label: 'Theo năm' },
]

const QUARTER_OPTIONS = [
  { value: '1', label: 'Quý 1 (T1-T3)' },
  { value: '2', label: 'Quý 2 (T4-T6)' },
  { value: '3', label: 'Quý 3 (T7-T9)' },
  { value: '4', label: 'Quý 4 (T10-T12)' },
]

const MONTH_OPTIONS = [
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
]

export default function VisitorReportPage() {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<VisitorReportDto>({
    period: ReportPeriod.CUSTOM,
    format: ReportFormat.EXCEL,
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3).toString(),
  })

  const handleInputChange = (field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateReport = async () => {
    try {
      setLoading(true)

      // Validate required fields
      if (reportData.period === ReportPeriod.CUSTOM) {
        if (!reportData.startDate || !reportData.endDate) {
          toast({
            title: 'Lỗi',
            description: 'Vui lòng chọn khoảng thời gian',
            variant: 'destructive',
          })
          return
        }
      }

      const blob = await visitorAPI.generateReport(reportData)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0]
      const formatExt = reportData.format === ReportFormat.EXCEL ? 'xlsx' : 
                       reportData.format === ReportFormat.PDF ? 'pdf' : 'doc'
      a.download = `bao-cao-khach-quoc-te-${timestamp}.${formatExt}`
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Thành công',
        description: 'Xuất báo cáo thành công',
      })
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất báo cáo',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Xuất Báo Cáo</h1>
        <p className="text-muted-foreground">
          Tạo báo cáo thống kê khách quốc tế theo nhiều định dạng khác nhau
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Thiết lập báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Period */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="period">Khoảng thời gian</Label>
                  <Select
                    value={reportData.period}
                    onValueChange={(value) => handleInputChange('period', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIOD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Date Range */}
                {reportData.period === ReportPeriod.CUSTOM && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Từ ngày</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={reportData.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Đến ngày</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={reportData.endDate || ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Year Selection */}
                {reportData.period !== ReportPeriod.CUSTOM && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="year">Năm</Label>
                      <Select
                        value={reportData.year}
                        onValueChange={(value) => handleInputChange('year', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Month Selection */}
                    {reportData.period === ReportPeriod.MONTHLY && (
                      <div>
                        <Label htmlFor="month">Tháng</Label>
                        <Select
                          value={reportData.month}
                          onValueChange={(value) => handleInputChange('month', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tháng" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTH_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Quarter Selection */}
                    {reportData.period === ReportPeriod.QUARTERLY && (
                      <div>
                        <Label htmlFor="quarter">Quý</Label>
                        <Select
                          value={reportData.quarter}
                          onValueChange={(value) => handleInputChange('quarter', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quý" />
                          </SelectTrigger>
                          <SelectContent>
                            {QUARTER_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Filter Options */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invitingUnit">Lọc theo đơn vị mời (tùy chọn)</Label>
                  <Input
                    id="invitingUnit"
                    value={reportData.invitingUnit || ''}
                    onChange={(e) => handleInputChange('invitingUnit', e.target.value)}
                    placeholder="Nhập tên đơn vị mời"
                  />
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-4">
                <Label>Định dạng xuất</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FORMAT_OPTIONS.map((format) => {
                    const IconComponent = format.icon
                    return (
                      <div
                        key={format.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          reportData.format === format.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleInputChange('format', format.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-6 w-6" />
                          <span className="font-medium">{format.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Xem trước báo cáo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian:</span>
                  <span className="font-medium">
                    {reportData.period === ReportPeriod.CUSTOM
                      ? `${reportData.startDate || 'N/A'} - ${reportData.endDate || 'N/A'}`
                      : reportData.period === ReportPeriod.MONTHLY
                      ? `Tháng ${reportData.month}/${reportData.year}`
                      : reportData.period === ReportPeriod.QUARTERLY
                      ? `Quý ${reportData.quarter}/${reportData.year}`
                      : `Năm ${reportData.year}`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn vị:</span>
                  <span className="font-medium">
                    {reportData.invitingUnit || 'Tất cả'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Định dạng:</span>
                  <span className="font-medium">
                    {FORMAT_OPTIONS.find(f => f.value === reportData.format)?.label}
                  </span>
                </div>
              </div>

              <Button 
                onClick={generateReport} 
                disabled={loading}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Đang xuất...' : 'Xuất báo cáo'}
              </Button>

              <div className="text-xs text-muted-foreground">
                <p>Báo cáo sẽ bao gồm:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Danh sách khách quốc tế</li>
                  <li>Thông tin cá nhân và liên hệ</li>
                  <li>Thông tin chuyến thăm</li>
                  <li>Thống kê theo đơn vị mời</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
