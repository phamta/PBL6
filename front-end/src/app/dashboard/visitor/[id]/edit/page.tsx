'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VisitorForm from '@/components/visitor/VisitorForm'
import { visitorAPI, Visitor } from '@/lib/visitor-api'
import { toast } from '@/components/ui/use-toast'

export default function EditVisitorPage() {
  const params = useParams()
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        setLoading(true)
        const response = await visitorAPI.getVisitor(params.id as string)
        setVisitor(response)
      } catch (error: any) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin khách',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchVisitor()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    )
  }

  if (!visitor) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Không tìm thấy khách</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa thông tin khách</h1>
        <p className="text-muted-foreground">
          Mã khách: {visitor.visitorCode} - Cập nhật thông tin khách quốc tế
        </p>
      </div>
      
      <VisitorForm 
        initialData={visitor} 
        isEditing={true} 
        visitorId={params.id as string}
      />
    </div>
  )
}
