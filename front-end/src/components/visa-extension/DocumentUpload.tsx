'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  File, 
  X, 
  Download, 
  Check, 
  AlertCircle,
  Image as ImageIcon,
  FileText as FileTextIcon
} from 'lucide-react'
import { visaExtensionAPI, DocumentType } from '@/lib/visa-extension-api'
import { toast } from '@/components/ui/use-toast'

interface DocumentUploadProps {
  applicationId: string
  existingDocuments?: Array<{
    id: string
    documentType: DocumentType
    filename: string
    originalName: string
    mimeType: string
    size: number
    isVerified: boolean
    verificationNote?: string
    createdAt: string
  }>
  onDocumentUploaded?: () => void
  onDocumentDeleted?: () => void
  readOnly?: boolean
}

const DOCUMENT_TYPE_LABELS = {
  [DocumentType.PASSPORT]: 'Passport Copy',
  [DocumentType.CURRENT_VISA]: 'Current Visa Copy',
  [DocumentType.PHOTO]: 'Passport Photo',
  [DocumentType.FINANCIAL_PROOF]: 'Financial Proof',
  [DocumentType.INTRODUCTION_LETTER]: 'Introduction Letter',
  [DocumentType.STUDY_CERTIFICATE]: 'Study Certificate',
  [DocumentType.ACCOMMODATION_PROOF]: 'Accommodation Proof',
  [DocumentType.HEALTH_INSURANCE]: 'Health Insurance',
  [DocumentType.OTHER]: 'Other Document',
}

const REQUIRED_DOCUMENTS = [
  DocumentType.PASSPORT,
  DocumentType.CURRENT_VISA,
  DocumentType.PHOTO,
  DocumentType.FINANCIAL_PROOF,
]

export default function DocumentUpload({
  applicationId,
  existingDocuments = [],
  onDocumentUploaded,
  onDocumentDeleted,
  readOnly = false,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | ''>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList) => {
    if (!selectedDocumentType) {
      toast({
        title: 'Document Type Required',
        description: 'Please select a document type before uploading',
        variant: 'destructive',
      })
      return
    }

    const file = files[0]
    if (!file) return

    uploadFile(file, selectedDocumentType as DocumentType)
  }

  const uploadFile = async (file: File, documentType: DocumentType) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
      ]
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload only JPEG, PNG, or PDF files',
          variant: 'destructive',
        })
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        })
        return
      }

      // Check if document type already exists
      const existingDoc = existingDocuments.find(doc => doc.documentType === documentType)
      if (existingDoc) {
        toast({
          title: 'Document Already Exists',
          description: `A ${DOCUMENT_TYPE_LABELS[documentType]} has already been uploaded. Please delete it first to upload a new one.`,
          variant: 'destructive',
        })
        return
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // TODO: Implement actual upload
      // await visaExtensionAPI.uploadDocument(applicationId, file, documentType)
      console.log('Upload file:', file.name, 'Type:', documentType)
      
      setUploadProgress(100)
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        setSelectedDocumentType('')
        if (onDocumentUploaded) onDocumentUploaded()
        
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
        })
      }, 500)

    } catch (error: any) {
      setUploading(false)
      setUploadProgress(0)
      
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'Failed to upload document',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (documentId: string, documentType: DocumentType) => {
    try {
      await visaExtensionAPI.deleteDocument(applicationId, documentId)
      
      if (onDocumentDeleted) onDocumentDeleted()
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete document',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      // TODO: Implement actual download
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
        title: 'Download Failed',
        description: 'Failed to download document',
        variant: 'destructive',
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileTextIcon className="h-4 w-4" />
  }

  const getDocumentStatus = (documentType: DocumentType) => {
    const doc = existingDocuments.find(d => d.documentType === documentType)
    const isRequired = REQUIRED_DOCUMENTS.includes(documentType)
    
    if (!doc) {
      return isRequired ? 'required' : 'optional'
    }
    
    if (doc.isVerified) {
      return 'verified'
    }
    
    return 'uploaded'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Verified</Badge>
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>
      case 'required':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Required</Badge>
      case 'optional':
        return <Badge variant="outline">Optional</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        {!readOnly && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={selectedDocumentType}
                onValueChange={(value: any) => setSelectedDocumentType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => {
                    const hasDocument = existingDocuments.some(doc => doc.documentType === value)
                    return (
                      <SelectItem 
                        key={value} 
                        value={value}
                        disabled={hasDocument}
                      >
                        {label} {hasDocument && '(Already uploaded)'}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports: JPEG, PNG, PDF (Max 10MB)
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedDocumentType || uploading}
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              />
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>
        )}

        {/* Document List */}
        <div className="space-y-4">
          <h4 className="font-medium">Document Checklist</h4>
          
          {Object.entries(DOCUMENT_TYPE_LABELS).map(([docType, label]) => {
            const status = getDocumentStatus(docType as DocumentType)
            const document = existingDocuments.find(d => d.documentType === docType)
            
            return (
              <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{label}</span>
                    {getStatusBadge(status)}
                  </div>
                  
                  {document && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getFileIcon(document.mimeType)}
                      <span>{document.originalName}</span>
                      <span>({formatFileSize(document.size)})</span>
                      <span>• Uploaded {formatDate(document.createdAt)}</span>
                    </div>
                  )}
                  
                  {document?.verificationNote && (
                    <p className="text-sm text-blue-600 mt-1">
                      Note: {document.verificationNote}
                    </p>
                  )}
                </div>
                
                {document && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document.id, document.filename)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    {!readOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(document.id, document.documentType)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Requirements Note */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Document Requirements</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• All documents must be clear and legible</li>
            <li>• Photos must be in color and passport-style</li>
            <li>• File size limit: 10MB per document</li>
            <li>• Accepted formats: JPEG, PNG, PDF</li>
            <li>• Required documents must be uploaded before submission</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
