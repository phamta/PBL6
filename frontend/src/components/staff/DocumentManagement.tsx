"use client";

import React from "react";
import { useEffect, useState } from "react";
import { documentsService, type DocumentItem, type DocumentStatus, type PaginatedDocuments } from "@/lib/api/documents.service";
import FileUploadBox from "@/components/FileUploadBox";
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

// Data sẽ được load từ API thay vì mock
interface ProposalData {
  proposingUnit: string;
  docType: string;
  signingLevel: string;
  purpose: string;
  contactPerson: string;
  contactEmail: string;
  partnerName: string;
  partnerCountry: string;
  yearFounded: string;
  partnerAddress: string;
  fieldActivity: string;
  files: {  // Thay File[] thành object
    draft: File | null;
    supporting: File | null;
    institutional: File | null;
    correspondence: File | null;
  };
}
export function DocumentManagement() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<DocumentItem | null>(null);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await documentsService.list({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? (statusFilter as DocumentStatus) : undefined,
      });
      // Response giờ là PaginatedDocuments đúng format
      console.log('API /documents response:', res);
      setItems(res.items);  // Trực tiếp dùng res.items
      setTotal(res.total);  // Trực tiếp dùng res.total
    } catch (e) {
      console.error('Failed to load documents:', e);
      setItems([]);  // Fallback nếu lỗi
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Reload when pagination, search or status filter changes
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      DRAFT: { variant: "outline", label: "Bản nháp" },
      SUBMITTED: { variant: "secondary", label: "Đã nộp" },
      REVIEWING: { variant: "secondary", label: "Đang xét duyệt" },
      APPROVED: { variant: "default", label: "Đã phê duyệt" },
      SIGNED: { variant: "default", label: "Đã ký" },
      ACTIVE: { variant: "default", label: "Hiệu lực" },
      EXPIRED: { variant: "outline", label: "Hết hạn" },
      CANCELLED: { variant: "destructive", label: "Đã hủy" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  const [proposal, setProposal] = useState<ProposalData>({
    proposingUnit: "Faculty of Engineering",
    docType: "",
    signingLevel: "",
    purpose: "",
    contactPerson: "",
    contactEmail: "",
    partnerName: "",
    partnerCountry: "",
    yearFounded: "",
    partnerAddress: "",
    fieldActivity: "",
     files: {  // Khởi tạo object
    draft: null,
    supporting: null,
    institutional: null,
    correspondence: null,
  },
  });


  // ✅ Hàm cập nhật dữ liệu
  const handleChange = (field: string, value: any) => {
    setProposal(prev => ({ ...prev, [field]: value }));
  };

const handleFile = (file: File | null, key: string) => {
  setProposal(prev => ({
    ...prev,
    files: {
      ...prev.files,
      [key]: file,  // Set file cho key cụ thể
    },
  }));
};

  const handleSubmit = () => {
    console.log("Proposal:", proposal);
    setIsNewProposalOpen(false);
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
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                  <SelectItem value="SUBMITTED">Đã nộp</SelectItem>
                  <SelectItem value="REVIEWING">Đang xét duyệt</SelectItem>
                  <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
                  <SelectItem value="SIGNED">Đã ký</SelectItem>
                  <SelectItem value="ACTIVE">Hiệu lực</SelectItem>
                  <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
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
                  {(items || []).map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="text-muted-foreground">{proposal.id}</TableCell>
                      <TableCell>{proposal.partnerName}</TableCell>
                      <TableCell>{proposal.partnerCountry}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{proposal.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {proposal.signingLevel}
                      </TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell>{proposal.contactPerson}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(proposal.updatedAt).toLocaleDateString()}
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
                          {(proposal.status === "DRAFT" || proposal.status === "SUBMITTED") && (
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

          {/* Workflow placeholder (awaiting backend data mapping) */}
          <Card className="p-6">
            <p className="text-muted-foreground">Quy trình sẽ hiển thị dữ liệu thực khi hoàn thiện tích hợp.</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Proposal Dialog */}
      {/* <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
        <DialogContent className="max-w-4xl dialog-content">
          <DialogHeader>
            <DialogTitle>New MOU Proposal</DialogTitle>
            <DialogDescription>
              Submit a new MOU/Agreement proposal for review
            </DialogDescription>
          </DialogHeader>
          <div className="dialog-body">
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
                  <FileUploadBox label="Draft MOU/Agreement *" accept=".pdf,.doc,.docx" maxSizeMB={10} onFileSelect={handleFile} />
                  <FileUploadBox label="Supporting Documents" accept=".pdf,.doc,.docx,.jpg,.png" maxSizeMB={10} onFileSelect={handleFile} />
                  <FileUploadBox label="Institutional Profile" accept=".pdf,.doc,.docx,.jpg,.png" maxSizeMB={10} onFileSelect={handleFile} />
                  <FileUploadBox label="Email Correspondence" accept=".pdf,.doc,.docx,.jpg,.png" maxSizeMB={10} onFileSelect={handleFile} />

                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setIsNewProposalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary">
              <FileText className="w-4 h-4 mr-2" />
              Submit Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
        <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
          <DialogContent className="max-w-4xl dialog-content">
            <DialogHeader>
              <DialogTitle>New MOU Proposal</DialogTitle>
              <DialogDescription>Submit a new MOU/Agreement proposal for review</DialogDescription>
            </DialogHeader>

            <div className="dialog-body">
              {/* ✅ Tabs không unmount dữ liệu nữa vì dùng useState tổng */}
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="partner">Partner Details</TabsTrigger>
                  <TabsTrigger value="files">Documents</TabsTrigger>
                </TabsList>

                {/* BASIC TAB */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="proposing-unit">Proposing Unit</Label>
                      <Input value={proposal.proposingUnit} className="mt-2" disabled />
                    </div>

                    <div>
                      <Label>Document Type *</Label>
                      <Select onValueChange={val => handleChange("docType", val)} value={proposal.docType}>
                        <SelectTrigger className="mt-2">
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
                      <Label>Signing Level *</Label>
                      <Select onValueChange={val => handleChange("signingLevel", val)} value={proposal.signingLevel}>
                        <SelectTrigger className="mt-2">
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
                      <Label>Purpose & Justification *</Label>
                      <Textarea
                        value={proposal.purpose}
                        onChange={e => handleChange("purpose", e.target.value)}
                        placeholder="Describe the purpose and justification..."
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Contact Person *</Label>
                      <Input
                        value={proposal.contactPerson}
                        onChange={e => handleChange("contactPerson", e.target.value)}
                        placeholder="Name of contact person"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Contact Email *</Label>
                      <Input
                        value={proposal.contactEmail}
                        onChange={e => handleChange("contactEmail", e.target.value)}
                        type="email"
                        placeholder="email@university.edu"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* PARTNER TAB */}
                <TabsContent value="partner" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Foreign Partner Name *</Label>
                      <Input
                        value={proposal.partnerName}
                        onChange={e => handleChange("partnerName", e.target.value)}
                        placeholder="Official name of partner"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Country *</Label>
                      <Input
                        value={proposal.partnerCountry}
                        onChange={e => handleChange("partnerCountry", e.target.value)}
                        placeholder="Country"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Year Founded</Label>
                      <Input
                        value={proposal.yearFounded}
                        onChange={e => handleChange("yearFounded", e.target.value)}
                        type="number"
                        placeholder="e.g., 1950"
                        className="mt-2"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <Textarea
                        value={proposal.partnerAddress}
                        onChange={e => handleChange("partnerAddress", e.target.value)}
                        placeholder="Full address"
                        className="mt-2"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Field of Activity</Label>
                      <Textarea
                        value={proposal.fieldActivity}
                        onChange={e => handleChange("fieldActivity", e.target.value)}
                        placeholder="Areas of expertise and collaboration"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* FILE TAB */}
                <TabsContent value="files" className="space-y-4">
                      <FileUploadBox 
                        label="Draft MOU/Agreement *" 
                        selectedFile={proposal.files.draft} 
                        onFileSelect={(file) => handleFile(file, 'draft')} 
                        onRemove={() => handleFile(null, 'draft')} 
                      />
                      <FileUploadBox 
                        label="Supporting Documents" 
                        selectedFile={proposal.files.supporting} 
                        onFileSelect={(file) => handleFile(file, 'supporting')} 
                        onRemove={() => handleFile(null, 'supporting')} 
                      />
                      <FileUploadBox 
                        label="Institutional Profile" 
                        selectedFile={proposal.files.institutional} 
                        onFileSelect={(file) => handleFile(file, 'institutional')} 
                        onRemove={() => handleFile(null, 'institutional')} 
                      />
                      <FileUploadBox 
                        label="Email Correspondence" 
                        selectedFile={proposal.files.correspondence} 
                        onFileSelect={(file) => handleFile(file, 'correspondence')} 
                        onRemove={() => handleFile(null, 'correspondence')} 
                      />
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="mt-4 border-t pt-4">
              <Button variant="outline" onClick={() => setIsNewProposalOpen(false)}>Cancel</Button>
              <Button className="bg-primary" onClick={handleSubmit}>
                <FileText className="w-4 h-4 mr-2" /> Submit Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      {/* View Proposal Dialog */}
      <Dialog
        open={!!selectedProposal}
        onOpenChange={(open) => !open && setSelectedProposal(null)}
      >
        <DialogContent className="max-w-3xl dialog-content">
          <DialogHeader>
            <DialogTitle>Proposal Details</DialogTitle>
            <DialogDescription>
              View and track MOU proposal status
            </DialogDescription>
          </DialogHeader>
          {selectedProposal && (
            <div className="dialog-body">
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
                    <p className="mt-1">{selectedProposal.partnerName}</p>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <p className="mt-1">{selectedProposal.partnerCountry}</p>
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
                    <p className="mt-1">{selectedProposal.contactPerson}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Last Updated</Label>
                    <p className="mt-1">{new Date(selectedProposal.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Admin feedback (optional field when backend provides) */}
                {/* Placeholder removed until backend field available */}

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
            </div>
          )}
          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedProposal(null)}>
              Close
            </Button>
            {(selectedProposal?.status === "DRAFT" || selectedProposal?.status === "SUBMITTED") && (
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