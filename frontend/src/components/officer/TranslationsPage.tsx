"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Languages, Upload, Check, X, Clock, FileText, Search, Filter, Download, Eye, BarChart3, Users, FileCheck, AlertCircle, Calendar, Building, CheckCircle, Info, ArrowRight } from "lucide-react";
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
          <TabsTrigger value="process">Quy trình phê duyệt</TabsTrigger>
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

        <TabsContent value="process">
          <Card className="p-6">
            <div className="w-full space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Quy trình phê duyệt dịch thuật</h2>
                <p className="text-muted-foreground mt-2">
                  Quy trình xử lý yêu cầu dịch thuật từ lúc nộp đến khi hoàn thành
                </p>
              </div>

              {/* Quy trình phê duyệt */}
              <div className="space-y-6">
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                    <h4 className="mb-4">Quy trình xử lý xác nhận dịch thuật</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <div>
                          <h4 className="mb-1">Nộp đơn</h4>
                          <p className="text-sm text-muted-foreground">
                            Cán bộ nộp đơn và tài liệu
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h4 className="mb-1">Xét duyệt</h4>
                          <p className="text-sm text-muted-foreground">
                            Admin kiểm tra tài liệu
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <div>
                          <h4 className="mb-1">Phê duyệt</h4>
                          <p className="text-sm text-muted-foreground">
                            Ban giám hiệu phê duyệt
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          4
                        </div>
                        <div>
                          <h4 className="mb-1">Cấp thư</h4>
                          <p className="text-sm text-muted-foreground">
                            Hoàn thành và cấp thư
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                {/* Danh sách yêu cầu đang xử lý */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-6">Quy trình xử lý đơn xác nhận</h3>
                  <div className="space-y-4">
                    {translations.slice(0, 5).map((trans, index) => (
                      <motion.div
                        key={trans.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="p-6 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4>{trans.documentTitle}</h4>
                                {getStatusBadge(trans.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Mã đơn: {trans.id} • Nộp ngày: {new Date(trans.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Languages className="w-4 h-4 text-muted-foreground" />
                                  {trans.sourceLanguage} → {trans.targetLanguage}
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{trans.createdBy.fullName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline Progress */}
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              {[
                                { step: "Nộp yêu cầu", status: trans.status === "PENDING" ? "current" : trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", date: new Date(trans.createdAt).toLocaleDateString('vi-VN') },
                                { step: "Duyệt yêu cầu", status: trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", date: trans.status === "APPROVED" || trans.status === "COMPLETED" ? "Đã duyệt" : null },
                                { step: "Dịch thuật", status: trans.status === "COMPLETED" ? "completed" : "pending", date: trans.status === "COMPLETED" ? "Hoàn thành" : null },
                                { step: "Hoàn thành", status: trans.status === "COMPLETED" ? "completed" : "pending", date: null }
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center flex-1">
                                  <div
                                    className={`flex-1 h-2 rounded-full transition-all ${
                                      item.status === "completed"
                                        ? "bg-green-500"
                                        : item.status === "current"
                                        ? "bg-blue-500"
                                        : "bg-gray-200"
                                    }`}
                                  >
                                    {item.status === "current" && (
                                      <div className="h-full bg-blue-400 rounded-full animate-pulse" />
                                    )}
                                  </div>
                                  {idx < 3 && (
                                    <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground" />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              {[
                                { step: "Nộp yêu cầu", status: trans.status === "PENDING" ? "current" : trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", date: new Date(trans.createdAt).toLocaleDateString('vi-VN') },
                                { step: "Duyệt yêu cầu", status: trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", date: trans.status === "APPROVED" || trans.status === "COMPLETED" ? "Đã duyệt" : null },
                                { step: "Dịch thuật", status: trans.status === "COMPLETED" ? "completed" : "pending", date: trans.status === "COMPLETED" ? "Hoàn thành" : null },
                                { step: "Hoàn thành", status: trans.status === "COMPLETED" ? "completed" : "pending", date: null }
                              ].map((item, idx) => (
                                <div key={idx} className="text-center">
                                  <p
                                    className={`font-medium ${
                                      item.status === "completed"
                                        ? "text-green-600"
                                        : item.status === "current"
                                        ? "text-blue-600"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {item.step}
                                  </p>
                                  {item.date && (
                                    <p className="text-muted-foreground mt-1">
                                      {item.date}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Current Status Note */}
                          {[
                            { step: "Nộp yêu cầu", status: trans.status === "PENDING" ? "current" : trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", note: "Đang chờ Department Officer duyệt yêu cầu" },
                            { step: "Duyệt yêu cầu", status: trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", note: "Department Officer đã duyệt, đang phân công nhân viên dịch thuật" },
                            { step: "Dịch thuật", status: trans.status === "COMPLETED" ? "completed" : "pending", note: "Nhân viên dịch thuật đang xử lý tài liệu" },
                            { step: "Hoàn thành", status: trans.status === "COMPLETED" ? "completed" : "pending", note: "Đã hoàn thành và gửi thông báo cho người yêu cầu" }
                          ].find((t) => t.status === "current") && (
                            <Card className="p-3 mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                              <p className="text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-900 dark:text-blue-100">
                                  {[
                                    { step: "Nộp yêu cầu", status: trans.status === "PENDING" ? "current" : trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", note: "Đang chờ Department Officer duyệt yêu cầu" },
                                    { step: "Duyệt yêu cầu", status: trans.status === "APPROVED" || trans.status === "COMPLETED" ? "completed" : "pending", note: "Department Officer đã duyệt, đang phân công nhân viên dịch thuật" },
                                    { step: "Dịch thuật", status: trans.status === "COMPLETED" ? "completed" : "pending", note: "Nhân viên dịch thuật đang xử lý tài liệu" },
                                    { step: "Hoàn thành", status: trans.status === "COMPLETED" ? "completed" : "pending", note: "Đã hoàn thành và gửi thông báo cho người yêu cầu" }
                                  ].find((t) => t.status === "current")?.note}
                                </span>
                              </p>
                            </Card>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(trans)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </Button>
                            {trans.status === "COMPLETED" && trans.translatedFile && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Tải bản dịch
                              </Button>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu dịch thuật</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu dịch thuật
            </DialogDescription>
          </DialogHeader>
          {selectedTranslation && (
            <div className="dialog-body max-h-[70vh] overflow-y-auto">
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