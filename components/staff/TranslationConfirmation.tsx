"use client";

import React from "react";
import { useState } from "react";
import {
  Languages,
  Search,
  Plus,
  Download,
  Eye,
  FileText,
  Upload,
  BarChart3,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Breadcrumbs } from "../Breadcrumbs";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const translationsData = [
  {
    id: "TR-2025-001",
    documentName: "Thỏa thuận đối tác quốc tế",
    unit: "Khoa Kỹ thuật",
    sourceLang: "Tiếng Anh",
    targetLang: "Tiếng Tây Ban Nha",
    confirmationDate: "28/09/2025",
    status: "confirmed",
    translator: "Công ty Dịch thuật ABC",
    submittedBy: "TS. Nguyễn Văn A",
    submittedDate: "15/09/2025",
    timeline: [
      { step: "Nộp đơn", date: "15/09/2025", status: "completed" as const, note: "Đơn đã được nộp" },
      { step: "Xét duyệt", date: "18/09/2025", status: "completed" as const, note: "Kiểm tra tài liệu" },
      { step: "Phê duyệt", date: "22/09/2025", status: "completed" as const, note: "Đã phê duyệt" },
      { step: "Cấp thư xác nhận", date: "28/09/2025", status: "completed" as const, note: "Thư đã được cấp" },
    ],
  },
  {
    id: "TR-2025-002",
    documentName: "MOU hợp tác nghiên cứu",
    unit: "Khoa Kỹ thuật",
    sourceLang: "Tiếng Pháp",
    targetLang: "Tiếng Anh",
    confirmationDate: "25/09/2025",
    status: "confirmed",
    translator: "GS. Trần Văn B",
    submittedBy: "TS. Lê Thị C",
    submittedDate: "10/09/2025",
    timeline: [
      { step: "Nộp đơn", date: "10/09/2025", status: "completed" as const, note: "Đơn đã được nộp" },
      { step: "Xét duyệt", date: "12/09/2025", status: "completed" as const, note: "Kiểm tra tài liệu" },
      { step: "Phê duyệt", date: "18/09/2025", status: "completed" as const, note: "Đã phê duyệt" },
      { step: "Cấp thư xác nhận", date: "25/09/2025", status: "completed" as const, note: "Thư đã được cấp" },
    ],
  },
  {
    id: "TR-2025-003",
    documentName: "Thỏa thuận trao đổi sinh viên",
    unit: "Khoa Kỹ thuật",
    sourceLang: "Tiếng Đức",
    targetLang: "Tiếng Anh",
    confirmationDate: "",
    status: "under-review",
    translator: "",
    submittedBy: "GS. Phạm Văn D",
    submittedDate: "01/10/2025",
    timeline: [
      { step: "Nộp đơn", date: "01/10/2025", status: "completed" as const, note: "Đơn đã được nộp" },
      { step: "Xét duyệt", date: "02/10/2025", status: "current" as const, note: "Đang kiểm tra tài liệu" },
      { step: "Phê duyệt", date: "", status: "pending" as const },
      { step: "Cấp thư xác nhận", date: "", status: "pending" as const },
    ],
  },
  {
    id: "TR-2025-004",
    documentName: "Hợp đồng hợp tác đào tạo",
    unit: "Khoa Kỹ thuật",
    sourceLang: "Tiếng Nhật",
    targetLang: "Tiếng Anh",
    confirmationDate: "",
    status: "pending",
    translator: "",
    submittedBy: "TS. Hoàng Thị E",
    submittedDate: "03/10/2025",
    timeline: [
      { step: "Nộp đơn", date: "03/10/2025", status: "completed" as const, note: "Đơn đã được nộp" },
      { step: "Xét duyệt", date: "", status: "pending" as const },
      { step: "Phê duyệt", date: "", status: "pending" as const },
      { step: "Cấp thư xác nhận", date: "", status: "pending" as const },
    ],
  },
];

const languageStats = [
  { language: "English-Spanish", count: 12 },
  { language: "English-French", count: 8 },
  { language: "English-German", count: 6 },
  { language: "English-Chinese", count: 5 },
  { language: "Other", count: 4 },
];

const documentTypeStats = [
  { type: "MOU/Agreement", count: 15 },
  { type: "Letter", count: 10 },
  { type: "Contract", count: 6 },
  { type: "Report", count: 4 },
];

export function TranslationConfirmation() {
  const [selectedTranslation, setSelectedTranslation] = useState<
    typeof translationsData[0] | null
  >(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");

  const filteredTranslations = translationsData.filter((trans) => {
    const matchesSearch =
      trans.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      confirmed: { variant: "default", label: "Đã xác nhận" },
      "under-review": { variant: "secondary", label: "Đang xét duyệt" },
      pending: { variant: "outline", label: "Chờ xử lý" },
      rejected: { variant: "destructive" as const, label: "Từ chối" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Xác nhận dịch thuật" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Xác Nhận Dịch Thuật</h1>
          <p className="text-muted-foreground mt-1">
            Gửi và theo dõi yêu cầu xác nhận bản dịch
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsSubmitOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yêu cầu mới
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="workflow">Quy trình</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-4">
          {/* Search */}
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by document name or ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Translations Table */}
          <Card className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Confirmation Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTranslations.map((trans) => (
                    <TableRow key={trans.id}>
                      <TableCell className="text-muted-foreground">
                        {trans.id}
                      </TableCell>
                      <TableCell>{trans.documentName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {trans.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {trans.sourceLang} → {trans.targetLang}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trans.confirmationDate || "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(trans.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTranslation(trans)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {trans.status === "confirmed" && (
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Chờ xử lý</p>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="mb-1">1</h2>
                <p className="text-sm text-muted-foreground">Đơn mới</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Đang xét</p>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="mb-1">1</h2>
                <p className="text-sm text-muted-foreground">Đang kiểm tra</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Hoàn thành</p>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="mb-1">2</h2>
                <p className="text-sm text-muted-foreground">Đã cấp thư</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Tổng số</p>
                  <FileText className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="mb-1">4</h2>
                <p className="text-sm text-muted-foreground">Đơn đang xử lý</p>
              </Card>
            </motion.div>
          </div>

          {/* Translation Requests with Timeline */}
          <div className="space-y-4">
            <h3>Quy trình xử lý đơn xác nhận</h3>
            {translationsData.map((trans, index) => (
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
                        <h4>{trans.documentName}</h4>
                        {getStatusBadge(trans.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mã đơn: {trans.id} • Nộp ngày: {trans.submittedDate}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Languages className="w-4 h-4 text-muted-foreground" />
                          {trans.sourceLang} → {trans.targetLang}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{trans.submittedBy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {trans.timeline.map((item, idx) => (
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
                          {idx < trans.timeline.length - 1 && (
                            <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {trans.timeline.map((item, idx) => (
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
                  {trans.timeline.find((t) => t.status === "current") && (
                    <Card className="p-3 mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-900 dark:text-blue-100">
                          {trans.timeline.find((t) => t.status === "current")?.note}
                        </span>
                      </p>
                    </Card>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTranslation(trans)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    {trans.status === "confirmed" && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Tải thư xác nhận
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Workflow Steps Info */}
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
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Total Translations</p>
                  <h2 className="mt-1">35</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    This year
                  </p>
                </div>
                <Languages className="w-10 h-10 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Confirmed</p>
                  <h2 className="mt-1">32</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completed
                  </p>
                </div>
                <FileText className="w-10 h-10 text-green-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <h2 className="mt-1">3</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    In progress
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-yellow-500" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Translations by Language Pair</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={languageStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="language" />
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
              <h3 className="mb-4">Translations by Document Type</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={documentTypeStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      radius={[8, 8, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Submit Translation Request Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Submit Translation Confirmation Request</DialogTitle>
            <DialogDescription>
              Request confirmation for a translated international cooperation document
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="submit-unit">Proposing Unit *</Label>
                  <Input
                    id="submit-unit"
                    defaultValue="Faculty of Engineering"
                    className="mt-2"
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="submit-doc-name">Original Document Name *</Label>
                  <Input
                    id="submit-doc-name"
                    placeholder="e.g., Partnership Agreement with University X"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="submit-source">Source Language *</Label>
                  <Select>
                    <SelectTrigger id="submit-source" className="mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="submit-target">Target Language *</Label>
                  <Select>
                    <SelectTrigger id="submit-target" className="mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="submit-reason">Reason for Confirmation *</Label>
                  <Textarea
                    id="submit-reason"
                    placeholder="Explain why translation confirmation is needed..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="submit-translator">Translator Name (Optional)</Label>
                  <Input
                    id="submit-translator"
                    placeholder="Name of translator or agency"
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="submit-notes">Additional Notes</Label>
                  <Textarea
                    id="submit-notes"
                    placeholder="Any additional information..."
                    className="mt-2"
                    rows={2}
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <div>
                  <Label>Original Document *</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload original document
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Translated Document *</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload translated document
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
              Reset
            </Button>
            <Button className="bg-primary">
              <Languages className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Translation Dialog */}
      <Dialog
        open={!!selectedTranslation}
        onOpenChange={(open) => !open && setSelectedTranslation(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Translation Details</DialogTitle>
            <DialogDescription>
              View translation confirmation request information
            </DialogDescription>
          </DialogHeader>
          {selectedTranslation && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Request ID</Label>
                    <p className="mt-1">{selectedTranslation.id}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedTranslation.status)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Document Name</Label>
                    <p className="mt-1">{selectedTranslation.documentName}</p>
                  </div>
                  <div>
                    <Label>Proposing Unit</Label>
                    <p className="mt-1">{selectedTranslation.unit}</p>
                  </div>
                  <div>
                    <Label>Submitted By</Label>
                    <p className="mt-1">{selectedTranslation.submittedBy}</p>
                  </div>
                  <div>
                    <Label>Source Language</Label>
                    <p className="mt-1">{selectedTranslation.sourceLang}</p>
                  </div>
                  <div>
                    <Label>Target Language</Label>
                    <p className="mt-1">{selectedTranslation.targetLang}</p>
                  </div>
                  {selectedTranslation.translator && (
                    <div className="col-span-2">
                      <Label>Translator</Label>
                      <p className="mt-1">{selectedTranslation.translator}</p>
                    </div>
                  )}
                  {selectedTranslation.confirmationDate && (
                    <div className="col-span-2">
                      <Label>Confirmation Date</Label>
                      <p className="mt-1">{selectedTranslation.confirmationDate}</p>
                    </div>
                  )}
                </div>

                {selectedTranslation.status === "confirmed" && (
                  <Card className="p-4 bg-accent/50">
                    <h4 className="mb-2">Confirmation Letter Available</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download the official confirmation letter in your preferred
                      format.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Word
                      </Button>
                    </div>
                  </Card>
                )}

                {selectedTranslation.status === "pending" && (
                  <Card className="p-4 bg-accent/50">
                    <h4 className="mb-2">Request Under Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Your translation confirmation request is being reviewed by the
                      admin. You will be notified once the confirmation letter is
                      ready.
                    </p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTranslation(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}