'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  translationRequestAPI, 
  type TranslationRequestFilters 
} from '@/lib/api/translation-request';
import { 
  TranslationRequest,
  TranslationStatus,
  DocumentType,
  LanguagePair,
  TRANSLATION_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  LANGUAGE_PAIR_LABELS 
} from '@/lib/types/translation-request';

interface TranslationRequestListProps {
  onSelectRequest?: (request: TranslationRequest) => void;
  userRole?: string;
}

export default function TranslationRequestList({ onSelectRequest, userRole }: TranslationRequestListProps) {
  const [requests, setRequests] = useState<TranslationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<TranslationRequestFilters>({
    limit: 10,
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await translationRequestAPI.getAll({
        ...filters,
        page: currentPage,
      });
      
      setRequests(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching translation requests:', error);
      setError('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, filters]);

  const handleFilterChange = (key: keyof TranslationRequestFilters, value: string) => {
    setCurrentPage(1);
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading && requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <Input
                placeholder="Tìm kiếm..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  {Object.entries(TRANSLATION_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Type Filter */}
            <div>
              <Select
                value={filters.documentType || ''}
                onValueChange={(value) => handleFilterChange('documentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Loại tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả loại</SelectItem>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Pair Filter */}
            <div>
              <Select
                value={filters.languagePair || ''}
                onValueChange={(value) => handleFilterChange('languagePair', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả ngôn ngữ</SelectItem>
                  {Object.entries(LANGUAGE_PAIR_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submitting Unit Filter (for KHCN_DN only) */}
            {userRole === 'KHCN_DN' && (
              <div>
                <Input
                  placeholder="Đơn vị nộp"
                  value={filters.submittingUnit || ''}
                  onChange={(e) => handleFilterChange('submittingUnit', e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Request List */}
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                Không có yêu cầu nào được tìm thấy
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {request.originalDocumentTitle}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Mã:</span> {request.requestCode}
                      </div>
                      <div>
                        <span className="font-medium">Loại:</span>{' '}
                        {DOCUMENT_TYPE_LABELS[request.documentType]}
                      </div>
                      <div>
                        <span className="font-medium">Ngôn ngữ:</span>{' '}
                        {LANGUAGE_PAIR_LABELS[request.languagePair]}
                      </div>
                      <div>
                        <span className="font-medium">Đơn vị:</span> {request.submittingUnit}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Mục đích:</span> {request.purpose}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Ngày nộp: {formatDate(request.createdAt)}
                      {request.approvedAt && (
                        <span className="ml-4">
                          Ngày duyệt: {formatDate(request.approvedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {TRANSLATION_STATUS_LABELS[request.status]}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectRequest?.(request)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
