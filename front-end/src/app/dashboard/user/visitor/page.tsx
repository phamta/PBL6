'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function UserVisitorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khách thăm</h1>
          <p className="text-muted-foreground">
            Đăng ký và quản lý khách thăm quốc tế
          </p>
        </div>
        <Link href="/dashboard/user/visitor/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Đăng ký khách mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Danh sách khách thăm
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
