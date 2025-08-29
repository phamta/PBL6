'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  User,
  ArrowRight,
  Bell,
  Settings
} from 'lucide-react'
import { visaExtensionAPI, VisaExtension, VisaExtensionStatus } from '@/lib/visa-extension-api'
import { toast } from '@/components/ui/use-toast'

interface DashboardStats {
  totalApplications: number
  pending: number
  approved: number
  expiringSoon: number
  recentApplications: VisaExtension[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // In a real app, this would be a single dashboard API call
      const [applicationsResponse, expiringResponse] = await Promise.all([
        visaExtensionAPI.getVisaExtensions({ limit: '5', sortBy: 'createdAt', sortOrder: 'DESC' }),
        visaExtensionAPI.getExpiringSoon(30)
      ])
      
      const applications: VisaExtension[] = applicationsResponse.data.data
      const expiring = expiringResponse.data
      
      // Calculate stats from the data
      const pending = applications.filter(app => 
        app.status === VisaExtensionStatus.SUBMITTED || 
        app.status === VisaExtensionStatus.UNDER_REVIEW
      ).length
      
      const approved = applications.filter(app => 
        app.status === VisaExtensionStatus.APPROVED || 
        app.status === VisaExtensionStatus.EXTENDED
      ).length
      
      setStats({
        totalApplications: applicationsResponse.data.total,
        pending,
        approved,
        expiringSoon: expiring.length,
        recentApplications: applications,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusProgress = (status: VisaExtensionStatus) => {
    switch (status) {
      case VisaExtensionStatus.DRAFT:
        return 10
      case VisaExtensionStatus.SUBMITTED:
        return 25
      case VisaExtensionStatus.UNDER_REVIEW:
        return 50
      case VisaExtensionStatus.ADDITIONAL_REQUIRED:
        return 40
      case VisaExtensionStatus.PENDING:
        return 75
      case VisaExtensionStatus.APPROVED:
        return 90
      case VisaExtensionStatus.EXTENDED:
        return 100
      default:
        return 0
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Visa Extension Portal</h1>
        <p className="text-gray-600">Manage your visa extension applications efficiently</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/visa-extension/create">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">New Application</h3>
                  <p className="text-sm text-gray-600">Start a new visa extension</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/visa-extension">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Applications</h3>
                  <p className="text-sm text-gray-600">Check application status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/visa-extension/statistics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Statistics</h3>
                  <p className="text-sm text-gray-600">View analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">All time applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Successfully approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Link href="/dashboard/visa-extension">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats && stats.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {stats.recentApplications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{application.fullName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>#{application.applicationNumber}</span>
                        <span className="capitalize">{application.visaType}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{getStatusProgress(application.status)}%</span>
                        </div>
                        <Progress value={getStatusProgress(application.status)} className="h-1" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No applications yet</p>
                <Link href="/dashboard/visa-extension/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Application
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && stats.expiringSoon > 0 && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Visas Expiring Soon</p>
                    <p className="text-sm text-orange-700">
                      {stats.expiringSoon} visa(s) will expire in the next 30 days. Consider applying for extension.
                    </p>
                  </div>
                </div>
              )}

              {stats && stats.pending > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Applications Under Review</p>
                    <p className="text-sm text-blue-700">
                      You have {stats.pending} application(s) pending review.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">System Status</p>
                  <p className="text-sm text-green-700">
                    All systems are operational. You can submit applications normally.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
