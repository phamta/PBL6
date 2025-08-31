'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function UserTranslationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dịch thuật</h1>
          <p className="text-muted-foreground">
            Yêu cầu dịch thuật và chứng thực tài liệu
          </p>
        </div>
        <Link href="/dashboard/user/translation/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yêu cầu dịch mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Danh sách yêu cầu dịch thuật
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
