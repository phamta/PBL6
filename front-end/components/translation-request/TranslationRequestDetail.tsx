'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { translationRequestAPI } from '@/lib/api/translation-request';
import { 
  TranslationRequest,
  TranslationStatus,
  TRANSLATION_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  LANGUAGE_PAIR_LABELS 
} from '@/lib/types/translation-request';

interface TranslationRequestDetailProps {
  requestId: string;
  userRole?: string;
  onUpdate?: () => void;
  onBack?: () => void;
}

export default function TranslationRequestDetail({ 
  requestId, 
  userRole, 
  onUpdate, 
  onBack 
}: TranslationRequestDetailProps) {
  const [request, setRequest] = useState<TranslationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await translationRequestAPI.getById(requestId);
      setRequest(response);
    } catch (error) {
      console.error('Error fetching translation request:', error);
      setError('Không thể tải thông tin yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const handleStartReview = async () => {
    if (!request) return;
    
    try {
      setActionLoading(true);
      await translationRequestAPI.startReview(request.id);
      await fetchRequest();
      onUpdate?.();
      alert('Đã bắt đầu xem xét yêu cầu');
    } catch (error) {
      console.error('Error starting review:', error);
      alert('Có lỗi xảy ra khi bắt đầu xem xét');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request) return;
    
    const confirmed = window.confirm('Xác nhận duyệt yêu cầu này?');
    if (!confirmed) return;
    
    try {
      setActionLoading(true);
      await translationRequestAPI.approve(request.id);
      await fetchRequest();
      onUpdate?.();
      alert('Đã duyệt yêu cầu thành công');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Có lỗi xảy ra khi duyệt yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!request || !reviewComments.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    
    const confirmed = window.confirm('Xác nhận từ chối yêu cầu này?');
    if (!confirmed) return;
    
    try {
      setActionLoading(true);
      await translationRequestAPI.reject(request.id, { reviewComments });
      await fetchRequest();
      onUpdate?.();
      alert('Đã từ chối yêu cầu');
      setReviewComments('');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Có lỗi xảy ra khi từ chối yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!request || !reviewComments.trim()) {
      alert('Vui lòng nhập nội dung cần chỉnh sửa');
      return;
    }
    
    const confirmed = window.confirm('Yêu cầu chỉnh sửa tài liệu này?');
    if (!confirmed) return;
    
    try {
      setActionLoading(true);
      await translationRequestAPI.requestRevision(request.id, { reviewComments });
      await fetchRequest();
      onUpdate?.();
      alert('Đã yêu cầu chỉnh sửa');
      setReviewComments('');
    } catch (error) {
      console.error('Error requesting revision:', error);
      alert('Có lỗi xảy ra khi yêu cầu chỉnh sửa');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadOriginal = async () => {
    if (!request) return;
    
    try {
      await translationRequestAPI.downloadOriginalDocument(request.id);
    } catch (error) {
      console.error('Error downloading original document:', error);
      alert('Không thể tải xuống tài liệu gốc');
    }
  };

  const handleDownloadTranslated = async () => {
    if (!request) return;
    
    try {
      await translationRequestAPI.downloadTranslatedDocument(request.id);
    } catch (error) {
      console.error('Error downloading translated document:', error);
      alert('Không thể tải xuống bản dịch');
    }
  };

  const handleDownloadConfirmation = async () => {
    if (!request) return;
    
    try {
      await translationRequestAPI.downloadConfirmationDocument(request.id);
    } catch (error) {
      console.error('Error downloading confirmation document:', error);
      alert('Không thể tải xuống giấy xác nhận');
    }
  };

  const getStatusBadgeVariant = (status: TranslationStatus) => {
    switch (status) {
      case TranslationStatus.PENDING:
        return 'outline';
      case TranslationStatus.UNDER_REVIEW:
        return 'secondary';
      case TranslationStatus.APPROVED:
        return 'default';
      case TranslationStatus.REJECTED:
        return 'destructive';
      case TranslationStatus.NEEDS_REVISION:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canPerformAdminActions = userRole === 'KHCN_DN';
  const canStartReview = canPerformAdminActions && request?.status === TranslationStatus.PENDING;
  const canReview = canPerformAdminActions && request?.status === TranslationStatus.UNDER_REVIEW;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !request) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {error || 'Không tìm thấy yêu cầu'}
          </div>
          {onBack && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={onBack}>
                Quay lại
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{request.originalDocumentTitle}</h1>
          <div className="flex items-center gap-4">
            <Badge variant={getStatusBadgeVariant(request.status)}>
              {TRANSLATION_STATUS_LABELS[request.status]}
            </Badge>
            <span className="text-sm text-gray-500">Mã: {request.requestCode}</span>
          </div>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        )}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="font-medium">Loại tài liệu</Label>
              <p>{DOCUMENT_TYPE_LABELS[request.documentType]}</p>
            </div>
            <div>
              <Label className="font-medium">Cặp ngôn ngữ</Label>
              <p>{LANGUAGE_PAIR_LABELS[request.languagePair]}</p>
            </div>
            <div>
              <Label className="font-medium">Đơn vị nộp</Label>
              <p>{request.submittingUnit}</p>
            </div>
            <div>
              <Label className="font-medium">Ngày nộp</Label>
              <p>{formatDate(request.createdAt)}</p>
            </div>
            {request.approvedAt && (
              <div>
                <Label className="font-medium">Ngày duyệt</Label>
                <p>{formatDate(request.approvedAt)}</p>
              </div>
            )}
            <div>
              <Label className="font-medium">Số lần chỉnh sửa</Label>
              <p>{request.revisionCount}</p>
            </div>
          </div>
          
          <div>
            <Label className="font-medium">Mục đích sử dụng</Label>
            <p className="mt-1">{request.purpose}</p>
          </div>

          {request.reviewComments && (
            <div>
              <Label className="font-medium">Nhận xét từ KHCN&ĐN</Label>
              <p className="mt-1 p-3 bg-gray-50 rounded-md">{request.reviewComments}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {request.originalFilePath && (
              <Button 
                variant="outline" 
                onClick={handleDownloadOriginal}
                className="justify-start"
              >
                📄 Tải tài liệu gốc
              </Button>
            )}
            
            {request.translatedFilePath && (
              <Button 
                variant="outline" 
                onClick={handleDownloadTranslated}
                className="justify-start"
              >
                📄 Tải bản dịch
              </Button>
            )}
            
            {request.confirmationDocumentPath && (
              <Button 
                variant="outline" 
                onClick={handleDownloadConfirmation}
                className="justify-start"
              >
                📄 Tải giấy xác nhận
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {canPerformAdminActions && (
        <Card>
          <CardHeader>
            <CardTitle>Hành động quản trị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {canStartReview && (
              <Button 
                onClick={handleStartReview}
                disabled={actionLoading}
                className="w-full"
              >
                Bắt đầu xem xét
              </Button>
            )}

            {canReview && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reviewComments">Nhận xét</Label>
                  <Textarea
                    id="reviewComments"
                    placeholder="Nhập nhận xét hoặc lý do..."
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={handleApprove}
                    disabled={actionLoading}
                    variant="default"
                  >
                    Duyệt
                  </Button>
                  
                  <Button 
                    onClick={handleRequestRevision}
                    disabled={actionLoading || !reviewComments.trim()}
                    variant="outline"
                  >
                    Yêu cầu chỉnh sửa
                  </Button>
                  
                  <Button 
                    onClick={handleReject}
                    disabled={actionLoading || !reviewComments.trim()}
                    variant="destructive"
                  >
                    Từ chối
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
