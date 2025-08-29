'use client'

import VisaExtensionForm from '@/components/visa-extension/VisaExtensionForm'

export default function CreateVisaExtensionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Visa Extension Application</h1>
        <p className="text-muted-foreground">Fill out the form below to submit your visa extension application</p>
      </div>
      
      <VisaExtensionForm />
    </div>
  )
}
