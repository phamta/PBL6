"use client";

import React from "react";
import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash,
  Upload,
  Download,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Breadcrumbs } from "../Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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

const mouProposals = [
  {
    id: "MOU-2025-001",
    unit: "Khoa Kỹ thuật",
    partner: "Đại học Barcelona",
    country: "Tây Ban Nha",
    type: "MOU",
    status: "approved",
    signingLevel: "Trường",
    contact: "TS. Nguyễn Văn A",
    lastUpdated: "03/10/2025",
    submittedDate: "20/09/2025",
    adminComments: "Đã phê duyệt. Tiến hành ký kết.",
    timeline: [
      { step: "Nộp đề xuất", date: "20/09/2025", status: "completed" as const, note: "Đơn vị đã nộp đề xuất" },
      { step: "Xét duyệt", date: "25/09/2025", status: "completed" as const, note: "Phòng KHĐN xem xét" },
      { step: "Phê duyệt", date: "03/10/2025", status: "completed" as const, note: "Ban giám hiệu phê duyệt" },
      { step: "Chờ ký kết", date: "", status: "current" as const, note: "Chuẩn bị ký kết" },
      { step: "Hoàn thành", date: "", status: "pending" as const },
    ],
  },
  {
    id: "MOU-2025-002",
    unit: "Khoa Kỹ thuật",
    partner: "Đại học Kỹ thuật Munich",
    country: "Đức",
    type: "Thỏa thuận",
    status: "pending",
    signingLevel: "Khoa",
    contact: "GS. Trần Văn B",
    lastUpdated: "02/10/2025",
    submittedDate: "28/09/2025",
    adminComments: "Đang xem xét. Chờ phản hồi từ phòng pháp chế.",
    timeline: [
      { step: "Nộp đề xuất", date: "28/09/2025", status: "completed" as const, note: "Đơn vị đã nộp đề xuất" },
      { step: "Xét duyệt", date: "30/09/2025", status: "current" as const, note: "Đang chờ ý kiến phòng pháp chế" },
      { step: "Phê duyệt", date: "", status: "pending" as const },
      { step: "Chờ ký kết", date: "", status: "pending" as const },
      { step: "Hoàn thành", date: "", status: "pending" as const },
    ],
  },
  {
    id: "MOU-2025-003",
    unit: "Faculty of Engineering",
    partner: "MIT",
    country: "USA",
    type: "MOA",
    status: "proposed",
    signingLevel: "University",
    contact: "Dr. Chen",
    lastUpdated: "2025-10-01",
    adminComments: "",
  },
  {
    id: "MOU-2025-004",
    unit: "Faculty of Engineering",
    partner: "ETH Zurich",
    country: "Switzerland",
    type: "Letter of Intent",
    status: "waiting-signature",
    signingLevel: "Faculty",
    contact: "Prof. Weber",
    lastUpdated: "2025-09-28",
    adminComments: "Approved. Document sent for signature.",
  },
  {
    id: "MOU-2025-005",
    unit: "Faculty of Engineering",
    partner: "Sorbonne University",
    country: "France",
    type: "MOU",
    status: "signed",
    signingLevel: "University",
    contact: "Dr. Dubois",
    lastUpdated: "2025-09-25",
    adminComments: "Fully executed.",
  },
];

export function DocumentManagement() {
  const [selectedProposal, setSelectedProposal] = useState<typeof mouProposals[0] | null>(null);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("list");

  const filteredProposals = mouProposals.filter((proposal) => {
    const matchesSearch =
      proposal.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      proposed: { variant: "outline", label: "Đã đề xuất" },
      approved: { variant: "default", label: "Đã phê duyệt" },
      "waiting-signature": { variant: "secondary", label: "Chờ ký kết" },
      signed: { variant: "default", label: "Đã ký" },
      cancelled: { variant: "destructive", label: "Đã hủy" },
      pending: { variant: "secondary", label: "Đang xem xét" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Quản lý văn bản MOU" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản Lý Văn Bản MOU</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý đề xuất MOU và thỏa thuận hợp tác từ đơn vị
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsNewProposalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Đề xuất mới
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="workflow">Quy trình</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-4">

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by partner, ID, or country..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="proposed">Proposed</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="waiting-signature">Waiting Signature</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Proposals Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Signing Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="text-muted-foreground">{proposal.id}</TableCell>
                  <TableCell>{proposal.partner}</TableCell>
                  <TableCell>{proposal.country}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proposal.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {proposal.signingLevel}
                  </TableCell>
                  <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                  <TableCell>{proposal.contact}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {proposal.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedProposal(proposal)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {(proposal.status === "proposed" || proposal.status === "pending") && (
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
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
                <p className="text-muted-foreground">Đã nộp</p>
                <Send className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="mb-1">1</h2>
              <p className="text-sm text-muted-foreground">Đề xuất mới</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">Đang xét</p>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="mb-1">1</h2>
              <p className="text-sm text-muted-foreground">Chờ phản hồi</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">Đã duyệt</p>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="mb-1">1</h2>
              <p className="text-sm text-muted-foreground">Chờ ký kết</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">Tổng số</p>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="mb-1">2</h2>
              <p className="text-sm text-muted-foreground">Đang xử lý</p>
            </Card>
          </motion.div>
        </div>

        {/* MOU Proposals with Timeline */}
        <div className="space-y-4">
          <h3>Quy trình xử lý đề xuất MOU</h3>
          {mouProposals
            .filter((p) => p.timeline)
            .map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{proposal.partner}</h4>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mã đơn: {proposal.id} • Nộp ngày: {proposal.submittedDate}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {proposal.type}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{proposal.contact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  {proposal.timeline && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        {proposal.timeline.map((item, idx) => (
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
                            {idx < proposal.timeline.length - 1 && (
                              <ArrowRight className="w-4 h-4 mx-1 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        {proposal.timeline.map((item, idx) => (
                          <div key={idx} className="text-center">
                            <p
                              className={` ${
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
                  {proposal.timeline?.find((t) => t.status === "current") && (
                    <Card className="p-3 mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-900 dark:text-blue-100">
                          {proposal.timeline.find((t) => t.status === "current")?.note}
                        </span>
                      </p>
                    </Card>
                  )}

                  {/* Admin Comments */}
                  {proposal.adminComments && (
                    <Card className="p-3 mt-4 bg-accent/30">
                      <p className="text-sm flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Phản hồi admin:</strong> {proposal.adminComments}
                        </span>
                      </p>
                    </Card>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    {(proposal.status === "proposed" || proposal.status === "pending") && (
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Sửa đề xuất
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Workflow Steps Info */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <h4 className="mb-4">Quy trình xử lý đề xuất MOU</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="mb-1">Nộp đề xuất</h4>
                <p className="text-sm text-muted-foreground">
                  Đơn vị nộp đề xuất MOU
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
                  Phòng KHĐN xem xét
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
                  Ban giám hiệu duyệt
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="mb-1">Chờ ký kết</h4>
                <p className="text-sm text-muted-foreground">
                  Chuẩn bị ký kết
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div>
                <h4 className="mb-1">Hoàn thành</h4>
                <p className="text-sm text-muted-foreground">
                  Đã ký và lưu trữ
                </p>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
      </Tabs>

      {/* New Proposal Dialog */}
      <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>New MOU Proposal</DialogTitle>
            <DialogDescription>
              Submit a new MOU/Agreement proposal for review
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="partner">Partner Details</TabsTrigger>
                <TabsTrigger value="files">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="proposing-unit">Proposing Unit</Label>
                    <Input
                      id="proposing-unit"
                      defaultValue="Faculty of Engineering"
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="doc-type">Document Type *</Label>
                    <Select>
                      <SelectTrigger id="doc-type" className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mou">MOU</SelectItem>
                        <SelectItem value="moa">MOA</SelectItem>
                        <SelectItem value="agreement">Agreement</SelectItem>
                        <SelectItem value="loi">Letter of Intent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="signing-level">Signing Level *</Label>
                    <Select>
                      <SelectTrigger id="signing-level" className="mt-2">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="university">University</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="ud-level">UD-level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="purpose">Purpose & Justification *</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe the purpose and justification for this agreement..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-person">Contact Person *</Label>
                    <Input
                      id="contact-person"
                      placeholder="Name of contact person"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="email@university.edu"
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="partner" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="partner-name">Foreign Partner Name *</Label>
                    <Input
                      id="partner-name"
                      placeholder="Official name of partner institution"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-country">Country *</Label>
                    <Input
                      id="partner-country"
                      placeholder="Country"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year-founded">Year Founded</Label>
                    <Input
                      id="year-founded"
                      type="number"
                      placeholder="e.g., 1950"
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="partner-address">Address</Label>
                    <Textarea
                      id="partner-address"
                      placeholder="Full address of partner institution"
                      className="mt-2"
                      rows={2}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="field-activity">Field of Activity</Label>
                    <Textarea
                      id="field-activity"
                      placeholder="Areas of expertise and collaboration"
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Draft MOU/Agreement *</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Invitation Letter</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload invitation letter (optional)
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Partner Profile</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload partner institution profile (optional)
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Email Correspondence</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload relevant email exchanges (optional)
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProposalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary">
              <FileText className="w-4 h-4 mr-2" />
              Submit Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Proposal Dialog */}
      <Dialog
        open={!!selectedProposal}
        onOpenChange={(open) => !open && setSelectedProposal(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Proposal Details</DialogTitle>
            <DialogDescription>
              View and track MOU proposal status
            </DialogDescription>
          </DialogHeader>
          {selectedProposal && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Proposal ID</Label>
                    <p className="mt-1">{selectedProposal.id}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedProposal.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Partner Institution</Label>
                    <p className="mt-1">{selectedProposal.partner}</p>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <p className="mt-1">{selectedProposal.country}</p>
                  </div>
                  <div>
                    <Label>Document Type</Label>
                    <p className="mt-1">{selectedProposal.type}</p>
                  </div>
                  <div>
                    <Label>Signing Level</Label>
                    <p className="mt-1">{selectedProposal.signingLevel}</p>
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <p className="mt-1">{selectedProposal.contact}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Last Updated</Label>
                    <p className="mt-1">{selectedProposal.lastUpdated}</p>
                  </div>
                </div>

                {selectedProposal.adminComments && (
                  <Card className="p-4 bg-accent/50">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="mb-1">Admin Feedback</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedProposal.adminComments}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                <div>
                  <Label>Attached Documents</Label>
                  <div className="mt-2 space-y-2">
                    <Card className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">draft_mou.pdf</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProposal(null)}>
              Close
            </Button>
            {selectedProposal?.status === "proposed" && (
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Proposal
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}