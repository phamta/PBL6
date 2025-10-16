"use client";

import React from "react";
import { useEffect, useState } from "react";
import { documentsService, type DocumentItem, type DocumentStatus, type PaginatedDocuments, type FullDocument, type DocumentType } from "@/lib/api/documents.service";
import FileUploadBox from "@/components/FileUploadBox";
import { useAuth } from "@/contexts/AuthContext";
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
  const [fullDocument, setFullDocument] = useState<FullDocument | null>(null);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { user } = useAuth();

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

  // Set contact person from logged in user
  useEffect(() => {
    if (user?.fullName) {
      setProposal(prev => ({ 
        ...prev, 
        contactPerson: user.fullName,
        contactEmail: user.email,
        proposingUnit: user.unit?.name || prev.proposingUnit
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedProposal) {
      setFullDocument(null); // Reset while loading
      documentsService.get(selectedProposal.id)
        .then(setFullDocument)
        .catch((error) => {
          console.error('Failed to load document details:', error);
          if (error.response) {
            console.error('Backend error:', error.response.status, error.response.data);
          }
          // Optionally show error message to user
        });
    }
  }, [selectedProposal]);

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

  // Update dialog title and button text based on mode
  const dialogTitle = isEditing ? "Edit MOU Proposal" : "New MOU Proposal";
  const dialogDescription = isEditing ? "Update the MOU proposal details" : "Submit a new MOU/Agreement proposal for review";
  const submitButtonText = isEditing ? "Update Proposal" : "Submit Proposal";

  // Function to populate form for editing
  const populateFormForEdit = (document: FullDocument) => {
    setProposal({
      proposingUnit: document.proposingUnit || document.unit?.name || "",
      docType: document.type.toLowerCase(),
      signingLevel: document.signingLevel || "",
      purpose: document.proposalReason || document.description || "",
      contactPerson: document.createdBy?.fullName || "",
      contactEmail: document.createdBy?.email || "",
      partnerName: document.partnerName || document.partner?.name || "",
      partnerCountry: document.partnerCountry || document.partner?.country || "",
      yearFounded: "", // Not available in backend
      partnerAddress: document.partnerAddress || "",
      fieldActivity: document.partnerField || document.cooperationField || "",
      files: {
        draft: null, // Files not loaded for edit, user can re-upload
        supporting: null,
        institutional: null,
        correspondence: null,
      },
    });
  };
  const [isWaitingToEdit, setIsWaitingToEdit] = useState(false);

  useEffect(() => {
    if (selectedProposal && fullDocument && isWaitingToEdit) {
      handleEdit();
      setIsWaitingToEdit(false);
    }
  }, [fullDocument]);
  // Handle Edit button click
  const handleEdit = () => {
    if (selectedProposal && fullDocument) {
      setIsEditing(true);
      setEditingId(selectedProposal.id);
      populateFormForEdit(fullDocument);
      setIsNewProposalOpen(true);
      setSelectedProposal(null); // Close view dialog
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!proposal.docType || !proposal.signingLevel || !proposal.purpose || 
          !proposal.partnerName || !proposal.partnerCountry) {
        alert('Please fill in all required fields');
        return;
      }

      // Prepare data for API - only include defined values
      const baseData = {
        title: `${proposal.docType.toUpperCase()} with ${proposal.partnerName}`,
        partnerName: proposal.partnerName,
        partnerCountry: proposal.partnerCountry,
        description: proposal.purpose,
        proposingUnit: proposal.proposingUnit,
        signingLevel: proposal.signingLevel,
        proposalReason: proposal.purpose,
        unitId: user?.unitId || undefined,
        attachments: []
      };

      // Add type field only for creation
      const documentData: any = isEditing ? { ...baseData } : {
        ...baseData,
        type: proposal.docType.toUpperCase() === 'MOA' ? 'AGREEMENT' :
              proposal.docType.toUpperCase() === 'LOI' ? 'OTHER' :
              proposal.docType.toUpperCase()
      };

      // Only add optional fields if they have values
      if (proposal.partnerAddress) documentData.partnerAddress = proposal.partnerAddress;
      if (proposal.fieldActivity) {
        documentData.partnerField = proposal.fieldActivity;
        documentData.cooperationField = proposal.fieldActivity;
      }

      console.log(`${isEditing ? 'Updating' : 'Creating'} document:`, documentData);
      
      if (isEditing && editingId) {
        // Update existing document
        await documentsService.update(editingId, documentData);
      } else {
        // Create new document
        await documentsService.create(documentData);
      }
      
      // Reset form and state
      setProposal({
        proposingUnit: user?.unit?.name || "Faculty of Engineering",
        docType: "",
        signingLevel: "",
        purpose: "",
        contactPerson: user?.fullName || "",
        contactEmail: user?.email || "",
        partnerName: "",
        partnerCountry: "",
        yearFounded: "",
        partnerAddress: "",
        fieldActivity: "",
        files: {
          draft: null,
          supporting: null,
          institutional: null,
          correspondence: null,
        },
      });
      setIsEditing(false);
      setEditingId(null);
      setIsNewProposalOpen(false);
      
      // Reload the list to show the new document
      loadData();
      
      alert('Proposal submitted successfully!');
    } catch (error: any) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} document:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'submit'} proposal. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
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
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                  <SelectItem value="REVIEWING">REVIEWING</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="SIGNED">SIGNED</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
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
                    <TableHead>CreateBy</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody>
                  {(items || []).map((proposal, index) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="text-muted-foreground">
                        #{(page - 1) * limit + index + 1} {/* Số thứ tự liên tục: #1, #2, #3... */}
                      </TableCell>
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
                          {proposal.status === "DRAFT" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setIsWaitingToEdit(true); // báo là người dùng muốn edit
                            }}
                          >
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
          {/* MOU Proposals with Timeline - Chèn phần này vào */}
          <div className="space-y-4">
            <h3>Quy trình xử lý đề xuất MOU</h3>
            {(items || []).map((proposal, index) => (
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
                        <h4>{proposal.partnerName}</h4>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mã đơn: #{(page - 1) * limit + index + 1} • Nộp ngày: {new Date(proposal.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {proposal.type}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{proposal.contactPerson}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Progress - Giả sử timeline dựa trên status */}
                 <div className="mt-4">
                    {/* --- Thanh tiến trình --- */}
                    <div className="flex items-center gap-2 mb-2">
                      {[
                        { step: "Nộp đề xuất" },
                        { step: "Xét duyệt" },
                        { step: "Phê duyệt" },
                        { step: "Chờ ký kết" },
                        { step: "Hoàn thành" },
                      ].map((item, idx) => {
                        let status = "pending";

                        if (proposal.status === "DRAFT") {
                          status = "rejected";
                        } else if (proposal.status === "SUBMITTED" && idx === 0) {
                          status = "current";
                        } else if (proposal.status === "REVIEWING" && idx === 1) {
                          status = "current";
                        } else if (proposal.status === "APPROVED" && idx === 2) {
                          status = "current";
                        } else if (proposal.status === "SIGNED" && idx === 3) {
                          status = "current";
                        } else if (proposal.status === "ACTIVE" && idx === 4) {
                          status = "current";
                        }

                        // Đánh dấu bước đã hoàn thành (mọi bước trước bước current)
                        if (
                          ["REVIEWING", "APPROVED", "SIGNED", "ACTIVE"].includes(proposal.status) &&
                          idx <
                            ["SUBMITTED", "REVIEWING", "APPROVED", "SIGNED", "ACTIVE"].indexOf(
                              proposal.status
                            )
                        ) {
                          status = "completed";
                        }

                        return (
                          <div key={idx} className="flex items-center flex-1">
                            <div
                              className={`flex-1 h-2 rounded-full transition-all ${
                                status === "completed"
                                  ? "bg-green-500"
                                  : status === "current"
                                  ? "bg-blue-500 animate-pulse"
                                  : status === "rejected"
                                  ? "bg-red-500"
                                  : "bg-gray-200"
                              }`}
                            />
                            {idx < 4 && (
                              <ArrowRight
                                className={`w-4 h-4 mx-1 ${
                                  status === "rejected"
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* --- Nhãn và ngày --- */}
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {[
                        {
                          step: "Nộp đề xuất",
                          date: proposal.createdAt
                            ? new Date(proposal.createdAt).toLocaleDateString()
                            : null,
                        },
                        {
                          step: "Xét duyệt",
                          date: ["REVIEWING", "APPROVED", "SIGNED", "ACTIVE"].includes(
                            proposal.status
                          )
                            ? new Date(proposal.updatedAt).toLocaleDateString()
                            : null,
                        },
                        {
                          step: "Phê duyệt",
                          date: ["APPROVED", "SIGNED", "ACTIVE"].includes(proposal.status)
                            ? new Date(proposal.updatedAt).toLocaleDateString()
                            : null,
                        },
                        {
                          step: "Chờ ký kết",
                          date: ["SIGNED", "ACTIVE"].includes(proposal.status)
                            ? new Date(proposal.updatedAt).toLocaleDateString()
                            : null,
                        },
                        {
                          step: "Hoàn thành",
                          date:
                            proposal.status === "ACTIVE"
                              ? new Date(proposal.updatedAt).toLocaleDateString()
                              : null,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="text-center">
                          <p
                            className={`${
                              proposal.status === "DRAFT"
                                ? "text-red-600 font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.step}
                          </p>
                          {item.date && (
                            <p
                              className={`mt-1 ${
                                proposal.status === "DRAFT"
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {item.date}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Status Note */}
                  <Card className="p-3 mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <p className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-900 dark:text-blue-100">
                        {proposal.status === "DRAFT" ? "Đề xuất bị từ chối, cần chỉnh sửa" :
                         proposal.status === "SUBMITTED" ? "Đã nộp, chờ xét duyệt" :
                         proposal.status === "REVIEWING" ? "Đang được xét duyệt" :
                         proposal.status === "APPROVED" ? "Đã được phê duyệt, chuẩn bị ký kết" :
                         proposal.status === "SIGNED" ? "Đã ký, chờ hiệu lực" :
                         proposal.status === "ACTIVE" ? "Đã hoàn thành" :
                         "Trạng thái không xác định"}
                      </span>
                    </p>
                  </Card>

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
                    {proposal.status === "DRAFT" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setIsWaitingToEdit(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Sửa đề xuất
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Workflow Steps Info - Giữ nguyên */}

        </TabsContent>
        
      </Tabs>
        <Dialog open={isNewProposalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsNewProposalOpen(false);
            setIsEditing(false);
            setEditingId(null);
          }
        }}>
          <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>

            <div className="dialog-body max-h-[70vh] overflow-y-auto">
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
                        disabled
                        placeholder="Auto-filled from logged in user"
                        className="mt-2 bg-muted"
                      />
                    </div>
                    <div>
                      <Label>Contact Email *</Label>
                      <Input
                        value={proposal.contactEmail}
                        disabled
                        type="email"
                        placeholder="Auto-filled from logged in user"
                        className="mt-2 bg-muted"
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
              <Button variant="outline" onClick={() => {
                setIsNewProposalOpen(false);
                setIsEditing(false);
                setEditingId(null);
              }} disabled={isSubmitting}>Cancel</Button>
              <Button className="bg-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" /> {submitButtonText}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      {/* View Proposal Dialog */}
        {/* View Document Details Dialog */}
        <Dialog
                open={!!selectedProposal}
                onOpenChange={(open) => !open && setSelectedProposal(null)}
              >
          <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>MOU/Agreement Details</DialogTitle>
              <DialogDescription>
                View the detailed content of the document
              </DialogDescription>
            </DialogHeader>
            {selectedProposal && fullDocument ? (
            <div className="dialog-body max-h-[70vh] overflow-y-auto">
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
                        value={fullDocument.proposingUnit || fullDocument.unit?.name || ''}
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="doc-type">Document Type</Label>
                      <Input
                        id="doc-type"
                        value={fullDocument.type}
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="signing-level">Signing Level</Label>
                      <Input
                        id="signing-level"
                        value={fullDocument.signingLevel || ''}
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="purpose">Purpose & Justification</Label>
                      <Textarea
                        id="purpose"
                        value={fullDocument.proposalReason || fullDocument.description || ''}
                        className="mt-2"
                        rows={4}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-person">Contact Person</Label>
                      <Input
                        id="contact-person"
                        value={fullDocument.createdBy?.fullName || ''}
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={fullDocument.createdBy?.email || fullDocument.partner?.contactEmail || ''}
                        className="mt-2"
                        disabled
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="partner" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="partner-name">Foreign Partner Name</Label>
                      <Input
                        id="partner-name"
                        value={fullDocument.partnerName || fullDocument.partner?.name || ''}
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner-country">Country</Label>
                      <Input
                        id="partner-country"
                        value={fullDocument.partnerCountry || fullDocument.partner?.country || ''}
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="year-founded">Year Founded</Label>
                      <Input
                        id="year-founded"
                        type="number"
                        value=""  // If yearFounded is not available in backend, leave empty or remove field
                        className="mt-2"
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="partner-address">Address</Label>
                      <Textarea
                        id="partner-address"
                        value={fullDocument.partnerAddress || ''}
                        className="mt-2"
                        rows={2}
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="field-activity">Field of Activity</Label>
                      <Textarea
                        id="field-activity"
                        value={fullDocument.partnerField || fullDocument.cooperationField || ''}
                        className="mt-2"
                        rows={3}
                        disabled
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Draft MOU/Agreement</Label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {fullDocument.attachments?.[0] ? (
                          <a href={fullDocument.attachments[0].path} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            {fullDocument.attachments[0].path.split('/').pop() || 'draft_mou.pdf'}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Supporting Documents</Label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {fullDocument.attachments?.[1] ? (
                          <a href={fullDocument.attachments[1].path} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            {fullDocument.attachments[1].path.split('/').pop() || 'supporting_docs.pdf'}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Institutional Profile</Label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {fullDocument.attachments?.[2] ? (
                          <a href={fullDocument.attachments[2].path} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            {fullDocument.attachments[2].path.split('/').pop() || 'profile.pdf'}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Email Correspondence</Label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {fullDocument.attachments?.[3] ? (
                          <a href={fullDocument.attachments[3].path} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            {fullDocument.attachments[3].path.split('/').pop() || 'emails.pdf'}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            ) : (
              <p>Loading document details...</p>
            )}
            <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedProposal(null)}>
              Close
            </Button>
            {selectedProposal?.status === "DRAFT" && (
              <Button variant="outline" onClick={handleEdit}>
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

