"use client";

import {
  FileText,
  Clock,
  File,
  Info,
  FilePlus,
  Phone,
  Mail,
  Facebook,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { visaService, CreateVisaDto } from "@/lib/api/visa.service";
import { Button } from "../ui/button";
import { StatCard } from "../StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import FileUploadBox from "@/components/FileUploadBox";
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
import { Textarea } from "../ui/textarea";

import { useState } from "react";

export function StudentDashboard() {
  const { user } = useAuth();
  // State for dialog
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [form, setForm] = useState<Partial<CreateVisaDto>>({
    holderName: "",
    dateOfBirth: "",
    holderCountry: "",
    passportNumber: "",
    visaNumber: "",
    visaType: "",
    entryDate: "",
    issueDate: "",
    expirationDate: "",
    purpose: "",
    sponsorUnit: "",
    program: "",
    department: "",
    supervisorName: "",
    email: "",
    phone: "",
    na5Request: false,
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧩 Validate function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // --- Thông tin cá nhân ---
    if (!form.holderName?.trim()) errors.holderName = "Họ tên là bắt buộc";
    if (!form.dateOfBirth) errors.dateOfBirth = "Ngày sinh là bắt buộc";
    if (!form.holderCountry?.trim())
      errors.holderCountry = "Quốc tịch là bắt buộc";
    if (!form.passportNumber?.trim())
      errors.passportNumber = "Số hộ chiếu là bắt buộc";
    if (!form.visaNumber?.trim()) errors.visaNumber = "Số visa là bắt buộc";

    // --- Thông tin học tập / công tác ---
    if (!form.program) errors.program = "Chương trình học là bắt buộc";
    if (!form.department)
      errors.department = "Khoa/Phòng tiếp nhận là bắt buộc";
    if (!form.issueDate) errors.issueDate = "Ngày cấp visa là bắt buộc";
    if (!form.expirationDate)
      errors.expirationDate = "Ngày hết hạn visa là bắt buộc";

    // --- Đề nghị gia hạn / NA5 ---
    if (form.na5Request && !form.purpose?.trim())
      errors.purpose =
        "Mục đích gia hạn (purpose) là bắt buộc khi có yêu cầu NA5";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle file selection
  const handleFile = (file: File | null) => {
    setForm((prev) => ({ ...prev, file }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Lấy lỗi đầu tiên và scroll tới đó
      const firstError = Object.keys(formErrors)[0];
      const el = document.getElementById(firstError);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      setIsSubmitting(true);

      // Chuẩn hóa dữ liệu gửi đi
      const payload: CreateVisaDto = {
        holderName: form.holderName!,
        holderCountry: form.holderCountry!,
        passportNumber: form.passportNumber!,
        visaNumber: form.visaNumber,
        visaType: form.visaType,
        issueDate: form.issueDate!,
        expirationDate: form.expirationDate!,
        purpose: form.purpose ?? "",
        sponsorUnit: form.sponsorUnit ?? "",
        dateOfBirth: form.dateOfBirth,
        entryDate: form.entryDate,
        program: form.program!,
        department: form.department!,
        supervisorName: form.supervisorName ?? "",
        email: form.email ?? "",
        phone: form.phone ?? "",
        attachments: form.attachments ?? [],
        na5Request: form.na5Request ?? false,
      };

      // 📨 Gửi API (ví dụ)
      //   await visaService.create(payload);

      // ✅ Reset form sau khi gửi thành công
      setForm({
        holderName: "",
        holderCountry: "",
        passportNumber: "",
        visaNumber: "",
        visaType: "",
        issueDate: "",
        expirationDate: "",
        purpose: "",
        sponsorUnit: "",
        dateOfBirth: "",
        entryDate: "",
        program: "",
        department: "",
        supervisorName: "",
        email: "",
        phone: "",
        attachments: [],
        na5Request: false,
      });
      setFormErrors({});
      setIsNewProposalOpen(false);

      alert("✅ Dữ liệu hợp lệ, gửi thành công!");
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      alert("❌ Gửi thất bại, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Visa Status Card */}
      <div className="relative bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 max-w-3xl mx-auto">
        <span className="text-base text-[#5F6368] font-normal">
          Tình trạng Visa của bạn
        </span>
        <span className="text-xl font-bold text-[#F57C00]">Còn 15 ngày</span>
        {/* Progress bar */}
        <div className="w-full h-2 bg-[#E0E0E0] rounded mt-2 mb-2 relative">
          <div className="h-2 bg-[#F57C00] rounded" style={{ width: "30%" }} />
        </div>
        <div className="flex gap-4 mt-2">
          <Button
            variant="outline"
            className="rounded-full border-[#4CAF50] text-[#1A73E8] px-6"
          >
            <FileText className="w-4 h-4 mr-2" /> Chi tiết
          </Button>
          <Button
            className="rounded-full bg-[#1A73E8] px-8"
            onClick={() => setIsNewProposalOpen(true)}
          >
            <FilePlus className="w-4 h-4 mr-2" /> Gia hạn ngay
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#1A73E8]" />
          <span className="font-bold text-lg text-[#202124]">
            Thao tác nhanh
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <QuickAction
            icon={<FilePlus className="w-7 h-7 text-[#1A73E8]" />}
            bg="bg-[#E8F5E9]"
            title="Gia hạn Visa"
            desc="Nộp đơn gia hạn visa"
          />
          <QuickAction
            icon={<Clock className="w-7 h-7 text-[#1A73E8]" />}
            bg="bg-[#E8F5E9]"
            title="Lịch sử Visa"
            desc="Xem lịch sử gia hạn"
          />
          <QuickAction
            icon={<Info className="w-7 h-7 text-[#1A73E8]" />}
            bg="bg-[#E8F5E9]"
            title="Thông tin Visa"
            desc="Xem chi tiết visa hiện tại"
          />
          <QuickAction
            icon={<File className="w-7 h-7 text-[#1A73E8]" />}
            bg="bg-[#E8F5E9]"
            title="Tài liệu"
            desc="Tải mẫu đơn và hướng dẫn"
          />
        </div>
      </div>

      {/* Application Status */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#1A73E8]" />
          <span className="font-bold text-lg text-[#202124]">
            Trạng thái hồ sơ
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Đã nộp đơn */}
            <StatusStep
              title="Đã nộp đơn"
              date="15/08/2023 - 10:30"
              status="Hoàn thành"
              statusColor="text-[#4CAF50]"
              bg="bg-[#E8F5E9]"
              icon={<FileText className="w-5 h-5 text-[#1A73E8]" />}
            />
            {/* Đang xử lý tại khoa */}
            <StatusStep
              title="Đang xử lý tại khoa"
              date="Dự kiến: 16/08/2023"
              status="Đang xử lý"
              statusColor="text-[#4CAF50]"
              bg="bg-[#E8F5E9]"
              icon={<Clock className="w-5 h-5 text-[#1A73E8]" />}
            />
            {/* Chuyển đến Phòng HTQT */}
            <StatusStep
              title="Chuyển đến Phòng HTQT"
              date="Dự kiến: 18/08/2023"
              status=""
              statusColor=""
              bg="bg-[#E0E0E0]"
              icon={<FileText className="w-5 h-5 text-[#202124]" />}
            />
            {/* Gửi công văn NA5 */}
            <StatusStep
              title="Gửi công văn NA5"
              date="Dự kiến: 20/08/2023"
              status=""
              statusColor=""
              bg="bg-[#E0E0E0]"
              icon={<FileText className="w-5 h-5 text-[#202124]" />}
            />
            {/* Hoàn thành */}
            <StatusStep
              title="Hoàn thành"
              date="Dự kiến: 25/08/2023"
              status=""
              statusColor=""
              bg="bg-[#E0E0E0]"
              icon={<FileText className="w-5 h-5 text-[#202124]" />}
            />
          </div>
        </div>
      </div>

      {/* Support */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#1A73E8]" />
          <span className="font-bold text-lg text-[#202124]">Hỗ trợ</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 max-w-md">
          <div className="bg-[#E8F5E9] rounded-full w-10 h-10 flex items-center justify-center">
            <Info className="w-5 h-5 text-[#1A73E8]" />
          </div>
          <div>
            <div className="font-medium text-[#202124]">Nguyễn Văn A</div>
            <div className="text-xs text-[#5F6368] mb-2">
              Cán bộ hỗ trợ sinh viên quốc tế - Khoa CNTT
            </div>
            <div className="flex gap-2">
              <a
                href="tel:0123456789"
                className="bg-[#E8F5E9] rounded-full w-8 h-8 flex items-center justify-center"
              >
                <Phone className="w-4 h-4 text-[#1A73E8]" />
              </a>
              <a
                href="mailto:abc@dut.udn.vn"
                className="bg-[#E8F5E9] rounded-full w-8 h-8 flex items-center justify-center"
              >
                <Mail className="w-4 h-4 text-[#1A73E8]" />
              </a>
              <a
                href="#"
                className="bg-[#E8F5E9] rounded-full w-8 h-8 flex items-center justify-center"
              >
                <Facebook className="w-4 h-4 text-[#1A73E8]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Open Visa Dialog */}
      <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              New Visa Proposal
            </DialogTitle>
            <DialogDescription className="text-base">
              Submit a new Visa proposal for review
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-[#F6F8FA] rounded-full mb-6">
              <TabsTrigger value="personal" className="rounded-full">
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger value="study" className="rounded-full">
                Thông tin học tập
              </TabsTrigger>
              <TabsTrigger value="extend" className="rounded-full">
                Đề nghị gia hạn
              </TabsTrigger>
            </TabsList>

            {/* ---------- TAB 1: THÔNG TIN CÁ NHÂN ---------- */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holderName">Họ tên *</Label>
                  <Input
                    id="holderName"
                    placeholder="Nhập họ tên"
                    className={`mt-2 ${
                      formErrors.holderName ? "border-destructive" : ""
                    }`}
                    value={form.holderName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, holderName: e.target.value }))
                    }
                  />
                  {formErrors.holderName && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.holderName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className={`mt-2 ${
                      formErrors.dateOfBirth ? "border-destructive" : ""
                    }`}
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                    }
                  />
                  {formErrors.dateOfBirth && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="holderCountry">Quốc tịch *</Label>
                  <Input
                    id="holderCountry"
                    placeholder="Nhập quốc tịch"
                    className={`mt-2 ${
                      formErrors.holderCountry ? "border-destructive" : ""
                    }`}
                    value={form.holderCountry}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, holderCountry: e.target.value }))
                    }
                  />
                  {formErrors.holderCountry && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.holderCountry}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="passportNumber">Số hộ chiếu *</Label>
                  <Input
                    id="passportNumber"
                    placeholder="Nhập số hộ chiếu"
                    className={`mt-2 ${
                      formErrors.passportNumber ? "border-destructive" : ""
                    }`}
                    value={form.passportNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, passportNumber: e.target.value }))
                    }
                  />
                  {formErrors.passportNumber && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.passportNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="visaType">Loại visa</Label>
                  <Select
                    value={form.visaType}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, visaType: value }))
                    }
                  >
                    <SelectTrigger id="visaType" className="mt-2">
                      <SelectValue placeholder="Chọn loại visa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DN">DN</SelectItem>
                      <SelectItem value="TT">TT</SelectItem>
                      <SelectItem value="ĐT">ĐT</SelectItem>
                      <SelectItem value="LS">LS</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visaNumber">Số visa *</Label>
                  <Input
                    id="visaNumber"
                    placeholder="Nhập số visa"
                    className={`mt-2 ${
                      formErrors.visaNumber ? "border-destructive" : ""
                    }`}
                    value={form.visaNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, visaNumber: e.target.value }))
                    }
                  />
                  {formErrors.visaNumber && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.visaNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="entryDate">Ngày nhập cảnh gần nhất</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    className="mt-2"
                    value={form.entryDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, entryDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* ---------- TAB 2: THÔNG TIN HỌC TẬP ---------- */}
            <TabsContent value="study" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program">Chương trình học *</Label>
                  <Select
                    value={form.program}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, program: value }))
                    }
                  >
                    <SelectTrigger
                      id="program"
                      className={`mt-2 ${
                        formErrors.program ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Chọn chương trình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đại học">Đại học</SelectItem>
                      <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                      <SelectItem value="Nghiên cứu sinh">
                        Nghiên cứu sinh
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.program && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.program}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department">Khoa / Phòng tiếp nhận *</Label>
                  <Select
                    value={form.department}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, department: value }))
                    }
                  >
                    <SelectTrigger
                      id="department"
                      className={`mt-2 ${
                        formErrors.department ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Chọn khoa/phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNTT">Khoa CNTT</SelectItem>
                      <SelectItem value="Điện">Khoa Điện</SelectItem>
                      <SelectItem value="Cơ khí">Khoa Cơ khí</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.department && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.department}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="issueDate">Ngày cấp visa *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    className={`mt-2 ${
                      formErrors.issueDate ? "border-destructive" : ""
                    }`}
                    value={form.issueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, issueDate: e.target.value }))
                    }
                  />
                  {formErrors.issueDate && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.issueDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expirationDate">Ngày hết hạn *</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    className={`mt-2 ${
                      formErrors.expirationDate ? "border-destructive" : ""
                    }`}
                    value={form.expirationDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, expirationDate: e.target.value }))
                    }
                  />
                  {formErrors.expirationDate && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.expirationDate}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ---------- TAB 3: ĐỀ NGHỊ GIA HẠN ---------- */}
            <TabsContent value="extend" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="na5Request">
                    Đề nghị hỗ trợ cấp công văn NA5
                  </Label>
                  <Select
                    value={form.na5Request ? "yes" : "no"}
                    onValueChange={(value) =>
                      setForm((f) => ({
                        ...f,
                        na5Request: value === "yes",
                      }))
                    }
                  >
                    <SelectTrigger id="na5Request" className="mt-2">
                      <SelectValue placeholder="Có/Không" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Có</SelectItem>
                      <SelectItem value="no">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Mục đích / Lý do gia hạn *</Label>
                <Textarea
                  id="purpose"
                  placeholder="Ghi rõ lý do gia hạn"
                  className={`mt-2 ${
                    formErrors.purpose ? "border-destructive" : ""
                  }`}
                  rows={3}
                  value={form.purpose}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, purpose: e.target.value }))
                  }
                />
                {formErrors.purpose && (
                  <p className="text-sm text-destructive mt-1">
                    {formErrors.purpose}
                  </p>
                )}
              </div>

              <FileUploadBox
                label="File đính kèm (Hộ chiếu, thư giới thiệu, đơn đề nghị...)"
                accept=".pdf,.doc,.docx,.jpg,.png"
                maxSizeMB={10}
                onFileSelect={handleFile}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewProposalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-[#1976D2] text-white" onClick={handleSubmit}>
              <FileText className="w-4 h-4 mr-2" />
              Submit Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Quick Action Card
function QuickAction({
  icon,
  bg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md flex flex-col items-center p-4 ${bg}`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${bg}`}
      >
        {icon}
      </div>
      <div className="font-medium text-[#202124]">{title}</div>
      <div className="text-xs text-[#5F6368] text-center">{desc}</div>
    </div>
  );
}

// Status Step Card
function StatusStep({
  title,
  date,
  status,
  statusColor,
  bg,
  icon,
}: {
  title: string;
  date: string;
  status: string;
  statusColor: string;
  bg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-w-[140px]">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${bg}`}
      >
        {icon}
      </div>
      <div className="font-medium text-[#202124]">{title}</div>
      <div className="text-xs text-[#5F6368]">{date}</div>
      {status && (
        <div
          className={`mt-2 px-3 py-1 rounded-lg bg-[#E8F5E9] text-xs font-medium ${statusColor}`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
