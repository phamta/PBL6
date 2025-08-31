'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import Link from 'next/link';

export default function UserVisaPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Visa</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý đơn xin visa
          </p>
        </div>
        <Link href="/dashboard/user/visa/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Danh sách đơn Visa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Tính năng đang được phát triển
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
