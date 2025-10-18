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
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const handleFile = (file: File | null) => {
    console.log("File nhận được:", file);
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
          <div>
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

              {/* Tab 1: Thông tin cá nhân */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full-name">Họ tên *</Label>
                    <Input
                      id="full-name"
                      placeholder="Nhập họ tên"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Ngày sinh *</Label>
                    <Input id="dob" type="date" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Quốc tịch *</Label>
                    <Input
                      id="nationality"
                      placeholder="Nhập quốc tịch"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="passport">Số hộ chiếu *</Label>
                    <Input
                      id="passport"
                      placeholder="Nhập số hộ chiếu"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="visa-type">Loại visa hiện tại</Label>
                    <Select>
                      <SelectTrigger id="visa-type" className="mt-2">
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
                    <Label htmlFor="visa-number">
                      Số visa & thời hạn hết hạn *
                    </Label>
                    <Input
                      id="visa-number"
                      placeholder="Nhập số visa & hạn"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last-entry">Ngày nhập cảnh gần nhất</Label>
                    <Input id="last-entry" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="visa-code">Mã số thị thực (nếu có)</Label>
                    <Input
                      id="visa-code"
                      placeholder="Nhập mã số thị thực"
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Thông tin học tập */}
              <TabsContent value="study" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program">Chương trình học</Label>
                    <Select>
                      <SelectTrigger id="program" className="mt-2">
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
                  </div>
                  <div>
                    <Label htmlFor="faculty">Khoa / Phòng tiếp nhận</Label>
                    <Select>
                      <SelectTrigger id="faculty" className="mt-2">
                        <SelectValue placeholder="Chọn khoa/phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNTT">Khoa CNTT</SelectItem>
                        <SelectItem value="Điện">Khoa Điện</SelectItem>
                        <SelectItem value="Cơ khí">Khoa Cơ khí</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="start-date">Ngày bắt đầu học *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Ngày kết thúc dự kiến</Label>
                    <Input id="end-date" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="manager-email">Email người phụ trách</Label>
                    <Input
                      id="manager-email"
                      type="email"
                      placeholder="Nhập email"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manager-name">Tên người phụ trách</Label>
                    <Input
                      id="manager-name"
                      placeholder="Nhập tên"
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Đề nghị gia hạn */}
              <TabsContent value="extend" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="extend-date">
                      Đề nghị gia hạn visa đến ngày nào
                    </Label>
                    <Input
                      type="date"
                      id="extend-date"
                      placeholder="Ví dụ: dd/MM/yyyy"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="na5-support">
                      Đề nghị hỗ trợ cấp công văn NA5
                    </Label>
                    <Select>
                      <SelectTrigger id="na5-support" className="mt-2">
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
                  <Label htmlFor="extend-reason">Lí do gia hạn</Label>
                  <Textarea
                    id="extend-reason"
                    placeholder="Ghi rõ lí do gia hạn"
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <FileUploadBox
                  label="File đính kèm (Hộ chiếu scan, ảnh, thư giới thiệu, đơn đề nghị...)"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  maxSizeMB={10}
                  onFileSelect={handleFile}
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="mt-4 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewProposalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-[#1976D2] text-white">
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