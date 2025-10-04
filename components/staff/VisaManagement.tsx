"use client";

import React from "react";
import { useState } from "react";
import {
  GraduationCap,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  RefreshCw,
  Send,
  Eye,
  Download,
  Upload,
  ArrowRight,
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Breadcrumbs } from "../Breadcrumbs";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Progress } from "../ui/progress";

interface VisaExtension {
  id: string;
  requestDate: string;
  currentExpiry: string;
  requestedExpiry: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "completed" | "rejected";
  reason: string;
  documents: string[];
  timeline: {
    step: string;
    date: string;
    status: "completed" | "current" | "pending";
    note?: string;
  }[];
}

const studentsWithVisa = [
  {
    id: "INT-2025-001",
    fullName: "Maria Garcia Rodriguez",
    nationality: "Tây Ban Nha",
    program: "Thạc sĩ Khoa học Máy tính",
    visaType: "Student Visa (F-1)",
    visaNumber: "F1234567",
    currentExpiry: "2026-06-30",
    daysUntilExpiry: 269,
    status: "active",
    supervisor: "GS. Nguyễn Văn A",
    extensions: [
      {
        id: "EXT-001",
        requestDate: "2025-09-15",
        currentExpiry: "2025-12-31",
        requestedExpiry: "2026-06-30",
        status: "completed" as const,
        reason: "Hoàn thành luận văn thạc sĩ",
        documents: ["passport.pdf", "transcript.pdf", "na5_request.pdf"],
        timeline: [
          {
            step: "Nộp đơn",
            date: "15/09/2025",
            status: "completed" as const,
            note: "Đơn đã được nộp",
          },
          {
            step: "Xét duyệt",
            date: "18/09/2025",
            status: "completed" as const,
            note: "Admin đang xem xét",
          },
          {
            step: "Phê duyệt",
            date: "22/09/2025",
            status: "completed" as const,
            note: "Đơn đã được phê duyệt",
          },
          {
            step: "Cấp công văn NA5",
            date: "25/09/2025",
            status: "completed" as const,
            note: "Công văn đã được cấp",
          },
          {
            step: "Hoàn thành",
            date: "30/09/2025",
            status: "completed" as const,
            note: "Visa đã được gia hạn",
          },
        ],
      },
    ],
  },
  {
    id: "INT-2025-002",
    fullName: "Chen Wei",
    nationality: "Trung Quốc",
    program: "Thực tập nghiên cứu - AI Lab",
    visaType: "Exchange Visitor (J-1)",
    visaNumber: "J9876543",
    currentExpiry: "2025-10-20",
    daysUntilExpiry: 16,
    status: "extension-requested",
    supervisor: "TS. Trần Thị B",
    extensions: [
      {
        id: "EXT-002",
        requestDate: "2025-10-01",
        currentExpiry: "2025-10-20",
        requestedExpiry: "2026-04-20",
        status: "under-review" as const,
        reason: "Tiếp tục dự án nghiên cứu AI",
        documents: ["passport.pdf", "research_progress.pdf"],
        timeline: [
          {
            step: "Nộp đơn",
            date: "01/10/2025",
            status: "completed" as const,
            note: "Đơn đã được nộp",
          },
          {
            step: "Xét duyệt",
            date: "02/10/2025",
            status: "current" as const,
            note: "Đang chờ admin xem xét",
          },
          {
            step: "Phê duyệt",
            date: "",
            status: "pending" as const,
          },
          {
            step: "Cấp công văn NA5",
            date: "",
            status: "pending" as const,
          },
          {
            step: "Hoàn thành",
            date: "",
            status: "pending" as const,
          },
        ],
      },
    ],
  },
  {
    id: "INT-2025-003",
    fullName: "Ahmed Hassan",
    nationality: "Ai Cập",
    program: "Tiến sĩ Kỹ thuật Cơ khí",
    visaType: "Student Visa (F-1)",
    visaNumber: "F8765432",
    currentExpiry: "2029-06-30",
    daysUntilExpiry: 1729,
    status: "active",
    supervisor: "GS. Lê Văn C",
    extensions: [],
  },
];

export function VisaManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsWithVisa[0] | null>(null);
  const [isExtensionFormOpen, setIsExtensionFormOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<VisaExtension | null>(null);

  const filteredStudents = studentsWithVisa.filter((student) => {
    return (
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getExpiryStatus = (days: number) => {
    if (days <= 30) return { color: "red", label: "Khẩn cấp", variant: "destructive" as const };
    if (days <= 90) return { color: "orange", label: "Sắp hết hạn", variant: "secondary" as const };
    return { color: "green", label: "Còn hiệu lực", variant: "default" as const };
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      draft: { color: "gray", label: "Nháp", icon: <FileText className="w-4 h-4" /> },
      submitted: { color: "blue", label: "Đã nộp", icon: <Send className="w-4 h-4" /> },
      "under-review": { color: "orange", label: "Đang xét", icon: <Clock className="w-4 h-4" /> },
      approved: { color: "green", label: "Đã duyệt", icon: <CheckCircle className="w-4 h-4" /> },
      completed: { color: "green", label: "Hoàn thành", icon: <CheckCircle className="w-4 h-4" /> },
      rejected: { color: "red", label: "Từ chối", icon: <AlertCircle className="w-4 h-4" /> },
    };
    return statusMap[status] || statusMap.draft;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Sinh viên quốc tế" }, { label: "Quản lý Visa" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản Lý Visa & Gia Hạn</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi tình trạng visa và xử lý đơn gia hạn
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Sắp hết hạn</p>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mb-1">1</h2>
            <p className="text-sm text-muted-foreground">Trong vòng 30 ngày</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Đang xét duyệt</p>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="mb-1">1</h2>
            <p className="text-sm text-muted-foreground">Chờ phê duyệt</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Đã hoàn thành</p>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="mb-1">1</h2>
            <p className="text-sm text-muted-foreground">Trong tháng này</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Tổng sinh viên</p>
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="mb-1">3</h2>
            <p className="text-sm text-muted-foreground">Đang theo dõi</p>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, quốc tịch hoặc chương trình..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => {
          const expiryStatus = getExpiryStatus(student.daysUntilExpiry);
          const latestExtension = student.extensions[student.extensions.length - 1];

          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3>{student.fullName}</h3>
                        {student.status === "extension-requested" && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Đang xét gia hạn
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{student.program}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          {student.nationality}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {student.visaType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={expiryStatus.variant}>
                      {expiryStatus.label}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Hết hạn: {student.currentExpiry}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Còn {student.daysUntilExpiry} ngày
                    </p>
                  </div>
                </div>

                {/* Visa Status Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Trạng thái visa
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((student.daysUntilExpiry / 365) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min((student.daysUntilExpiry / 365) * 100, 100)}
                    className="h-2"
                  />
                </div>

                {/* Latest Extension Status */}
                {latestExtension && (
                  <Card className="p-4 bg-accent/30 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusInfo(latestExtension.status).icon}
                        <div>
                          <p className="font-medium">
                            Đơn gia hạn {latestExtension.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Nộp ngày: {latestExtension.requestDate}
                          </p>
                        </div>
                      </div>
                      <Badge>{getStatusInfo(latestExtension.status).label}</Badge>
                    </div>

                    {/* Mini Timeline */}
                    <div className="mt-4 flex items-center gap-2">
                      {latestExtension.timeline.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                              item.status === "completed"
                                ? "bg-green-500 text-white"
                                : item.status === "current"
                                ? "bg-blue-500 text-white animate-pulse"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          {index < latestExtension.timeline.length - 1 && (
                            <div
                              className={`w-8 h-0.5 ${
                                item.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                  {latestExtension && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExtension(latestExtension)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Theo dõi đơn
                    </Button>
                  )}
                  {student.daysUntilExpiry <= 90 && !latestExtension?.status.includes("under-review") && (
                    <Button
                      size="sm"
                      className="bg-primary"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsExtensionFormOpen(true);
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Gia hạn visa
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Extension Timeline Dialog */}
      <Dialog
        open={!!selectedExtension}
        onOpenChange={(open) => !open && setSelectedExtension(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Theo Dõi Đơn Gia Hạn</DialogTitle>
            <DialogDescription>
              Chi tiết quy trình xử lý đơn gia hạn visa
            </DialogDescription>
          </DialogHeader>
          {selectedExtension && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Extension Info */}
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mã đơn</Label>
                      <p className="mt-1 font-medium">{selectedExtension.id}</p>
                    </div>
                    <div>
                      <Label>Ngày nộp</Label>
                      <p className="mt-1">{selectedExtension.requestDate}</p>
                    </div>
                    <div>
                      <Label>Hết hạn hiện tại</Label>
                      <p className="mt-1 text-destructive">
                        {selectedExtension.currentExpiry}
                      </p>
                    </div>
                    <div>
                      <Label>Gia hạn đến</Label>
                      <p className="mt-1 text-green-600">
                        {selectedExtension.requestedExpiry}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label>Lý do</Label>
                      <p className="mt-1">{selectedExtension.reason}</p>
                    </div>
                  </div>
                </Card>

                {/* Timeline */}
                <div>
                  <h4 className="mb-4">Tiến Trình Xử Lý</h4>
                  <div className="space-y-4">
                    {selectedExtension.timeline.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.status === "completed"
                                ? "bg-green-500 text-white"
                                : item.status === "current"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {item.status === "completed" ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : item.status === "current" ? (
                              <Clock className="w-5 h-5 animate-pulse" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            )}
                          </div>
                          {index < selectedExtension.timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-full min-h-[40px] ${
                                item.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h4
                            className={
                              item.status === "current" ? "text-primary" : ""
                            }
                          >
                            {item.step}
                          </h4>
                          {item.date && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.date}
                            </p>
                          )}
                          {item.note && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              {item.note}
                            </p>
                          )}
                          {item.status === "current" && (
                            <div className="mt-2">
                              <Badge variant="secondary">Đang xử lý</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="mb-3">Tài Liệu Đính Kèm</h4>
                  <div className="space-y-2">
                    {selectedExtension.documents.map((doc, index) => (
                      <Card key={index} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedExtension(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extension Form Dialog (simplified - reuse from InternationalMembers) */}
      <Dialog open={isExtensionFormOpen} onOpenChange={setIsExtensionFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo Đơn Gia Hạn Visa</DialogTitle>
            <DialogDescription>
              Gửi yêu cầu gia hạn visa cho {selectedStudent?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Visa sẽ hết hạn sau {selectedStudent?.daysUntilExpiry} ngày
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                    Vui lòng nộp đơn gia hạn trước ít nhất 30 ngày
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4">
              <div>
                <Label>Ngày gia hạn yêu cầu *</Label>
                <Input type="date" className="mt-2" />
              </div>
              <div>
                <Label>Thời gian gia hạn</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 tháng</SelectItem>
                    <SelectItem value="12">12 tháng</SelectItem>
                    <SelectItem value="24">24 tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lý do gia hạn *</Label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  placeholder="Mô tả lý do cần gia hạn visa..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExtensionFormOpen(false)}
            >
              Hủy
            </Button>
            <Button className="bg-primary">
              <Send className="w-4 h-4 mr-2" />
              Gửi đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
