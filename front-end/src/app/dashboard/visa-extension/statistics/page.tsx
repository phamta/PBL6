'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { visaExtensionAPI, VisaExtension, VisaExtensionStatus } from '@/lib/visa-extension-api'
import { toast } from '@/components/ui/use-toast'

interface Statistics {
  totalApplications: number
  pendingReview: number
  approved: number
  rejected: number
  expiringSoon: number
  averageProcessingDays: number
  applicationsByStatus: Record<VisaExtensionStatus, number>
  applicationsByMonth: Array<{
    month: string
    count: number
  }>
  applicationsByNationality: Array<{
    nationality: string
    count: number
  }>
  recentApplications: VisaExtension[]
}

export default function VisaExtensionStatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [expiringApplications, setExpiringApplications] = useState<VisaExtension[]>([])
  const [loading, setLoading] = useState(true)
  const [expiringDays, setExpiringDays] = useState(30)

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const [statsResponse, expiringResponse] = await Promise.all([
        visaExtensionAPI.getStatistics(),
        visaExtensionAPI.getExpiringSoon(expiringDays)
      ])
      
      setStatistics(statsResponse.data)
      setExpiringApplications(expiringResponse.data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [expiringDays])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: VisaExtensionStatus) => {
    switch (status) {
      case VisaExtensionStatus.APPROVED:
      case VisaExtensionStatus.EXTENDED:
        return 'bg-green-100 text-green-800'
      case VisaExtensionStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case VisaExtensionStatus.UNDER_REVIEW:
      case VisaExtensionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case VisaExtensionStatus.ADDITIONAL_REQUIRED:
        return 'bg-orange-100 text-orange-800'
      case VisaExtensionStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = async () => {
    try {
      // This would be implemented in the backend
      toast({
        title: 'Export Started',
        description: 'Your data export will be ready shortly',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Loading statistics...</div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Failed to load statistics</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Visa Extension Statistics</h1>
          <p className="text-muted-foreground">Overview of visa extension applications and trends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStatistics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              All time applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statistics.pendingReview}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistics.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              Next {expiringDays} days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Applications by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(statistics.applicationsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(status as VisaExtensionStatus)}>
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications by Nationality */}
        <Card>
          <CardHeader>
            <CardTitle>Top Nationalities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.applicationsByNationality.slice(0, 10).map((item) => (
                <div key={item.nationality} className="flex items-center justify-between">
                  <span className="font-medium">{item.nationality}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Applications */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Expiring Applications
            </CardTitle>
            <Select
              value={expiringDays.toString()}
              onValueChange={(value) => setExpiringDays(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Next 7 days</SelectItem>
                <SelectItem value="15">Next 15 days</SelectItem>
                <SelectItem value="30">Next 30 days</SelectItem>
                <SelectItem value="60">Next 60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {expiringApplications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No applications expiring in the next {expiringDays} days
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application Number</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Current Expiry</TableHead>
                    <TableHead>Days Until Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringApplications.map((application) => {
                    const daysUntilExpiry = Math.ceil(
                      (new Date(application.visaExpiryDate).getTime() - new Date().getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )
                    
                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.applicationNumber}
                        </TableCell>
                        <TableCell>{application.fullName}</TableCell>
                        <TableCell>{application.nationality}</TableCell>
                        <TableCell>{formatDate(application.visaExpiryDate)}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            daysUntilExpiry <= 7 ? 'text-red-600' : 
                            daysUntilExpiry <= 15 ? 'text-orange-600' : 
                            'text-yellow-600'
                          }`}>
                            {daysUntilExpiry} days
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Send Reminder
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application Number</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Visa Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.recentApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.applicationNumber}
                    </TableCell>
                    <TableCell>{application.fullName}</TableCell>
                    <TableCell>{application.nationality}</TableCell>
                    <TableCell className="capitalize">{application.visaType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.submissionDate ? formatDate(application.submissionDate) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
