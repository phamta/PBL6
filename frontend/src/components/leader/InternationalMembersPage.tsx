"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Search, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  UserPlus,
  FileText,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  Check,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileCheck,
  Flag,
  GraduationCap,
  RefreshCw,
  User,
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
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
  Legend,
} from "recharts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { visaService } from "@/lib/api";

// Types for API data
interface VisaExtension {
  id: string;
  visaId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  newExpirationDate: string;
  reason: string;
  createdAt: string;
  approvedBy?: {
    id: string;
    fullName: string;
  };
  approvedAt?: string;
  comments?: string;
}

interface VisaApplication {
  id: string;
  holderName: string;
  holderCountry: string;
  passportNumber: string;
  visaNumber: string;
  issueDate: string;
  expirationDate: string;
  purpose: string;
  sponsorUnit: string;
  status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'EXTENDED' | 'CANCELLED';
  dateOfBirth?: string;
  visaType?: string;
  entryDate?: string;
  program?: string;
  department?: string;
  email?: string;
  phone?: string;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  unit?: {
    id: string;
    name: string;
    code: string;
  };
  extensions: VisaExtension[];
  foreignStudents: Array<{
    id: string;
    fullName: string;
    nationality: string;
  }>;
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

const membersData = [
  {
    id: "INT-001",
    name: "Maria Garcia Rodriguez",
    role: "Student",
    nationality: "Spain",
    status: "active",
    program: "Master's in Computer Science",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2026-06-30",
    visaStatus: "valid",
    startDate: "2024-09-01",
    endDate: "2026-06-30",
    email: "maria.garcia@university.edu",
  },
  {
    id: "INT-002",
    name: "Chen Wei",
    role: "Trainee",
    nationality: "China",
    status: "active",
    program: "Research Internship - AI Lab",
    visaType: "Exchange Visitor (J-1)",
    visaExpiry: "2025-10-20",
    visaStatus: "expiring-soon",
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    email: "chen.wei@university.edu",
  },
  {
    id: "INT-003",
    name: "Prof. John Smith",
    role: "Lecturer",
    nationality: "USA",
    status: "active",
    program: "Visiting Professor - Engineering",
    visaType: "Work Visa (H-1B)",
    visaExpiry: "2025-12-31",
    visaStatus: "valid",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    email: "j.smith@university.edu",
  },
  {
    id: "INT-004",
    name: "Yuki Tanaka",
    role: "Student",
    nationality: "Japan",
    status: "active",
    program: "Exchange Student - Business",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2026-01-31",
    visaStatus: "valid",
    startDate: "2025-09-01",
    endDate: "2026-01-31",
    email: "yuki.tanaka@university.edu",
  },
  {
    id: "INT-005",
    name: "Ahmed Hassan",
    role: "Student",
    nationality: "Egypt",
    status: "pending",
    program: "PhD in Mechanical Engineering",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2029-06-30",
    visaStatus: "under-renewal",
    startDate: "2025-10-15",
    endDate: "2029-06-30",
    email: "ahmed.hassan@university.edu",
  },
  {
    id: "INT-006",
    name: "Dr. Sophie Dubois",
    role: "Lecturer",
    nationality: "France",
    status: "active",
    program: "Visiting Researcher - Chemistry",
    visaType: "Exchange Visitor (J-1)",
    visaExpiry: "2025-11-30",
    visaStatus: "expiring-soon",
    startDate: "2024-06-01",
    endDate: "2025-11-30",
    email: "sophie.dubois@university.edu",
  },
  {
    id: "INT-007",
    name: "Raj Patel",
    role: "Trainee",
    nationality: "India",
    status: "completed",
    program: "Industrial Training - Software Dev",
    visaType: "Training Visa (H-3)",
    visaExpiry: "2024-12-31",
    visaStatus: "expired",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    email: "raj.patel@university.edu",
  },
  {
    id: "INT-008",
    name: "Anna Kowalski",
    role: "Student",
    nationality: "Poland",
    status: "active",
    program: "Bachelor's in Architecture",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2026-06-30",
    visaStatus: "valid",
    startDate: "2023-09-01",
    endDate: "2026-06-30",
    email: "anna.kowalski@university.edu",
  },
];

const nationalityDistribution = [
  { country: "Spain", count: 2, color: "#3b82f6" },
  { country: "China", count: 3, color: "#8b5cf6" },
  { country: "USA", count: 1, color: "#06b6d4" },
  { country: "Japan", count: 1, color: "#10b981" },
  { country: "India", count: 2, color: "#f59e0b" },
  { country: "France", count: 1, color: "#ec4899" },
  { country: "Others", count: 3, color: "#6b7280" },
];

const programDistribution = [
  { program: "Students", count: 5 },
  { program: "Trainees", count: 2 },
  { program: "Lecturers", count: 4 },
];

const visaTypeDistribution = [
  { type: "Student Visa", count: 5 },
  { type: "Exchange Visitor", count: 3 },
  { type: "Work Visa", count: 3 },
  { type: "Training Visa", count: 2 },
];

export function InternationalMembersPage() {
  // State management
  const [visas, setVisas] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null);
  const [selectedMember, setSelectedMember] = useState<typeof membersData[0] | null>(null);
  const [selectedExtension, setSelectedExtension] = useState<VisaExtension | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [extensionStatusFilter, setExtensionStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch visa applications on mount
  useEffect(() => {
    const fetchVisas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await visaService.list({});
        console.log('Visa data received:', response);
        setVisas(response.visas || []);
      } catch (err) {
        console.error('Error fetching visas:', err);
        setError('Không thể tải dữ liệu đơn visa');
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  // Get pending extension requests (for officer to approve)
  const pendingExtensions = visas.flatMap(visa => 
    visa.extensions
      .filter(ext => ext.status === 'PENDING')
      .map(ext => ({ ...ext, visa }))
  );

  // Get processed extension requests
  const processedExtensions = visas.flatMap(visa => 
    visa.extensions
      .filter(ext => ext.status !== 'PENDING')
      .map(ext => ({ ...ext, visa }))
  );

  // Statistics
  const totalPendingExtensions = pendingExtensions.length;
  const totalApprovedExtensions = processedExtensions.filter(e => e.status === 'APPROVED').length;
  const totalRejectedExtensions = processedExtensions.filter(e => e.status === 'REJECTED').length;
  const totalActiveVisas = visas.filter(v => v.status === 'ACTIVE').length;

  // Handle approval/rejection
  const handleOpenApprovalDialog = (extension: VisaExtension & { visa: VisaApplication }, action: 'APPROVE' | 'REJECT') => {
    setSelectedExtension(extension);
    setApprovalAction(action);
    setApprovalComments("");
    setIsApprovalDialogOpen(true);
  };

  const handleSubmitApproval = async () => {
    if (!selectedExtension || !approvalAction) return;

    try {
      setIsSubmitting(true);
      
      // Call API to approve/reject extension
      await visaService.approveExtension(selectedExtension.id, {
        action: approvalAction,
        comments: approvalComments,
      });

      // Refresh data
      const response = await visaService.list({});
      setVisas(response.visas || []);

      // Close dialog
      setIsApprovalDialogOpen(false);
      setSelectedExtension(null);
      setApprovalAction(null);
      setApprovalComments("");

      alert(`Đơn gia hạn đã được ${approvalAction === 'APPROVE' ? 'phê duyệt' : 'từ chối'} thành công!`);
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Có lỗi xảy ra khi xử lý đơn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExtensionStatusBadge = (status: string) => {
    const config = {
      PENDING: { 
        variant: "secondary" as const, 
        label: "Chờ duyệt",
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      APPROVED: { 
        variant: "default" as const, 
        label: "Đã duyệt",
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      REJECTED: { 
        variant: "destructive" as const, 
        label: "Từ chối",
        icon: <XCircle className="w-3 h-3 mr-1" />
      },
    };
    const c = config[status as keyof typeof config] || { variant: "outline" as const, label: status, icon: null };
    return (
      <Badge variant={c.variant} className="flex items-center w-fit">
        {c.icon}
        {c.label}
      </Badge>
    );
  };

  const getVisaStatusBadge = (status: string) => {
    const config = {
      ACTIVE: { variant: "default" as const, label: "Hoạt động", className: "bg-green-100 text-green-800" },
      EXPIRING: { variant: "secondary" as const, label: "Sắp hết hạn", className: "bg-orange-100 text-orange-800" },
      EXPIRED: { variant: "destructive" as const, label: "Hết hạn", className: "" },
      EXTENDED: { variant: "outline" as const, label: "Đã gia hạn", className: "bg-blue-100 text-blue-800" },
      CANCELLED: { variant: "outline" as const, label: "Đã hủy", className: "bg-gray-100 text-gray-800" },
    };
    const c = config[status as keyof typeof config] || { variant: "outline" as const, label: status, className: "" };
    return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
  };

  const filteredMembers = membersData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      active: { variant: "default", label: "Active" },
      pending: { variant: "secondary", label: "Pending" },
      completed: { variant: "outline", label: "Completed" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Student: "bg-blue-100 text-blue-700",
      Trainee: "bg-purple-100 text-purple-700",
      Lecturer: "bg-green-100 text-green-700",
    };
    return (
      <Badge variant="outline" className={colors[role] || ""}>
        {role}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExportReport = (format: "csv" | "excel" | "word") => {
    console.log(`Exporting report as ${format.toUpperCase()}`);
  };

  const handlePrintLetter = () => {
    console.log("Printing official letter");
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  const expiringCount = membersData.filter(m => m.visaStatus === "expiring-soon").length;
  const renewalCount = membersData.filter(m => m.visaStatus === "under-renewal").length;
  const validCount = membersData.filter(m => m.visaStatus === "valid").length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Sinh viên quốc tế" }]} />
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Visa & Gia hạn</h1>
          <p className="text-muted-foreground mt-1">
            Duyệt đơn gia hạn visa, xét hồ sơ và tạo công văn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="pending" className="relative">
            Chờ duyệt
            {totalPendingExtensions > 0 && (
              <Badge className="ml-2 bg-red-500 text-white h-5 px-1.5" variant="destructive">
                {totalPendingExtensions}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed">Đã xử lý</TabsTrigger>
          <TabsTrigger value="members">Danh sách Visa</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        {/* Pending Extensions Tab */}
        <TabsContent value="pending" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                  <p className="text-2xl font-bold">{totalPendingExtensions}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đã duyệt</p>
                  <p className="text-2xl font-bold">{totalApprovedExtensions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Từ chối</p>
                  <p className="text-2xl font-bold">{totalRejectedExtensions}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visa hoạt động</p>
                  <p className="text-2xl font-bold">{totalActiveVisas}</p>
                </div>
                <FileCheck className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Pending Extension Requests */}
          {loading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="ml-3 text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            </Card>
          ) : error ? (
            <Card className="p-6">
              <div className="flex items-center justify-center py-8">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <p className="ml-3 text-destructive">{error}</p>
              </div>
            </Card>
          ) : pendingExtensions.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileCheck className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Không có đơn chờ duyệt</h3>
                <p className="text-muted-foreground">
                  Hiện tại không có đơn gia hạn visa nào cần xử lý
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingExtensions.map((extension: any) => (
                <motion.div
                  key={extension.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {getInitials(extension.visa.holderName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{extension.visa.holderName}</h3>
                              {getExtensionStatusBadge(extension.status)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Flag className="w-4 h-4" />
                                {extension.visa.holderCountry}
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {extension.visa.visaNumber}
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                {extension.visa.program || 'N/A'}
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium">Ngày hết hạn hiện tại:</span>
                                <p className="text-muted-foreground">{formatDate(extension.visa.expirationDate)}</p>
                              </div>
                              <div>
                                <span className="font-medium">Ngày gia hạn yêu cầu:</span>
                                <p className="text-primary font-medium">{formatDate(extension.newExpirationDate)}</p>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Lý do gia hạn:</span>
                              <p className="text-muted-foreground mt-1">{extension.reason}</p>
                            </div>
                            <div>
                              <span className="font-medium">Ngày nộp đơn:</span>
                              <p className="text-muted-foreground">{formatDate(extension.createdAt)}</p>
                            </div>
                            <div>
                              <span className="font-medium">Người nộp đơn:</span>
                              <p className="text-muted-foreground">{extension.visa.createdBy.fullName}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleOpenApprovalDialog(extension, 'APPROVE')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Phê duyệt
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleOpenApprovalDialog(extension, 'REJECT')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Từ chối
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedVisa(extension.visa)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Processed Extensions Tab */}
        <TabsContent value="processed" className="space-y-4">
          {/* Filter */}
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm theo tên, quốc tịch, số visa..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={extensionStatusFilter} onValueChange={setExtensionStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Processed Requests */}
          <div className="space-y-4">
            {processedExtensions
              .filter(ext => extensionStatusFilter === 'all' || ext.status === extensionStatusFilter)
              .map((extension: any) => (
                <Card key={extension.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(extension.visa.holderName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold">{extension.visa.holderName}</h3>
                            {getExtensionStatusBadge(extension.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Flag className="w-4 h-4" />
                              {extension.visa.holderCountry}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {extension.visa.visaNumber}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ngày gia hạn:</span>
                            <p className="font-medium">{formatDate(extension.newExpirationDate)}</p>
                          </div>
                          {extension.approvedBy && (
                            <div>
                              <span className="text-muted-foreground">Người xử lý:</span>
                              <p className="font-medium">{extension.approvedBy.fullName}</p>
                            </div>
                          )}
                          {extension.approvedAt && (
                            <div>
                              <span className="text-muted-foreground">Ngày xử lý:</span>
                              <p className="font-medium">{formatDate(extension.approvedAt)}</p>
                            </div>
                          )}
                          {extension.comments && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Ghi chú:</span>
                              <p className="font-medium">{extension.comments}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedVisa(extension.visa)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Members Tab (Original) */}
        <TabsContent value="members" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Trainee">Trainee</SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 bg-primary text-primary-foreground">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 truncate">{member.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {member.nationality}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                    <div className="mb-2">
                      {getVisaStatusBadge(member.visaStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {member.program}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Total Members</p>
                  <h2 className="mt-1">{membersData.length}</h2>
                </div>
                <Globe className="w-10 h-10 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Active Programs</p>
                  <h2 className="mt-1">
                    {membersData.filter(m => m.status === "active").length}
                  </h2>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Countries</p>
                  <h2 className="mt-1">{nationalityDistribution.length}</h2>
                </div>
                <Globe className="w-10 h-10 text-cyan-500" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Distribution by Nationality</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nationalityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, percent }) =>
                        `${country} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {nationalityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Distribution by Role</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={programDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="program" />
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

            <Card className="p-6">
              <h3 className="mb-4">Distribution by Visa Type</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={visaTypeDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      radius={[0, 8, 8, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Quick Export</h3>
              <p className="text-muted-foreground mb-6">
                Generate comprehensive reports in various formats
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportReport("csv")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportReport("excel")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportReport("word")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as Word
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Visa Management Tab */}
        <TabsContent value="visa" className="space-y-6">
          {/* Visa Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Expiring Soon</p>
                  <h2 className="mt-1">{expiringCount}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Within 1 month
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Under Renewal</p>
                  <h2 className="mt-1">{renewalCount}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    In process
                  </p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Valid Visas</p>
                  <h2 className="mt-1">{validCount}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    No action needed
                  </p>
                </div>
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Card>
          </div>

          {/* Visa Extension Requests */}
          <Card className="p-6">
            <h3 className="mb-4">Recent Visa Extension Requests</h3>
            <div className="space-y-3">
              {membersData
                .filter(m => m.visaStatus === "expiring-soon" || m.visaStatus === "under-renewal")
                .map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4>{member.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Visa expires: {member.visaExpiry}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVisaStatusBadge(member.visaStatus)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedMember(member)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Review Request
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrintLetter}>
                              <Printer className="w-4 h-4 mr-2" />
                              Print Letter
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-green-600">
                              <Check className="w-4 h-4 mr-2" />
                              Approve Extension
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Detail Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              View and manage international member information
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="dialog-body max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 bg-primary text-primary-foreground">
                    <AvatarFallback className="text-xl">
                      {getInitials(selectedMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{selectedMember.name}</h3>
                    <p className="text-muted-foreground">{selectedMember.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Member ID</Label>
                    <p className="mt-1">{selectedMember.id}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p className="mt-1">{selectedMember.nationality}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1">{getRoleBadge(selectedMember.role)}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedMember.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Program</Label>
                    <p className="mt-1">{selectedMember.program}</p>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <p className="mt-1">{selectedMember.startDate}</p>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <p className="mt-1">{selectedMember.endDate}</p>
                  </div>
                </div>

                <Card className="p-4 bg-accent/50">
                  <h4 className="mb-3">Visa Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Visa Type</Label>
                      <p className="mt-1">{selectedMember.visaType}</p>
                    </div>
                    <div>
                      <Label>Visa Status</Label>
                      <div className="mt-1">{getVisaStatusBadge(selectedMember.visaStatus)}</div>
                    </div>
                    <div className="col-span-2">
                      <Label>Expiry Date</Label>
                      <p className="mt-1">{selectedMember.visaExpiry}</p>
                    </div>
                  </div>
                </Card>

                {(selectedMember.visaStatus === "expiring-soon" || 
                  selectedMember.visaStatus === "under-renewal") && (
                  <Card className="p-4">
                    <h4 className="mb-3">Visa Extension Actions</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add notes or comments about the visa extension request..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-2" />
                          Approve Extension
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={handlePrintLetter}>
                          <Printer className="w-4 h-4 mr-2" />
                          Generate Letter
                        </Button>
                      </div>
                    </div>
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
              Edit Details
            </Button>
            <Button variant="outline" onClick={handlePrintLetter}>
              <Printer className="w-4 h-4 mr-2" />
              Print Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {approvalAction === 'APPROVE' ? (
                <><CheckCircle className="w-5 h-5 text-green-600" /> Phê duyệt đơn gia hạn</>
              ) : (
                <><XCircle className="w-5 h-5 text-red-600" /> Từ chối đơn gia hạn</>
              )}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'APPROVE' 
                ? 'Xác nhận phê duyệt đơn gia hạn visa này'
                : 'Vui lòng nhập lý do từ chối đơn gia hạn'}
            </DialogDescription>
          </DialogHeader>

          {selectedExtension && (
            <div className="space-y-4">
              {/* Extension Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Người nộp đơn:</span>
                    <p className="text-muted-foreground">{(selectedExtension as any).visa?.holderName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Số visa:</span>
                    <p className="text-muted-foreground">{(selectedExtension as any).visa?.visaNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium">Hết hạn hiện tại:</span>
                    <p className="text-muted-foreground">{formatDate((selectedExtension as any).visa?.expirationDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Ngày gia hạn yêu cầu:</span>
                    <p className="text-primary font-medium">{formatDate(selectedExtension.newExpirationDate)}</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Lý do:</span>
                  <p className="text-muted-foreground">{selectedExtension.reason}</p>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">
                  {approvalAction === 'APPROVE' ? 'Ghi chú (tùy chọn)' : 'Lý do từ chối *'}
                </Label>
                <Textarea
                  id="comments"
                  placeholder={approvalAction === 'APPROVE' 
                    ? 'Nhập ghi chú nếu cần...'
                    : 'Nhập lý do từ chối đơn gia hạn...'}
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsApprovalDialogOpen(false);
                setSelectedExtension(null);
                setApprovalAction(null);
                setApprovalComments("");
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant={approvalAction === 'APPROVE' ? 'default' : 'destructive'}
              onClick={handleSubmitApproval}
              disabled={isSubmitting || (approvalAction === 'REJECT' && !approvalComments.trim())}
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : approvalAction === 'APPROVE' ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Đang xử lý...' : approvalAction === 'APPROVE' ? 'Phê duyệt' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visa Detail Dialog */}
      <Dialog open={!!selectedVisa} onOpenChange={(open) => !open && setSelectedVisa(null)}>
        <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Visa</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về visa và lịch sử gia hạn
            </DialogDescription>
          </DialogHeader>

          {selectedVisa && (
            <div className="dialog-body max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Họ và tên:</span>
                    <p className="font-medium">{selectedVisa.holderName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quốc tịch:</span>
                    <p className="font-medium">{selectedVisa.holderCountry}</p>
                  </div>
                  {selectedVisa.dateOfBirth && (
                    <div>
                      <span className="text-muted-foreground">Ngày sinh:</span>
                      <p className="font-medium">{formatDate(selectedVisa.dateOfBirth)}</p>
                    </div>
                  )}
                  {selectedVisa.email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedVisa.email}</p>
                    </div>
                  )}
                  {selectedVisa.phone && (
                    <div>
                      <span className="text-muted-foreground">Điện thoại:</span>
                      <p className="font-medium">{selectedVisa.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Số hộ chiếu:</span>
                    <p className="font-medium">{selectedVisa.passportNumber}</p>
                  </div>
                </div>
              </div>

              {/* Visa Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thông tin Visa
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Số visa:</span>
                    <p className="font-medium">{selectedVisa.visaNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <div className="mt-1">{getVisaStatusBadge(selectedVisa.status)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ngày cấp:</span>
                    <p className="font-medium">{formatDate(selectedVisa.issueDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ngày hết hạn:</span>
                    <p className="font-medium">{formatDate(selectedVisa.expirationDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mục đích:</span>
                    <p className="font-medium">{selectedVisa.purpose}</p>
                  </div>
                  {selectedVisa.program && (
                    <div>
                      <span className="text-muted-foreground">Chương trình:</span>
                      <p className="font-medium">{selectedVisa.program}</p>
                    </div>
                  )}
                  {selectedVisa.department && (
                    <div>
                      <span className="text-muted-foreground">Khoa/Đơn vị:</span>
                      <p className="font-medium">{selectedVisa.department}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Đơn vị bảo lãnh:</span>
                    <p className="font-medium">{selectedVisa.sponsorUnit}</p>
                  </div>
                </div>
              </div>

              {/* Extension History */}
              {selectedVisa.extensions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Lịch sử gia hạn ({selectedVisa.extensions.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedVisa.extensions.map((ext) => (
                      <div key={ext.id} className="border rounded-lg p-3 bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          {getExtensionStatusBadge(ext.status)}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(ext.createdAt)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ngày gia hạn:</span>
                            <p className="font-medium">{formatDate(ext.newExpirationDate)}</p>
                          </div>
                          {ext.approvedBy && (
                            <div>
                              <span className="text-muted-foreground">Người duyệt:</span>
                              <p className="font-medium">{ext.approvedBy.fullName}</p>
                            </div>
                          )}
                        </div>
                        {ext.reason && (
                          <div className="mt-2">
                            <span className="text-muted-foreground text-sm">Lý do:</span>
                            <p className="text-sm">{ext.reason}</p>
                          </div>
                        )}
                        {ext.comments && (
                          <div className="mt-2">
                            <span className="text-muted-foreground text-sm">Ghi chú:</span>
                            <p className="text-sm">{ext.comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVisa(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}