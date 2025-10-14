"use client";

import React, { useState, useEffect } from "react";
import { Languages, Upload, Check, X, Clock, FileText, Search, Filter, Download, Eye, BarChart3, Users, FileCheck, AlertCircle, Calendar, Building } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { translationService, TranslationWithRelations, FilterTranslationDto, TranslationStats, TranslationStatus, UrgentLevel } from "@/lib/api/translation.service";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";



const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Portuguese",
  "Italian",
  "Russian",
];

export function TranslationsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [translations, setTranslations] = useState<TranslationWithRelations[]>([]);
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationWithRelations | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filters, setFilters] = useState<FilterTranslationDto>({
    page: '1',
    limit: '20',
  });
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    documentType: 'ALL',
    unitId: '',
    status: 'ALL',
    sourceLanguage: '',
    targetLanguage: '',
    createdFrom: '',
    createdTo: '',
  });

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const statsData = await translationService.getStats();
        console.log('Stats data:', statsData); // Debug log
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Set default stats to prevent undefined errors
        setStats({
          total: 0,
          byStatus: {
            PENDING: 0,
            APPROVED: 0,
            COMPLETED: 0,
            REJECTED: 0
          },
          byUrgentLevel: {
            NORMAL: 0,
            URGENT: 0,
            VERY_URGENT: 0
          },
          byLanguagePair: {},
          recentRequests: 0,
          completedThisMonth: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch translations from API
  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await translationService.list(filters);
        setTranslations(result.translations);
      } catch (err) {
        console.error('Error fetching translations:', err);
        setError('Không thể tải danh sách bản dịch. Vui lòng thử lại.');
        toast.error('Không thể tải danh sách bản dịch');
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [filters]);

  // Handle search
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchFilters.search || undefined,
      documentType: searchFilters.documentType === 'ALL' ? undefined : searchFilters.documentType || undefined,
      unitId: searchFilters.unitId || undefined,
      status: (searchFilters.status === 'ALL' ? undefined : searchFilters.status as TranslationStatus) || undefined,
      sourceLanguage: searchFilters.sourceLanguage || undefined,
      targetLanguage: searchFilters.targetLanguage || undefined,
      createdFrom: searchFilters.createdFrom || undefined,
      createdTo: searchFilters.createdTo || undefined,
      page: '1', // Reset to first page when searching
    }));
  };

  // Handle approve translation
  const handleApprove = async (id: string) => {
    try {
      await translationService.approve(id, {});
      toast.success('Đã duyệt yêu cầu dịch thuật');
      // Refresh data
      setFilters(prev => ({ ...prev }));
    } catch (err) {
      console.error('Error approving translation:', err);
      toast.error('Không thể duyệt yêu cầu dịch thuật');
    }
  };

  // Handle reject translation
  const handleReject = async (id: string) => {
    try {
      await translationService.reject(id, { reason: 'Rejected by officer' });
      toast.success('Đã từ chối yêu cầu dịch thuật');
      // Refresh data
      setFilters(prev => ({ ...prev }));
    } catch (err) {
      console.error('Error rejecting translation:', err);
      toast.error('Không thể từ chối yêu cầu dịch thuật');
    }
  };

  // Handle view details
  const handleViewDetails = (translation: TranslationWithRelations) => {
    setSelectedTranslation(translation);
    setShowDetailDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      COMPLETED: { variant: "default", label: "Đã xác nhận" },
      APPROVED: { variant: "outline", label: "Đã duyệt" },
      PENDING: { variant: "secondary", label: "Chờ duyệt" },
      REJECTED: { variant: "destructive", label: "Từ chối" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTimelineStepLabel = (status: string) => {
    const labels: Record<string, string> = {
      submitted: "Submitted",
      "in-review": "In Review",
      translation: "Translation",
      "quality-check": "Quality Check",
      approved: "Approved",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Quản lý dịch thuật" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý dịch thuật</h1>
          <p className="text-muted-foreground mt-1">
            Giám sát và quản lý các yêu cầu dịch thuật của khoa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng yêu cầu</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              )}
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã hoàn thành</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-bold">{stats?.byStatus?.COMPLETED || 0}</p>
              )}
            </div>
            <FileCheck className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-bold">{stats?.byStatus?.PENDING || 0}</p>
              )}
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Từ chối</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-bold">{stats?.byStatus?.REJECTED || 0}</p>
              )}
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="requests">Danh sách yêu cầu</TabsTrigger>
          <TabsTrigger value="search">Tra cứu nâng cao</TabsTrigger>
          <TabsTrigger value="submit">Tạo yêu cầu mới</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
              <div className="space-y-4">
                {translations && translations.length > 0 ? translations.slice(0, 5).map((translation) => (
                  <div key={translation.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{translation.documentTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {translation.createdBy.fullName} • {new Date(translation.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    {getStatusBadge(translation.status)}
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Chưa có hoạt động nào</p>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hành động nhanh</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Tra cứu yêu cầu
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất báo cáo tháng
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Quản lý đơn vị
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Lịch sử hoạt động
                </Button>
              </div>
            </Card>
          </div>

          {/* Charts/Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Thống kê theo trạng thái</h3>
              <div className="space-y-3">
                {stats && stats.byStatus && (
                  Array.isArray(stats.byStatus)
                    ? stats.byStatus.map((item: any) => (
                        <div key={item.status || item.key} className="flex items-center justify-between">
                          <span className="text-sm">{getStatusBadge(item.status || item.key).props.children}</span>
                          <span className="font-semibold">{item.count || item.value}</span>
                        </div>
                      ))
                    : Object.entries(stats.byStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm">{getStatusBadge(status).props.children}</span>
                          <span className="font-semibold">{typeof count === 'object' ? (count as any).count || count : count}</span>
                        </div>
                      ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Thống kê theo ngôn ngữ</h3>
              <div className="space-y-3">
                {stats && stats.byLanguagePair && (
                  Array.isArray(stats.byLanguagePair)
                    ? stats.byLanguagePair.slice(0, 5).map((item: any) => (
                        <div key={item.languagePair || item.key} className="flex items-center justify-between">
                          <span className="text-sm">{item.languagePair || item.key}</span>
                          <span className="font-semibold">{item.count || item.value}</span>
                        </div>
                      ))
                    : Object.entries(stats.byLanguagePair).slice(0, 5).map(([lang, count]) => (
                        <div key={lang} className="flex items-center justify-between">
                          <span className="text-sm">{lang}</span>
                          <span className="font-semibold">{typeof count === 'object' ? (count as any).count || count : count}</span>
                        </div>
                      ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="filter-search">Tìm kiếm</Label>
                <Input
                  id="filter-search"
                  placeholder="Tên tài liệu, người yêu cầu..."
                  value={searchFilters.search}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div className="min-w-[150px]">
                <Label htmlFor="filter-status">Trạng thái</Label>
                <Select
                  value={searchFilters.status}
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                    <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="REJECTED">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[150px]">
                <Label htmlFor="filter-doc-type">Loại tài liệu</Label>
                <Select
                  value={searchFilters.documentType}
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, documentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="Diploma">Bằng cấp</SelectItem>
                    <SelectItem value="Certificate">Chứng chỉ</SelectItem>
                    <SelectItem value="Contract">Hợp đồng</SelectItem>
                    <SelectItem value="Passport">Hộ chiếu</SelectItem>
                    <SelectItem value="Transcript">Bảng điểm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài liệu</TableHead>
                  <TableHead>Người yêu cầu</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Ngôn ngữ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : translations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có yêu cầu dịch thuật nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  translations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{translation.documentTitle}</p>
                          <p className="text-sm text-muted-foreground">{translation.documentType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{translation.createdBy.fullName}</p>
                          <p className="text-sm text-muted-foreground">{translation.createdBy.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {translation.unit?.name || translation.unitName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {translation.sourceLanguage} → {translation.targetLanguage}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(translation.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(translation.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(translation)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {translation.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(translation.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(translation.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {translation.translatedFile && (
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h2>Tra cứu bản dịch đã xác nhận</h2>
                <p className="text-muted-foreground mt-2">
                  Tìm kiếm bản dịch theo từ khóa, loại tài liệu hoặc đơn vị
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search-keyword">Từ khóa</Label>
                  <Input
                    id="search-keyword"
                    placeholder="Tên tài liệu, người yêu cầu..."
                    value={searchFilters.search}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="search-document-type">Loại tài liệu</Label>
                  <Select
                    value={searchFilters.documentType}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, documentType: value }))}
                  >
                    <SelectTrigger id="search-document-type" className="mt-2">
                      <SelectValue placeholder="Chọn loại tài liệu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diploma">Bằng cấp</SelectItem>
                      <SelectItem value="Certificate">Chứng chỉ</SelectItem>
                      <SelectItem value="Contract">Hợp đồng</SelectItem>
                      <SelectItem value="Passport">Hộ chiếu</SelectItem>
                      <SelectItem value="Transcript">Bảng điểm</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="search-unit">Đơn vị</Label>
                  <Input
                    id="search-unit"
                    placeholder="Tên đơn vị..."
                    value={searchFilters.unitId}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, unitId: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleSearch} className="px-8">
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Submit New Request Tab */}
        <TabsContent value="submit">
          <Card className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Languages className="w-8 h-8 text-primary" />
                </div>
                <h2>Nộp yêu cầu dịch thuật</h2>
                <p className="text-muted-foreground mt-2">
                  Điền thông tin để nộp yêu cầu dịch thuật tài liệu
                </p>
              </div>

              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                // Handle form submission
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  applicantName: formData.get('applicantName') as string,
                  applicantEmail: formData.get('applicantEmail') as string,
                  applicantPhone: formData.get('applicantPhone') as string,
                  documentTitle: formData.get('documentTitle') as string,
                  sourceLanguage: formData.get('sourceLanguage') as string,
                  targetLanguage: formData.get('targetLanguage') as string,
                  documentType: formData.get('documentType') as string,
                  purpose: formData.get('purpose') as string,
                  urgentLevel: (formData.get('urgentLevel') as UrgentLevel) || 'NORMAL',
                  unitName: formData.get('unitName') as string,
                  notes: formData.get('notes') as string,
                  // Note: File upload would need additional handling
                  originalFile: 'placeholder.pdf', // This would be handled by file upload
                };

                try {
                  await translationService.create(data);
                  toast.success('Yêu cầu dịch thuật đã được nộp thành công');
                  setActiveTab('requests');
                  // Refresh data
                  setFilters(prev => ({ ...prev }));
                } catch (err) {
                  console.error('Error creating translation request:', err);
                  toast.error('Không thể nộp yêu cầu dịch thuật');
                }
              }}>
                <div>
                  <Label htmlFor="applicantName">Tên người yêu cầu</Label>
                  <Input
                    id="applicantName"
                    name="applicantName"
                    placeholder="Nhập tên đầy đủ"
                    className="mt-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicantEmail">Email</Label>
                    <Input
                      id="applicantEmail"
                      name="applicantEmail"
                      type="email"
                      placeholder="email@example.com"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicantPhone">Số điện thoại</Label>
                    <Input
                      id="applicantPhone"
                      name="applicantPhone"
                      placeholder="+84..."
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="documentTitle">Tiêu đề tài liệu</Label>
                  <Input
                    id="documentTitle"
                    name="documentTitle"
                    placeholder="Ví dụ: Bằng tốt nghiệp Đại học"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label>Upload tài liệu</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Nhấp để tải lên hoặc kéo thả
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX tối đa 10MB
                    </p>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sourceLanguage">Ngôn ngữ gốc</Label>
                    <Select name="sourceLanguage" required>
                      <SelectTrigger id="sourceLanguage" className="mt-2">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang.toLowerCase()}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetLanguage">Ngôn ngữ đích</Label>
                    <Select name="targetLanguage" required>
                      <SelectTrigger id="targetLanguage" className="mt-2">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang.toLowerCase()}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentType">Loại tài liệu</Label>
                    <Select name="documentType" required>
                      <SelectTrigger id="documentType" className="mt-2">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diploma">Bằng cấp</SelectItem>
                        <SelectItem value="Certificate">Chứng chỉ</SelectItem>
                        <SelectItem value="Contract">Hợp đồng</SelectItem>
                        <SelectItem value="Passport">Hộ chiếu</SelectItem>
                        <SelectItem value="Transcript">Bảng điểm</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgentLevel">Mức độ khẩn cấp</Label>
                    <Select name="urgentLevel">
                      <SelectTrigger id="urgentLevel" className="mt-2">
                        <SelectValue placeholder="Chọn mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL">Bình thường</SelectItem>
                        <SelectItem value="URGENT">Khẩn cấp</SelectItem>
                        <SelectItem value="VERY_URGENT">Rất khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">Mục đích sử dụng</Label>
                  <Input
                    id="purpose"
                    name="purpose"
                    placeholder="Ví dụ: Nộp hồ sơ du học"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="unitName">Tên đơn vị</Label>
                  <Input
                    id="unitName"
                    name="unitName"
                    placeholder="Ví dụ: Phòng Hợp tác Quốc tế"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Ghi chú thêm (Tùy chọn)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Các yêu cầu đặc biệt hoặc ngữ cảnh cho việc dịch thuật"
                    className="mt-2 min-h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveTab("requests")}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary">
                    <Languages className="w-4 h-4 mr-2" />
                    Nộp yêu cầu
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu dịch thuật</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu dịch thuật
            </DialogDescription>
          </DialogHeader>
          {selectedTranslation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tài liệu</Label>
                  <p className="text-sm">{selectedTranslation.documentTitle}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Loại tài liệu</Label>
                  <p className="text-sm">{selectedTranslation.documentType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngôn ngữ</Label>
                  <p className="text-sm">{selectedTranslation.sourceLanguage} → {selectedTranslation.targetLanguage}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">{getStatusBadge(selectedTranslation.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Người yêu cầu</Label>
                  <p className="text-sm">{selectedTranslation.createdBy.fullName}</p>
                  <p className="text-xs text-muted-foreground">{selectedTranslation.createdBy.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Đơn vị</Label>
                  <p className="text-sm">{selectedTranslation.unit?.name || selectedTranslation.unitName || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày tạo</Label>
                  <p className="text-sm">{new Date(selectedTranslation.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mức độ khẩn cấp</Label>
                  <p className="text-sm">{selectedTranslation.urgentLevel}</p>
                </div>
              </div>
              {selectedTranslation.notes && (
                <div>
                  <Label className="text-sm font-medium">Ghi chú</Label>
                  <p className="text-sm mt-1">{selectedTranslation.notes}</p>
                </div>
              )}
              {selectedTranslation.purpose && (
                <div>
                  <Label className="text-sm font-medium">Mục đích</Label>
                  <p className="text-sm mt-1">{selectedTranslation.purpose}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}