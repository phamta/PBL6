"use client";

import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Search,
  BookOpen,
  BadgeCheck,
  FileText,
  FileStack,
  FileCheck2,
  FileDown,
  FileSpreadsheet,
//   FileWord,
//   FilePdf,
  Clock,
  Folder,
  Download,
  FileSignature,
  Gavel,
  GraduationCap,
} from "lucide-react";

const categories = [
  {
    icon: <GraduationCap className="w-10 h-10 text-[#2196F3] bg-[#E3F2FD] rounded-full p-2" />,
    label: "Học tập",
    count: 8,
  },
  {
    icon: <BadgeCheck className="w-10 h-10 text-[#43A047] bg-[#E8F5E9] rounded-full p-2" />,
    label: "Visa & Giấy tờ",
    count: 12,
    badge: "Mới",
  },
  {
    icon: <FileText className="w-10 h-10 text-[#AB47BC] bg-[#F3E5F5] rounded-full p-2" />,
    label: "Biểu mẫu",
    count: 5,
  },
  {
    icon: <BookOpen className="w-10 h-10 text-[#FFA000] bg-[#FFF8E1] rounded-full p-2" />,
    label: "Hướng dẫn",
    count: 7,
  },
  {
    icon: <Gavel className="w-10 h-10 text-[#3949AB] bg-[#E8EAF6] rounded-full p-2" />,
    label: "Quy định",
    count: 3,
  },
  {
    icon: <FileSpreadsheet className="w-10 h-10 text-[#009688] bg-[#E0F2F1] rounded-full p-2" />,
    label: "Mẫu đơn",
    count: 9,
  },
];

const recentDocs = [
  {
    icon: <FileText className="w-8 h-8 text-white bg-[#F44336] rounded-lg p-1" />,
    title: "Hướng dẫn gia hạn visa 2023",
    category: "Visa",
    date: "20/08/2023",
    type: "PDF",
    typeColor: "text-[#43A047]",
    downloadColor: "bg-[#E8F5E9]",
  },
  {
    icon: <FileText className="w-8 h-8 text-white bg-[#2196F3] rounded-lg p-1" />,
    title: "Đơn xin gia hạn visa",
    category: "Mẫu đơn",
    date: "20/08/2023",
    type: "DOCX",
    typeColor: "text-[#43A047]",
    downloadColor: "bg-[#E8F5E9]",
  },
];

export default function StudentDocument() {
  return (
    <div className="p-8">
      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Input
            placeholder="Tìm kiếm tài liệu"
            className="pl-10 h-14 rounded-xl text-base"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90A4AE] w-5 h-5" />
        </div>
        <Select>
          <SelectTrigger className="w-56 h-14 rounded-xl text-base">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="new">Mới</SelectItem>
            <SelectItem value="old">Cũ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Danh mục tài liệu */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-6 h-6 text-[#43A047]" />
          <span className="text-lg font-semibold text-[#202124]">Danh mục tài liệu</span>
        </div>
        <div className="flex gap-8 flex-wrap">
          {categories.map((cat, idx) => (
            <div
              key={cat.label}
              className="bg-[#F7F9FA] rounded-2xl w-56 h-56 flex flex-col items-center justify-center relative shadow-sm"
            >
              {cat.icon}
              <div className="mt-4 text-lg font-semibold text-[#202124]">{cat.label}</div>
              <div className="text-[#757575] text-sm mt-1">{cat.count} tài liệu</div>
              {cat.badge && (
                <span className="absolute top-4 right-6 bg-[#F44336] text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {cat.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tài liệu gần đây */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-[#43A047]" />
          <span className="text-lg font-semibold text-[#202124]">Tài liệu gần đây</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl">
          {recentDocs.map((doc, idx) => (
            <div
              key={doc.title}
              className={`flex items-center px-6 py-5 ${idx !== 0 ? "border-t" : ""}`}
            >
              <div className="mr-4">{doc.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-base text-[#202124]">{doc.title}</div>
                <div className="flex gap-6 text-sm text-[#757575] mt-1">
                  <div className="flex items-center gap-1">
                    <Folder className="w-4 h-4" /> {doc.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {doc.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" /> {doc.type}
                  </div>
                </div>
              </div>
              <button
                className={`ml-4 flex items-center justify-center w-10 h-10 rounded-full ${doc.downloadColor} hover:bg-[#C8E6C9] transition`}
                title="Tải xuống"
              >
                <Download className="w-6 h-6 text-[#43A047]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}