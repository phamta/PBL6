'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Filter, FileText, Calendar, User, Clock } from 'lucide-react'
import { visaExtensionAPI, VisaExtension, VisaExtensionStatus, VisaType, VisaExtensionFilterDto } from '@/lib/visa-extension-api'
import { toast } from '@/components/ui/use-toast'

const STATUS_COLORS = {
  [VisaExtensionStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [VisaExtensionStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
  [VisaExtensionStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
  [VisaExtensionStatus.ADDITIONAL_REQUIRED]: 'bg-orange-100 text-orange-800',
  [VisaExtensionStatus.PENDING]: 'bg-purple-100 text-purple-800',
  [VisaExtensionStatus.APPROVED]: 'bg-green-100 text-green-800',
  [VisaExtensionStatus.REJECTED]: 'bg-red-100 text-red-800',
  [VisaExtensionStatus.EXTENDED]: 'bg-emerald-100 text-emerald-800',
}

const STATUS_LABELS = {
  [VisaExtensionStatus.DRAFT]: 'Draft',
  [VisaExtensionStatus.SUBMITTED]: 'Submitted',
  [VisaExtensionStatus.UNDER_REVIEW]: 'Under Review',
  [VisaExtensionStatus.ADDITIONAL_REQUIRED]: 'Additional Required',
  [VisaExtensionStatus.PENDING]: 'Pending',
  [VisaExtensionStatus.APPROVED]: 'Approved',
  [VisaExtensionStatus.REJECTED]: 'Rejected',
  [VisaExtensionStatus.EXTENDED]: 'Extended',
}

export default function VisaExtensionListPage() {
  const [applications, setApplications] = useState<VisaExtension[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filters, setFilters] = useState<VisaExtensionFilterDto>({
    page: '1',
    limit: '10',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await visaExtensionAPI.getVisaExtensions(filters)
      setApplications(response.data.data)
      setTotal(response.data.total)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch visa extension applications',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [filters])

  const handleFilterChange = (key: keyof VisaExtensionFilterDto, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: '1', // Reset to first page when filtering
    }))
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setFilters(prev => ({
      ...prev,
      page: newPage.toString(),
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: VisaExtensionStatus) => {
    return (
      <Badge className={STATUS_COLORS[status]}>
        {STATUS_LABELS[status]}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Visa Extension Applications</h1>
          <p className="text-muted-foreground">Manage your visa extension applications</p>
        </div>
        <Link href="/dashboard/visa-extension/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search applications..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.visaType || ''}
                onValueChange={(value) => handleFilterChange('visaType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Visa Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Visa Types</SelectItem>
                  <SelectItem value={VisaType.TOURIST}>Tourist</SelectItem>
                  <SelectItem value={VisaType.BUSINESS}>Business</SelectItem>
                  <SelectItem value={VisaType.STUDENT}>Student</SelectItem>
                  <SelectItem value={VisaType.WORK}>Work</SelectItem>
                  <SelectItem value={VisaType.DIPLOMATIC}>Diplomatic</SelectItem>
                  <SelectItem value={VisaType.TRANSIT}>Transit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Nationality"
                value={filters.nationality || ''}
                onChange={(e) => handleFilterChange('nationality', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-muted-foreground">Create your first visa extension application</p>
              <Link href="/dashboard/visa-extension/create">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Application
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application Number</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Visa Type</TableHead>
                    <TableHead>Current Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/visa-extension/${application.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {application.applicationNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {application.fullName}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{application.visaType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(application.visaExpiryDate)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        {application.submissionDate ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDate(application.submissionDate)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/visa-extension/${application.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          {application.status === VisaExtensionStatus.DRAFT && (
                            <Link href={`/dashboard/visa-extension/${application.id}/edit`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page * limit >= total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
