"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import FileUploadBox from "@/components/FileUploadBox";
import { visaService, type InternationalMember } from "@/lib/api";
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  AlertCircle,
  Clock,
  Check,
  FileText,
  RefreshCw,
  Calendar,
  Upload,
  Send,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Breadcrumbs } from "../Breadcrumbs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface InternationalMembersProps {
  onNavigate?: (page: string) => void;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export function InternationalMembers({ onNavigate }: InternationalMembersProps = {}) {
  const [members, setMembers] = useState<InternationalMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<InternationalMember | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isVisaExtensionOpen, setIsVisaExtensionOpen] = useState(false);
  const [selectedForExtension, setSelectedForExtension] = useState<InternationalMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("members");
  const [isSubmittingExtension, setIsSubmittingExtension] = useState(false);

  // Fetch international members data
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await visaService.getInternationalMembers();
        console.log('Data received from API:', data);
        console.log('Setting members state with:', data.length, 'items');
        setMembers(data);
        console.log('Members state after set:', members);
      } catch (err) {
        console.error('Error fetching international members:', err);
        setError('Failed to load international members data');
        // Fallback to mock data if API fails
        // setMembers(membersData as InternationalMember[]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'expiring-soon':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Expiring Soon</Badge>;
      case 'extension-requested':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Extension Requested</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('Current state:', { members, filteredMembers, loading, error, searchQuery, statusFilter });

  // Computed statistics
  const expiringSoonCount = members.filter((m) => {
    const expiry = new Date(m.visaExpiry);
    const today = new Date();
    const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  }).length;

  const extensionRequestsCount = members.filter((m) => m.extensionRequest).length;
  const totalActiveCount = members.filter((m) => m.status === 'active').length;

  // Handle extension request submission
  const handleSubmitExtension = async () => {
    if (!selectedForExtension) return;

    // Get form values
    const requestedDate = (document.getElementById('ext-requested-date') as HTMLInputElement)?.value;
    const duration = (document.getElementById('ext-duration') as HTMLSelectElement)?.value;
    const reason = (document.getElementById('ext-reason') as HTMLTextAreaElement)?.value;
    const programStatus = (document.getElementById('ext-program-status') as HTMLTextAreaElement)?.value;

    // Basic validation
    if (!requestedDate) {
      alert('Vui lòng chọn ngày gia hạn yêu cầu');
      return;
    }
    if (!reason || reason.length < 10) {
      alert('Vui lòng nhập lý do gia hạn (tối thiểu 10 ký tự)');
      return;
    }

    try {
      setIsSubmittingExtension(true);

      // Calculate new expiration date based on duration
      let newExpirationDate = new Date(requestedDate);
      if (duration === '3') {
        newExpirationDate.setMonth(newExpirationDate.getMonth() + 3);
      } else if (duration === '6') {
        newExpirationDate.setMonth(newExpirationDate.getMonth() + 6);
      } else if (duration === '12') {
        newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);
      } else if (duration === '24') {
        newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 2);
      }

      // Call API to create extension request
      await visaService.createExtension(selectedForExtension.visaId, {
        newExpirationDate: newExpirationDate.toISOString().split('T')[0],
        reason: reason + (programStatus ? `\n\nTình trạng chương trình: ${programStatus}` : ''),
      });

      // Update member status locally
      setMembers(prev => prev.map(member =>
        member.id === selectedForExtension.id
          ? { ...member, status: 'extension-requested' as const }
          : member
      ));

      // Close dialog and reset state
      setIsVisaExtensionOpen(false);
      setSelectedForExtension(null);

      alert('Đơn gia hạn visa đã được gửi thành công!');

    } catch (error) {
      console.error('Error submitting extension request:', error);
      alert('Có lỗi xảy ra khi gửi đơn gia hạn. Vui lòng thử lại.');
    } finally {
      setIsSubmittingExtension(false);
    }
  };

  // Computed chart data
  const visaExpiringData = [
    {
      status: "< 1 month",
      count: members.filter((m) => {
        const expiry = new Date(m.visaExpiry);
        const today = new Date();
        const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30;
      }).length,
      color: "#ef4444"
    },
    {
      status: "1-3 months",
      count: members.filter((m) => {
        const expiry = new Date(m.visaExpiry);
        const today = new Date();
        const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil > 30 && daysUntil <= 90;
      }).length,
      color: "#f59e0b"
    },
    {
      status: "> 3 months",
      count: members.filter((m) => {
        const expiry = new Date(m.visaExpiry);
        const today = new Date();
        const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil > 90;
      }).length,
      color: "#10b981"
    },
  ];

  const nationalityData = Object.entries(
    members.reduce((acc, member) => {
      acc[member.nationality] = (acc[member.nationality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([country, count]) => ({ country, count }));

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };
  const handleFile = (file: File | null) => {
    console.log("File nhận được:", file);
  };
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Sinh viên quốc tế" }]} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Sinh Viên Quốc Tế / Thực Tập / Giảng Viên</h1>
          <p className="text-muted-foreground mt-1">
            Đăng ký và quản lý sinh viên quốc tế thuộc đơn vị
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button className="bg-primary" onClick={() => setIsRegistrationOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="members">Danh sách</TabsTrigger>
          <TabsTrigger value="visa-extension">Gia hạn Visa</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, nationality, or program..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="extension-requested">Extension Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Members Table */}
          {loading && (
            <Card className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Loading international members...</p>
                </div>
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-destructive">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {!loading && !error && (
            <Card className="p-6">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Visa Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Visa Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member, index) => {
                    console.log('Rendering member:', member);
                    const typedMember = member as InternationalMember;
                    return (
                    <TableRow key={typedMember.id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>{typedMember.fullName}</TableCell>
                      <TableCell>{typedMember.nationality}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {typedMember.visaType}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {typedMember.department}
                      </TableCell>
                      <TableCell>{formatDate(typedMember.visaExpiry)}</TableCell>
                      <TableCell>{getStatusBadge(typedMember.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {(() => {
                            const expiryDate = new Date(typedMember.visaExpiry);
                            const today = new Date();
                            const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            const needsExtension = daysUntilExpiry <= 90;

                            if (typedMember.status === "extension-requested") {
                              return (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                  onClick={() => setSelectedMember(typedMember)}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Xem đơn gia hạn
                                </Button>
                              );
                            }

                            return (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedMember(typedMember)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem
                                </Button>
                                {typedMember.status === 'expiring-soon' && (
                                  <Button
                                    size="sm"
                                    className="bg-primary"
                                    onClick={() => {
                                      setSelectedForExtension(typedMember);
                                      setIsVisaExtensionOpen(true);
                                    }}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Lập đơn gia hạn visa
                                  </Button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                  {filteredMembers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No international members found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          )}
        </TabsContent>

        {/* Visa Extension Tab */}
        <TabsContent value="visa-extension" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Khẩn cấp</p>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="mb-1">1</h2>
                <p className="text-sm text-muted-foreground">Còn ≤ 30 ngày</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Đang xử lý</p>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="mb-1">1</h2>
                <p className="text-sm text-muted-foreground">Đơn chờ duyệt</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Hoàn thành</p>
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="mb-1">1</h2>
                <p className="text-sm text-muted-foreground">Tháng này</p>
              </Card>
            </motion.div>
          </div>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                      <h4 className="mb-4">Quy trình xử lý gia hạn visa</h4>
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
                              Phòng KHCN kiểm tra tài liệu
                            </p>
                          </div>
                        </div>
                       <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                          <div>
                            <h4 className="mb-1">Phê duyệt</h4>
                            <p className="text-sm text-muted-foreground">
                              Cấp NA5/NA6
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                            4
                          </div>
                          <div>
                            <h4 className="mb-1">Hoàn thành</h4>
                            <p className="text-sm text-muted-foreground">
                             Visa đã gia hạn
                            </p>
                          </div>
                        </div>
                      </div>
          </Card>
          {/* Students needing visa extension */}
          <div className="space-y-4">
            <h3>Sinh viên cần gia hạn visa</h3>
            {members
              .filter((m) => m.status === 'expiring-soon')
              .map((member) => {
                const expiry = new Date(member.visaExpiry);
                const today = new Date();
                const daysUntil = Math.floor(
                  (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isUrgent = daysUntil <= 30;

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      className={`p-6 border-l-4 ${
                        isUrgent ? "border-l-red-500" : "border-l-orange-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isUrgent
                                ? "bg-red-100 text-red-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4>{member.fullName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {member.program}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                {member.visaType}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span>{member.nationality}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={isUrgent ? "destructive" : "secondary"}>
                          {isUrgent ? "Khẩn cấp" : "Sắp hết hạn"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-accent/30 rounded-lg">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Ngày hết hạn
                          </Label>
                          <p className="mt-1 font-medium text-destructive">
                            {formatDate(member.visaExpiry)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Còn lại
                          </Label>
                          <p className="mt-1 font-medium">{daysUntil} ngày</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Trạng thái
                          </Label>
                          <p className="mt-1">{getStatusBadge(member.status)}</p>
                        </div>
                      </div>

                      {member.status === "extension-requested" ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Xem đơn
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-primary"
                          onClick={() => {
                            setSelectedForExtension(member);
                            setIsVisaExtensionOpen(true);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Tạo đơn gia hạn visa
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
          </div>

          {/* Visa Extension Requests in Progress */}
          {members.filter((m) => m.extensionRequest).length > 0 && (
            <div className="space-y-4 mt-8">
              <h3>Đơn gia hạn đang xử lý</h3>
              {members
                .filter((m) => m.extensionRequest)
                .map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{member.fullName}</h4>
                            {getStatusBadge(member.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Mã sinh viên: {member.id} • Nộp ngày: {member.extensionRequest?.submittedDate}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              {member.visaType}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{member.program}</span>
                          </div>
                        </div>
                      </div>

                      {/* Extension Info */}
                      <Card className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background mb-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Hết hạn hiện tại
                            </Label>
                            <p className="mt-1 text-destructive font-medium">
                              {formatDate(member.visaExpiry)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Gia hạn đến
                            </Label>
                            <p className="mt-1 text-green-600 font-medium">
                              {member.extensionRequest?.requestedExpiry}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Lý do
                            </Label>
                            <p className="mt-1 line-clamp-1">
                              {member.extensionRequest?.reason}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Timeline Progress */}
                      {member.extensionRequest?.timeline && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            {member.extensionRequest.timeline.map((item, idx) => (
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
                                {idx < (member.extensionRequest?.timeline.length || 0) - 1 && (
                                  <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-5 gap-2 text-xs">
                            {member.extensionRequest.timeline.map((item, idx) => (
                              <div key={idx} className="text-center">
                                <p
                                  className={`${
                                    item.status === "completed"
                                      ? "text-green-600"
                                      : item.status === "current"
                                      ? "text-blue-600 font-medium"
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
                      )}

                      {/* Current Status Note */}
                      {member.extensionRequest?.timeline?.find((t) => t.status === "current") && (
                        <Card className="p-3 mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                          <p className="text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-900 dark:text-blue-100">
                              {member.extensionRequest.timeline.find((t) => t.status === "current")?.note}
                            </span>
                          </p>
                        </Card>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Tải tài liệu
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}

          {/* Workflow Steps Info */}
         
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Visa Management Quick Link */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card 
              className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setActiveTab("visa-extension")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Quản Lý Visa & Gia Hạn</h3>
                    <p className="text-white/90 text-sm">
                      Theo dõi chi tiết tình trạng visa và tiến trình xử lý đơn gia hạn
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        3 visa sắp hết hạn
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        1 đơn đang xét
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="secondary" size="lg">
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-yellow-500"
                onClick={() => {
                  setActiveTab("members");
                  setStatusFilter("all");
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground">Visa sắp hết hạn</p>
                    <h2 className="mt-1">{expiringSoonCount}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Trong vòng 1 tháng
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-yellow-300 hover:bg-yellow-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("members");
                  }}
                >
                  Xem sinh viên
                </Button>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => {
                  setActiveTab("members");
                  setStatusFilter("extension-requested");
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground">Đơn gia hạn</p>
                    <h2 className="mt-1">{extensionRequestsCount}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Đang xét duyệt
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-blue-300 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("members");
                    setStatusFilter("extension-requested");
                  }}
                >
                  Xem đơn
                </Button>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500"
                onClick={() => {
                  setActiveTab("members");
                  setStatusFilter("active");
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground">Tổng số</p>
                    <h2 className="mt-1">{totalActiveCount}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Đang theo học
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <GraduationCap className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-green-300 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("members");
                    setStatusFilter("active");
                  }}
                >
                  Xem tất cả
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Visa Expiry Status</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visaExpiringData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }) =>
                        `${status} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {visaExpiringData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Members by Nationality</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={nationalityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-1))"
                      radius={[8, 8, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Registration Form Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-4xl dialog-content">
          <DialogHeader>
            <DialogTitle>Online Registration Form</DialogTitle>
            <DialogDescription>
              Register a new international student, trainee, or lecturer
            </DialogDescription>
          </DialogHeader>
          <div className="dialog-body">
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="study">Study Info</TabsTrigger>
                <TabsTrigger value="visa">Visa Extension</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="reg-full-name">Full Name *</Label>
                    <Input
                      id="reg-full-name"
                      placeholder="Enter full name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-dob">Date of Birth *</Label>
                    <Input id="reg-dob" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="reg-nationality">Nationality *</Label>
                    <Input
                      id="reg-nationality"
                      placeholder="Country"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-passport">Passport Number *</Label>
                    <Input
                      id="reg-passport"
                      placeholder="Passport number"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-visa-type">Current Visa Type *</Label>
                    <Select>
                      <SelectTrigger id="reg-visa-type" className="mt-2">
                        <SelectValue placeholder="Select visa type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="f1">Student Visa (F-1)</SelectItem>
                        <SelectItem value="j1">Exchange Visitor (J-1)</SelectItem>
                        <SelectItem value="h1b">Work Visa (H-1B)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reg-visa-number">Visa Number *</Label>
                    <Input
                      id="reg-visa-number"
                      placeholder="Visa number"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-visa-expiry">Visa Expiry Date *</Label>
                    <Input id="reg-visa-expiry" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="reg-last-entry">Last Entry Date *</Label>
                    <Input id="reg-last-entry" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="reg-visa-code">Visa Code</Label>
                    <Input
                      id="reg-visa-code"
                      placeholder="e.g., F-1, J-1"
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="study" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="reg-program">Program Name *</Label>
                    <Input
                      id="reg-program"
                      placeholder="e.g., Master's in Computer Science"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-department">
                      Receiving Faculty *
                    </Label>
                    <Input
                      id="reg-department"
                      defaultValue="Faculty of Engineering"
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-supervisor">Supervisor *</Label>
                    <Input
                      id="reg-supervisor"
                      placeholder="Supervisor name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-start">Start Date *</Label>
                    <Input id="reg-start" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="reg-end">Expected End Date *</Label>
                    <Input id="reg-end" type="date" className="mt-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="visa" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reg-extension-date">
                        Requested Extension Date *
                      </Label>
                      <Input id="reg-extension-date" type="date" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="reg-na5">Request NA5 Letter</Label>
                      <Select>
                        <SelectTrigger id="reg-na5" className="mt-2">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="reg-reason">Reason for Extension *</Label>
                      <Textarea
                        id="reg-reason"
                        placeholder="Explain the reason for visa extension..."
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>
                <FileUploadBox label="Supporting Documents" onFileSelect={handleFile} />
              </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
              Save Draft
            </Button>
            <Button className="bg-primary">
              <GraduationCap className="w-4 h-4 mr-2" />
              Submit Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Member Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent className="max-w-3xl dialog-content">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              View international member information and status
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="dialog-body overflow-y-auto max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Member ID</Label>
                    <p className="mt-1">{selectedMember.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedMember.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Full Name</Label>
                    <p className="mt-1">{selectedMember.fullName}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p className="mt-1">{selectedMember.nationality}</p>
                  </div>
                  <div>
                    <Label>Passport Number</Label>
                    <p className="mt-1">{selectedMember.passportNo}</p>
                  </div>
                  <div>
                    <Label>Visa Type</Label>
                    <p className="mt-1">{selectedMember.visaType}</p>
                  </div>
                  <div>
                    <Label>Visa Number</Label>
                    <p className="mt-1">{selectedMember.visaNumber}</p>
                  </div>
                  <div>
                    <Label>Visa Expiry Date</Label>
                    <p className="mt-1">{formatDate(selectedMember.visaExpiry)}</p>
                  </div>
                  <div>
                    <Label>Last Entry Date</Label>
                    <p className="mt-1">{selectedMember.lastEntry}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Program</Label>
                    <p className="mt-1">{selectedMember.program}</p>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <p className="mt-1">{selectedMember.department}</p>
                  </div>
                  <div>
                    <Label>Supervisor</Label>
                    <p className="mt-1">{selectedMember.supervisor}</p>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <p className="mt-1">{selectedMember.startDate}</p>
                  </div>
                  <div>
                    <Label>Expected End Date</Label>
                    <p className="mt-1">{selectedMember.expectedEndDate}</p>
                  </div>
                </div>
                {selectedMember.status === "extension-requested" && (
                  <Card className="p-4 bg-accent/50">
                    <h4 className="mb-2">Visa Extension Request</h4>
                    <p className="text-sm text-muted-foreground">
                      Extension request submitted. Waiting for admin review and NA5
                      letter generation.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              Close
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visa Extension Request Dialog */}
      <Dialog open={isVisaExtensionOpen} onOpenChange={setIsVisaExtensionOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] dialog-content ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Yêu Cầu Gia Hạn Visa
            </DialogTitle>
            <DialogDescription>
              Gửi yêu cầu gia hạn visa cho sinh viên{" "}
              {selectedForExtension?.fullName}
            </DialogDescription>
          </DialogHeader>
                <div className="dialog-body overflow-y-auto">
                  <div className="space-y-6 py-4">
                    {/* Student Information Summary */}
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-200">
                      <h4 className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        Thông Tin Sinh Viên
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Họ và tên:</span>
                          <p className="mt-0.5">
                            {selectedForExtension?.fullName}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Mã sinh viên:
                          </span>
                          <p className="mt-0.5">{selectedForExtension?.id.slice(0, 8)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Loại visa hiện tại:
                          </span>
                          <p className="mt-0.5">
                            {selectedForExtension?.visaType}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Ngày hết hạn:
                          </span>
                          <p className="mt-0.5 font-medium text-destructive">
                            {formatDate(selectedForExtension?.visaExpiry || "")}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Extension Request Form */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Chi Tiết Gia Hạn
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ext-requested-date">
                            Ngày gia hạn yêu cầu *
                          </Label>
                          <Input
                            id="ext-requested-date"
                            type="date"
                            className="mt-2"
                            min={new Date().toISOString().split("T")[0]}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Ngày hết hạn visa mới
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="ext-duration">Thời gian gia hạn</Label>
                          <Select>
                            <SelectTrigger id="ext-duration" className="mt-2">
                              <SelectValue placeholder="Chọn thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 tháng</SelectItem>
                              <SelectItem value="6">6 tháng</SelectItem>
                              <SelectItem value="12">12 tháng</SelectItem>
                              <SelectItem value="24">24 tháng</SelectItem>
                              <SelectItem value="custom">Tùy chỉnh</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="ext-reason">
                            Lý do gia hạn *
                          </Label>
                          <Textarea
                            id="ext-reason"
                            placeholder="Giải thích lý do gia hạn visa (ví dụ: tiếp tục học tập, dự án nghiên cứu, hoàn thành luận văn)..."
                            className="mt-2"
                            rows={4}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="ext-program-status">
                            Tình trạng chương trình hiện tại
                          </Label>
                          <Textarea
                            id="ext-program-status"
                            placeholder="Mô tả tiến độ học tập hiện tại và thời gian hoàn thành dự kiến..."
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* NA5/NA6 Letter Request */}
                    <Card className="p-4 bg-accent/30">
                      <h4 className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-primary" />
                        Yêu Cầu Công Văn
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="request-na5"
                            className="w-4 h-4 rounded border-input"
                            defaultChecked
                          />
                          <Label htmlFor="request-na5" className="cursor-pointer">
                            Yêu cầu Công văn NA5 (Thư hỗ trợ gia hạn visa)
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="request-na6"
                            className="w-4 h-4 rounded border-input"
                          />
                          <Label htmlFor="request-na6" className="cursor-pointer">
                            Yêu cầu Công văn NA6 (nếu có)
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Các công văn chính thức sẽ được admin tạo sau khi phê duyệt
                        </p>
                      </div>
                    </Card>

                    {/* Supporting Documents */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-primary" />
                        Supporting Documents
                      </h4>

                      <div className="space-y-3">
                       
                        <FileUploadBox label="Current Passport Copy*" onFileSelect={handleFile} />
                       
                        <FileUploadBox label="Current Visa Page Copy*" onFileSelect={handleFile} />

                        
                        <FileUploadBox label="Academic Progress Report (Optional)" onFileSelect={handleFile} />

                        <FileUploadBox label="Additional Documents (Optional)" onFileSelect={handleFile} />
                      </div>
                    </div>

                    {/* Important Notes */}
                    <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="mb-2 text-yellow-900 dark:text-yellow-100">
                            Important Notes
                          </h4>
                          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc list-inside">
                            <li>
                              Submit extension request at least 30 days before
                              current visa expiry
                            </li>
                            <li>
                              Processing time is typically 15-20 working days
                            </li>
                            <li>
                              All documents must be clear and readable
                            </li>
                            <li>
                              Admin will review and may request additional
                              documents
                            </li>
                            <li>
                              You will be notified via email once the request is
                              processed
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

          <DialogFooter className="mt-4 border-t pt-4 ">
            <Button
              variant="outline"
              onClick={() => {
                setIsVisaExtensionOpen(false);
                setSelectedForExtension(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Lưu nháp
            </Button>
            <Button className="bg-primary" onClick={handleSubmitExtension} disabled={isSubmittingExtension}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmittingExtension ? 'Đang gửi...' : 'Gửi yêu cầu gia hạn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}