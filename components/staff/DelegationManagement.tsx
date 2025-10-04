"use client";

import React from "react";
import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash,
  Download,
  Eye,
  FileText,
  Printer,
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Filter,
  Grid,
  List,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { Breadcrumbs } from "../Breadcrumbs";

const delegationsData = [
  {
    id: 1,
    title: "Prof.",
    fullName: "Maria Garcia Rodriguez",
    gender: "Nữ",
    nationality: "Tây Ban Nha",
    passportNo: "ESP123456",
    jobPosition: "Giáo sư Kỹ thuật",
    affiliation: "Đại học Barcelona",
    visitDate: "15/10/2025 - 20/10/2025",
    location: "Tòa nhà Kỹ thuật, Phòng 301",
    purpose: "Hợp tác nghiên cứu và thảo luận đối tác",
    invitingUnit: "Khoa Kỹ thuật",
    email: "m.garcia@barcelona.edu",
    phone: "+34 123 456 789",
    birthdate: "15/03/1975",
    passportFile: "passport_garcia.pdf",
    status: "confirmed",
    createdDate: "03/10/2025",
  },
  {
    id: 2,
    title: "Dr.",
    fullName: "John Smith",
    gender: "Nam",
    nationality: "Mỹ",
    passportNo: "USA789012",
    jobPosition: "Giám đốc Nghiên cứu",
    affiliation: "MIT",
    visitDate: "22/10/2025 - 28/10/2025",
    location: "Phòng thí nghiệm, Tòa A",
    purpose: "Khởi động dự án nghiên cứu chung",
    invitingUnit: "Khoa Kỹ thuật",
    email: "j.smith@mit.edu",
    phone: "+1 555 123 4567",
    birthdate: "22/07/1980",
    passportFile: "passport_smith.pdf",
    status: "pending",
    createdDate: "02/10/2025",
  },
  {
    id: 3,
    title: "Dr.",
    fullName: "Chen Wei",
    gender: "Nam",
    nationality: "Trung Quốc",
    passportNo: "CHN345678",
    jobPosition: "Phó giáo sư",
    affiliation: "Đại học Thanh Hoa",
    visitDate: "05/11/2025 - 10/11/2025",
    location: "Hội trường",
    purpose: "Hội nghị học thuật và workshop",
    invitingUnit: "Khoa Kỹ thuật",
    email: "c.wei@tsinghua.edu",
    phone: "+86 10 1234 5678",
    birthdate: "08/11/1982",
    passportFile: "passport_chen.pdf",
    status: "confirmed",
    createdDate: "28/09/2025",
  },
  {
    id: 4,
    title: "Prof.",
    fullName: "Sophie Martin",
    gender: "Nữ",
    nationality: "Pháp",
    passportNo: "FRA456789",
    jobPosition: "Giáo sư AI",
    affiliation: "Đại học Sorbonne",
    visitDate: "12/11/2025 - 15/11/2025",
    location: "Phòng hội thảo B",
    purpose: "Diễn thuyết và trao đổi học thuật",
    invitingUnit: "Khoa Kỹ thuật",
    email: "s.martin@sorbonne.fr",
    phone: "+33 1 23 45 67 89",
    birthdate: "20/05/1978",
    passportFile: "passport_martin.pdf",
    status: "confirmed",
    createdDate: "25/09/2025",
  },
];

export function DelegationManagement() {
  const [selectedVisitor, setSelectedVisitor] = useState<typeof delegationsData[0] | null>(
    null
  );
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDelegations = delegationsData.filter((visitor) => {
    const matchesSearch =
      visitor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.affiliation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportReport = (format: "pdf" | "word") => {
    console.log(`Xuất báo cáo ${format.toUpperCase()}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      confirmed: { variant: "default", label: "Đã xác nhận" },
      pending: { variant: "secondary", label: "Chờ xác nhận" },
      cancelled: { variant: "outline", label: "Đã hủy" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Khai báo đoàn vào" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản Lý Đoàn Khách Quốc Tế</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin các đoàn khách quốc tế đến thăm đơn vị
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportReport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                Báo cáo PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport("word")}>
                <FileText className="w-4 h-4 mr-2" />
                Tài liệu Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary" onClick={() => setIsAddVisitorOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm khách mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm theo tên, quốc tịch hoặc cơ quan..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === "grid" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDelegations.map((visitor, index) => (
            <motion.div
              key={visitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4>
                        {visitor.title} {visitor.fullName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {visitor.jobPosition}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(visitor.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{visitor.affiliation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{visitor.nationality}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{visitor.visitDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground line-clamp-1">
                      {visitor.location}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {visitor.purpose}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedVisitor(visitor)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Danh xưng</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Quốc tịch</TableHead>
                    <TableHead>Số hộ chiếu</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead>Cơ quan</TableHead>
                    <TableHead>Ngày thăm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDelegations.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell>{visitor.id}</TableCell>
                      <TableCell>{visitor.title}</TableCell>
                      <TableCell>{visitor.fullName}</TableCell>
                      <TableCell>{visitor.gender}</TableCell>
                      <TableCell>{visitor.nationality}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {visitor.passportNo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {visitor.jobPosition}
                      </TableCell>
                      <TableCell>{visitor.affiliation}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {visitor.visitDate}
                      </TableCell>
                      <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedVisitor(visitor)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Add/Edit Visitor Dialog */}
      <Dialog open={isAddVisitorOpen} onOpenChange={setIsAddVisitorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Thêm Khách Mới</DialogTitle>
            <DialogDescription>
              Đăng ký thông tin khách quốc tế cho đơn vị của bạn
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="mb-4">Thông Tin Cá Nhân</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Danh xưng *</Label>
                    <Select>
                      <SelectTrigger id="title" className="mt-2">
                        <SelectValue placeholder="Chọn danh xưng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prof">GS. (Prof.)</SelectItem>
                        <SelectItem value="dr">TS. (Dr.)</SelectItem>
                        <SelectItem value="mr">Ông (Mr.)</SelectItem>
                        <SelectItem value="ms">Bà/Cô (Ms.)</SelectItem>
                        <SelectItem value="mrs">Bà (Mrs.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="full-name">Họ và tên đầy đủ *</Label>
                    <Input
                      id="full-name"
                      placeholder="Nhập họ và tên"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthdate">Ngày sinh *</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Giới tính *</Label>
                    <Select>
                      <SelectTrigger id="gender" className="mt-2">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Quốc tịch *</Label>
                    <Input
                      id="nationality"
                      placeholder="Ví dụ: Việt Nam"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passport">Số hộ chiếu *</Label>
                    <Input
                      id="passport"
                      placeholder="Số hộ chiếu"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="mb-4">Thông Tin Nghề Nghiệp</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-position">Chức vụ *</Label>
                    <Input
                      id="job-position"
                      placeholder="Ví dụ: Giáo sư, Nhà nghiên cứu"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="affiliation">Cơ quan *</Label>
                    <Input
                      id="affiliation"
                      placeholder="Tên cơ quan/tổ chức"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      placeholder="+84 123 456 789"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Visit Information */}
              <div>
                <h4 className="mb-4">Thông Tin Chuyến Thăm</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visit-date">Thời gian thăm *</Label>
                    <Input
                      id="visit-date"
                      placeholder="Ví dụ: 15-20/10/2025"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Địa điểm *</Label>
                    <Input
                      id="location"
                      placeholder="Tòa nhà và số phòng"
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="purpose">Mục đích chuyến thăm *</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Mô tả mục đích chuyến thăm..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="inviting-unit">Đơn vị mời *</Label>
                    <Input
                      id="inviting-unit"
                      defaultValue="Khoa Kỹ thuật"
                      className="mt-2"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <Label>Tải lên bản sao hộ chiếu</Label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click để tải lên bản sao hộ chiếu
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG tối đa 5MB
                  </p>
                </motion.div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVisitorOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-primary">
              <Users className="w-4 h-4 mr-2" />
              Lưu thông tin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Visitor Dialog */}
      <Dialog
        open={!!selectedVisitor}
        onOpenChange={(open) => !open && setSelectedVisitor(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Chi Tiết Khách</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về khách quốc tế
            </DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Danh xưng & Họ tên</Label>
                    <p className="mt-1">
                      {selectedVisitor.title} {selectedVisitor.fullName}
                    </p>
                  </div>
                  <div>
                    <Label>Ngày sinh</Label>
                    <p className="mt-1">{selectedVisitor.birthdate}</p>
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <p className="mt-1">{selectedVisitor.gender}</p>
                  </div>
                  <div>
                    <Label>Quốc tịch</Label>
                    <p className="mt-1">{selectedVisitor.nationality}</p>
                  </div>
                  <div>
                    <Label>Số hộ chiếu</Label>
                    <p className="mt-1">{selectedVisitor.passportNo}</p>
                  </div>
                  <div>
                    <Label>Chức vụ</Label>
                    <p className="mt-1">{selectedVisitor.jobPosition}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Cơ quan</Label>
                    <p className="mt-1">{selectedVisitor.affiliation}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1">{selectedVisitor.email}</p>
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <p className="mt-1">{selectedVisitor.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Thời gian & Địa điểm thăm</Label>
                    <p className="mt-1">{selectedVisitor.visitDate}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVisitor.location}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Mục đích chuyến thăm</Label>
                    <p className="mt-1">{selectedVisitor.purpose}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Đơn vị mời</Label>
                    <p className="mt-1">{selectedVisitor.invitingUnit}</p>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">{getStatusBadge(selectedVisitor.status)}</div>
                  </div>
                  <div>
                    <Label>Ngày tạo</Label>
                    <p className="mt-1">{selectedVisitor.createdDate}</p>
                  </div>
                </div>

                {selectedVisitor.passportFile && (
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p>Tệp hộ chiếu</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedVisitor.passportFile}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Tải xuống
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedVisitor(null)}>
              Đóng
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Sửa
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}