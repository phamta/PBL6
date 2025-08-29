'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VisaExtensionForm from '@/components/visa-extension/VisaExtensionForm'
import { visaExtensionAPI, VisaExtension } from '@/lib/visa-extension-api'
import { toast } from '@/components/ui/use-toast'

export default function EditVisaExtensionPage() {
  const params = useParams()
  const [application, setApplication] = useState<VisaExtension | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [params.id])

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Visa Extension Application</h1>
        <p className="text-muted-foreground">
          Application #{application.applicationNumber} - Update your visa extension application
        </p>
      </div>
      
      <VisaExtensionForm initialData={application} isEditing={true} applicationId={params.id as string} />
    </div>
  )
}
