'use client'

import VisitorForm from '@/components/visitor/VisitorForm'

export default function CreateVisitorPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Thêm Khách Mới</h1>
        <p className="text-muted-foreground">
          Thêm thông tin khách quốc tế mới vào hệ thống
        </p>
      </div>
      
      <VisitorForm />
    </div>
  )
}
