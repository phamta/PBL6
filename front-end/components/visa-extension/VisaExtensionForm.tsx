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
import { visaExtensionAPI, CreateVisaExtensionDto, VisaType, StudyProgram } from '@/lib/visa-extension-api'

interface VisaExtensionFormProps {
  initialData?: Partial<CreateVisaExtensionDto>
  isEditing?: boolean
  applicationId?: string
}

const VISA_TYPE_OPTIONS = [
  { value: VisaType.TOURIST, label: 'Tourist' },
  { value: VisaType.BUSINESS, label: 'Business' },
  { value: VisaType.STUDENT, label: 'Student' },
  { value: VisaType.WORK, label: 'Work' },
  { value: VisaType.DIPLOMATIC, label: 'Diplomatic' },
  { value: VisaType.TRANSIT, label: 'Transit' },
]

const STUDY_PROGRAM_OPTIONS = [
  { value: StudyProgram.UNDERGRADUATE, label: 'Undergraduate' },
  { value: StudyProgram.GRADUATE, label: 'Graduate' },
  { value: StudyProgram.POSTGRADUATE, label: 'Postgraduate' },
  { value: StudyProgram.EXCHANGE, label: 'Exchange' },
  { value: StudyProgram.SHORT_TERM, label: 'Short Term' },
  { value: StudyProgram.RESEARCH, label: 'Research' },
]

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

export default function VisaExtensionForm({ initialData, isEditing, applicationId }: VisaExtensionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateVisaExtensionDto>({
    fullName: initialData?.fullName || '',
    passportNumber: initialData?.passportNumber || '',
    passportIssueDate: initialData?.passportIssueDate || '',
    passportExpiryDate: initialData?.passportExpiryDate || '',
    passportIssuePlace: initialData?.passportIssuePlace || '',
    nationality: initialData?.nationality || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || '',
    currentVisaNumber: initialData?.currentVisaNumber || '',
    visaType: initialData?.visaType || VisaType.STUDENT,
    visaIssueDate: initialData?.visaIssueDate || '',
    visaExpiryDate: initialData?.visaExpiryDate || '',
    visaIssuePlace: initialData?.visaIssuePlace || '',
    studyProgram: initialData?.studyProgram,
    universityName: initialData?.universityName || '',
    programDuration: initialData?.programDuration || '',
    expectedGraduationDate: initialData?.expectedGraduationDate || '',
    reasonForExtension: initialData?.reasonForExtension || '',
    requestedExtensionPeriod: initialData?.requestedExtensionPeriod || '',
    contactAddress: initialData?.contactAddress || '',
    contactPhone: initialData?.contactPhone || '',
    contactEmail: initialData?.contactEmail || '',
    notes: initialData?.notes || '',
  })

  const handleInputChange = (field: keyof CreateVisaExtensionDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing && applicationId) {
        await visaExtensionAPI.updateVisaExtension(applicationId, formData)
        toast({
          title: 'Success',
          description: 'Visa extension application updated successfully',
        })
      } else {
        const response = await visaExtensionAPI.createVisaExtension(formData)
        toast({
          title: 'Success',
          description: 'Visa extension application created successfully',
        })
        router.push(`/dashboard/visa-extension/${response.data.id}`)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const isStudentVisa = formData.visaType === VisaType.STUDENT

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
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
            <div>
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passport Information */}
      <Card>
        <CardHeader>
          <CardTitle>Passport Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passportNumber">Passport Number *</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="passportIssuePlace">Passport Issue Place *</Label>
              <Input
                id="passportIssuePlace"
                value={formData.passportIssuePlace}
                onChange={(e) => handleInputChange('passportIssuePlace', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="passportIssueDate">Passport Issue Date *</Label>
              <Input
                id="passportIssueDate"
                type="date"
                value={formData.passportIssueDate}
                onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="passportExpiryDate">Passport Expiry Date *</Label>
              <Input
                id="passportExpiryDate"
                type="date"
                value={formData.passportExpiryDate}
                onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Visa Information */}
      <Card>
        <CardHeader>
          <CardTitle>Current Visa Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentVisaNumber">Current Visa Number *</Label>
              <Input
                id="currentVisaNumber"
                value={formData.currentVisaNumber}
                onChange={(e) => handleInputChange('currentVisaNumber', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="visaType">Visa Type *</Label>
              <Select value={formData.visaType} onValueChange={(value) => handleInputChange('visaType', value as VisaType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="visaIssueDate">Visa Issue Date *</Label>
              <Input
                id="visaIssueDate"
                type="date"
                value={formData.visaIssueDate}
                onChange={(e) => handleInputChange('visaIssueDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="visaExpiryDate">Visa Expiry Date *</Label>
              <Input
                id="visaExpiryDate"
                type="date"
                value={formData.visaExpiryDate}
                onChange={(e) => handleInputChange('visaExpiryDate', e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="visaIssuePlace">Visa Issue Place *</Label>
              <Input
                id="visaIssuePlace"
                value={formData.visaIssuePlace}
                onChange={(e) => handleInputChange('visaIssuePlace', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Information (only for student visa) */}
      {isStudentVisa && (
        <Card>
          <CardHeader>
            <CardTitle>Study Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studyProgram">Study Program</Label>
                <Select 
                  value={formData.studyProgram || ''} 
                  onValueChange={(value) => handleInputChange('studyProgram', value as StudyProgram)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select study program" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_PROGRAM_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="universityName">University Name</Label>
                <Input
                  id="universityName"
                  value={formData.universityName}
                  onChange={(e) => handleInputChange('universityName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="programDuration">Program Duration</Label>
                <Input
                  id="programDuration"
                  placeholder="e.g., 4 years"
                  value={formData.programDuration}
                  onChange={(e) => handleInputChange('programDuration', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expectedGraduationDate">Expected Graduation Date</Label>
                <Input
                  id="expectedGraduationDate"
                  type="date"
                  value={formData.expectedGraduationDate}
                  onChange={(e) => handleInputChange('expectedGraduationDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extension Details */}
      <Card>
        <CardHeader>
          <CardTitle>Extension Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reasonForExtension">Reason for Extension *</Label>
            <Textarea
              id="reasonForExtension"
              placeholder="Please provide detailed reason for visa extension..."
              value={formData.reasonForExtension}
              onChange={(e) => handleInputChange('reasonForExtension', e.target.value)}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="requestedExtensionPeriod">Requested Extension Period *</Label>
            <Input
              id="requestedExtensionPeriod"
              placeholder="e.g., 6 months, 1 year"
              value={formData.requestedExtensionPeriod}
              onChange={(e) => handleInputChange('requestedExtensionPeriod', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contactAddress">Contact Address *</Label>
            <Textarea
              id="contactAddress"
              value={formData.contactAddress}
              onChange={(e) => handleInputChange('contactAddress', e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Application' : 'Create Application'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
