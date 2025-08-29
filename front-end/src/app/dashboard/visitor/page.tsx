'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Calendar
} from 'lucide-react'
import { visitorAPI, Visitor, VisitorListResponse, VisitorQuery } from '@/lib/visitor-api'

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

export default function VisitorListPage() {
  const router = useRouter()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      const query: VisitorQuery = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        invitingUnit: selectedUnit || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }

      const response = await visitorAPI.getVisitors(query)
      setVisitors(response.data)
      setTotalPages(response.totalPages)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khách',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  }, [currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchVisitors()
  }

  const handleFilter = () => {
    setCurrentPage(1)
    fetchVisitors()
  }

  const handleDeleteConfirm = async (visitor: Visitor) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa khách ${visitor.fullName}? Hành động này không thể hoàn tác.`)
    
    if (!confirmed) return

    try {
      await visitorAPI.deleteVisitor(visitor.id)
      toast({
        title: 'Thành công',
        description: 'Xóa khách thành công',
      })
      fetchVisitors()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa khách',
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Khách Quốc Tế</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin đoàn vào và khách quốc tế
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/visitor/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm khách mới
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Tìm theo tên, số hộ chiếu, cơ quan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div>
              <Input
                type="date"
                placeholder="Từ ngày"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                placeholder="Đến ngày"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <Input
                placeholder="Lọc theo đơn vị mời"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleFilter}>
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/visitor/report')}
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitor Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách quốc tế</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : visitors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có khách nào</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã khách</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Quốc tịch</TableHead>
                    <TableHead>Số hộ chiếu</TableHead>
                    <TableHead>Cơ quan</TableHead>
                    <TableHead>Thời gian đến</TableHead>
                    <TableHead>Đơn vị mời</TableHead>
                    <TableHead>Mục đích</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">
                        {visitor.visitorCode}
                      </TableCell>
                      <TableCell>{visitor.fullName}</TableCell>
                      <TableCell>{visitor.nationality}</TableCell>
                      <TableCell>{visitor.passportNumber}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {visitor.organization}
                      </TableCell>
                      <TableCell>{formatDateTime(visitor.arrivalDateTime)}</TableCell>
                      <TableCell>{visitor.invitingUnit}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {PURPOSE_LABELS[visitor.purpose] || visitor.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/visitor/${visitor.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/visitor/${visitor.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteConfirm(visitor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
