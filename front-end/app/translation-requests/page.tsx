'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TranslationRequestList from '@/components/translation-request/TranslationRequestList';
import TranslationRequestDetail from '@/components/translation-request/TranslationRequestDetail';
import TranslationRequestForm from '@/components/translation-request/TranslationRequestForm';
import { TranslationRequest } from '@/lib/types/translation-request';

type ViewMode = 'list' | 'detail' | 'create';

export default function TranslationRequestPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRequest, setSelectedRequest] = useState<TranslationRequest | null>(null);
  
  // In a real app, this would come from authentication context
  const userRole = 'KHCN_DN'; // or 'USER' - can be changed for testing

  const handleSelectRequest = (request: TranslationRequest) => {
    setSelectedRequest(request);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setViewMode('list');
  };

  const handleCreateSuccess = () => {
    setViewMode('list');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Xác Nhận Bản Dịch</h1>
          <p className="text-gray-600 mt-2">
            Quản lý yêu cầu xác nhận bản dịch tài liệu
          </p>
        </div>
        
        {viewMode === 'list' && (
          <Button onClick={() => setViewMode('create')}>
            Tạo Yêu Cầu Mới
          </Button>
        )}
      </div>

      {/* Statistics Cards (for KHCN_DN or dashboard view) */}
      {userRole === 'KHCN_DN' && viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Tổng số</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600">Chờ xử lý</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Đang xem xét</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Đã duyệt</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-600">Từ chối</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {viewMode === 'list' && (
          <TranslationRequestList 
            onSelectRequest={handleSelectRequest}
            userRole={userRole}
          />
        )}

        {viewMode === 'detail' && selectedRequest && (
          <TranslationRequestDetail
            requestId={selectedRequest.id}
            userRole={userRole}
            onUpdate={handleBackToList}
            onBack={handleBackToList}
          />
        )}

        {viewMode === 'create' && (
          <TranslationRequestForm
            onSuccess={handleCreateSuccess}
            onCancel={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}
