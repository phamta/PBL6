'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { visaExtensionAPI, VisaExtension, VisaExtensionStatus, VisaExtensionHistory } from '@/lib/visa-extension-api'
import { toast } from '@/components/ui/use-toast'

const STATUS_PROGRESS = {
  [VisaExtensionStatus.DRAFT]: 10,
  [VisaExtensionStatus.SUBMITTED]: 25,
  [VisaExtensionStatus.UNDER_REVIEW]: 50,
  [VisaExtensionStatus.ADDITIONAL_REQUIRED]: 40,
  [VisaExtensionStatus.PENDING]: 75,
  [VisaExtensionStatus.APPROVED]: 90,
  [VisaExtensionStatus.REJECTED]: 100,
  [VisaExtensionStatus.EXTENDED]: 100,
}

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

const STATUS_ICONS = {
  [VisaExtensionStatus.DRAFT]: Edit,
  [VisaExtensionStatus.SUBMITTED]: Send,
  [VisaExtensionStatus.UNDER_REVIEW]: Clock,
  [VisaExtensionStatus.ADDITIONAL_REQUIRED]: AlertCircle,
  [VisaExtensionStatus.PENDING]: Clock,
  [VisaExtensionStatus.APPROVED]: CheckCircle,
  [VisaExtensionStatus.REJECTED]: XCircle,
  [VisaExtensionStatus.EXTENDED]: CheckCircle,
}

export default function VisaExtensionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<VisaExtension | null>(null)
  const [history, setHistory] = useState<VisaExtensionHistory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await visaExtensionAPI.getVisaExtension(params.id as string)
      setApplication(response.data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch visa extension application',
        variant: 'destructive',
      })
      router.push('/dashboard/visa-extension')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      // This would be a separate API call if implemented
      // const response = await visaExtensionAPI.getApplicationHistory(params.id as string)
      // setHistory(response.data)
    } catch (error: any) {
      console.error('Failed to fetch history:', error)
    }
  }

  useEffect(() => {
    fetchApplication()
    fetchHistory()
  }, [params.id])

  const handleSubmit = async () => {
    if (!application) return

    try {
      // TODO: Fix API method name
      // await visaExtensionAPI.submitVisaExtension(application.id)
      console.log('Submit application:', application.id)
      
      toast({
        title: 'Success',
        description: 'Application submitted successfully',
      })
      fetchApplication()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadge = (status: VisaExtensionStatus) => {
    const StatusIcon = STATUS_ICONS[status]
    return (
      <Badge className={STATUS_COLORS[status]}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {STATUS_LABELS[status]}
      </Badge>
    )
  }

  const downloadDocument = async (documentId: string, filename: string) => {
    try {
      // TODO: Fix API method name
      // const response = await visaExtensionAPI.downloadDocument(documentId)
      console.log('Download document:', documentId, filename)
      
      toast({
        title: 'Download',
        description: 'Download functionality will be implemented',
      })
      
      // // Create blob and download
      // const blob = new Blob([response.data])
      // const url = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = url
      // link.download = filename
      // document.body.appendChild(link)
      // link.click()
      // link.remove()
      // window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Application not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Visa Extension Application</h1>
          <p className="text-muted-foreground">Application #{application.applicationNumber}</p>
        </div>
        <div className="flex gap-2">
          {application.status === VisaExtensionStatus.DRAFT && (
            <>
              <Button variant="outline" onClick={() => router.push(`/dashboard/visa-extension/${application.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Progress */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Application Status</CardTitle>
            {getStatusBadge(application.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all" 
                style={{ width: `${STATUS_PROGRESS[application.status]}%` }}
              ></div>
            </div>
            {/* {application.statusReason && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Status Note:</p>
                <p className="text-sm text-blue-700">{application.statusReason}</p>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{application.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="font-medium">{formatDate(application.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                  <p className="font-medium">{application.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="font-medium capitalize">{application.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passport Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Passport Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Passport Number</label>
                  <p className="font-medium">{application.passportNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Passport Expiry</label>
                  <p className="font-medium">{formatDate(application.passportExpiryDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Country of Issue</label>
                  <p className="font-medium">{application.nationality}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Visa Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Visa Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Visa Type</label>
                  <p className="font-medium capitalize">{application.visaType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Visa Number</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entry Date</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Expiry</label>
                  <p className="font-medium">{formatDate(application.visaExpiryDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extension Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Extension Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Extension Type</label>
                  <p className="font-medium">Standard Extension</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Extension Duration</label>
                  <p className="font-medium">6 months</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Proposed Extension Date</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Extension Fee</label>
                  <p className="font-medium">$150</p>
                </div>
              </div>
              {/* {application.extensionReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason for Extension</label>
                  <p className="font-medium">{application.extensionReason}</p>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">user@example.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="font-medium">123 Main Street, City, State 12345</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents && application.documents.length > 0 ? (
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{doc.documentType}</p>
                        <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc.id, doc.fileName)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No documents uploaded</p>
              )}
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Application Created</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(application.createdAt)}</p>
                  </div>
                </div>
                {application.submissionDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Application Submitted</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(application.submissionDate)}</p>
                    </div>
                  </div>
                )}
                {application.reviewDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Under Review</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(application.reviewDate)}</p>
                    </div>
                  </div>
                )}
                {application.approvalDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Application Approved</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(application.approvalDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {application.paymentStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant={application.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {application.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Amount:</span>
                    <span className="font-medium">$150</span>
                  </div>
                  {application.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-sm">Paid Date:</span>
                      <span className="text-sm">{formatDate(application.paymentDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
