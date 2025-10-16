"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { documentsService, FullDocument, DocumentItem, PaginatedDocuments } from "@/lib/api/documents.service";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  FileCheck,
  AlertCircle
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// We'll load documents from the API instead of mock data

const revisionHistory = [
  {
    version: "v3.0",
    date: "2025-10-03 14:30",
    author: "Admin User",
    action: "Approved final version",
    changes: "Final approval granted",
  },
  {
    version: "v2.1",
    date: "2025-10-02 16:45",
    author: "Dr. Garcia",
    action: "Revised partner details",
    changes: "Updated partner name normalization and contact information",
  },
  {
    version: "v2.0",
    date: "2025-10-01 10:20",
    author: "Admin User",
    action: "Requested revisions",
    changes: "Feedback sent: Please update section 3.2 regarding payment terms",
  },
  {
    version: "v1.0",
    date: "2025-09-28 09:15",
    author: "Dr. Garcia",
    action: "Initial submission",
    changes: "Document submitted for review",
  },
    {
    version: "v1.0",
    date: "2025-09-28 09:15",
    author: "Dr. Garcia",
    action: "Initial submission",
    changes: "Document submitted for review",
  },
    {
    version: "v1.0",
    date: "2025-09-28 09:15",
    author: "Dr. Garcia",
    action: "Initial submission",
    changes: "Document submitted for review",
  },
];

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<FullDocument | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbackText, setFeedbackText] = useState("");
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.partnerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || (doc.status || '').toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    // Map backend DocumentStatus to friendly labels
    const map: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string; icon?: React.ReactNode }> = {
      DRAFT: { variant: 'outline', label: 'Draft' },
      SUBMITTED: { variant: 'secondary', label: 'Submitted', icon: <Clock className="w-3 h-3 mr-1" /> },
      REVIEWING: { variant: 'secondary', label: 'Reviewing', icon: <Eye className="w-3 h-3 mr-1" /> },
      APPROVED: { variant: 'default', label: 'Approved', icon: <FileCheck className="w-3 h-3 mr-1" /> },
      SIGNED: { variant: 'default', label: 'Signed', icon: <FileCheck className="w-3 h-3 mr-1" /> },
      ACTIVE: { variant: 'default', label: 'Active' },
      EXPIRED: { variant: 'destructive', label: 'Expired', icon: <X className="w-3 h-3 mr-1" /> },
      CANCELLED: { variant: 'destructive', label: 'Cancelled', icon: <X className="w-3 h-3 mr-1" /> },
    };
    const config = map[status] || { variant: 'outline' as const, label: status };
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Load documents from API
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentsService.list({ page, limit, search: searchQuery || undefined, status: statusFilter === 'all' ? undefined : (statusFilter as any) });
      setDocuments(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error('Failed to load documents', e);
      setDocuments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter]);

  // Open detail and fetch full document
  const openDocument = async (id: string) => {
    try {
      setLoading(true);
      const full = await documentsService.get(id);
      setSelectedDocument(full);
    } catch (e) {
      console.error('Failed to load document', e);
    } finally {
      setLoading(false);
    }
  };

  // Approval/Rejection flow: backend requires ApproveDocumentDto with non-empty comment
  const handleApprove = async () => {
    if (!selectedDocument) return;
    const comment = feedbackText.trim() || 'Approved by officer';
    try {
      setLoading(true);
      await documentsService.approve(selectedDocument.id, { comment });
      // refresh list and close
      await loadDocuments();
      setSelectedDocument(null);
      setFeedbackText('');
    } catch (e) {
      console.error('Approve failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDocument) return;
    const comment = feedbackText.trim();
    if (!comment) {
      alert('Vui lòng nhập lý do từ chối / yêu cầu bổ sung (feedback)');
      return;
    }
    try {
      setLoading(true);
      await documentsService.reject(selectedDocument.id, { comment });
      await loadDocuments();
      setSelectedDocument(null);
      setFeedbackText('');
    } catch (e) {
      console.error('Reject failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!selectedDocument) return;
    const content = feedbackText.trim();
    if (!content) return;
    try {
      setLoading(true);
      await documentsService.addFeedback(selectedDocument.id, { content });
      // Optionally refresh feedback list
      setFeedbackText('');
      alert('Gửi góp ý thành công');
    } catch (e) {
      console.error('Send feedback failed', e);
      alert('Gửi góp ý thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Quản lý văn bản MOU" }]} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Signed Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all signed documents and proposals
          </p>
        </div>
        <Button className="bg-primary">
          <FileText className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents, partners, or IDs..."
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
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="pending-approval">Pending Approval</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="needs-revision">Needs Revision</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Documents Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Signed Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="text-muted-foreground">
                    {document.id}
                  </TableCell>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>{document.partnerName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {document.contactPerson || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {document.updatedAt?.split?.('T')?.[0] || document.createdAt?.split?.('T')?.[0] || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openDocument(document.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(document.status === 'SUBMITTED' || document.status === 'REVIEWING') && (
                          <>
                            <DropdownMenuItem onClick={() => openDocument(document.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              Open & Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDocument(document.id)}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Open & Request Revision
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Enhanced Detail Dialog */}
      <Dialog
        open={!!selectedDocument}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDocument(null);
            setShowRevisionHistory(false);
          }
        }}
      >
        <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Review and manage document information
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="dialog-body max-h-[70vh] overflow-y-auto">
              {/* Main Content */}
              <div className="flex-1">
                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4">
                    <div className="dialog-body">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Document ID</Label>
                            <p className="mt-1">{selectedDocument.id}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                          </div>
                          <div className="col-span-2">
                            <Label>Title</Label>
                            <Input className="mt-1" defaultValue={selectedDocument.title} />
                          </div>
                          <div className="col-span-2">
                            <Label>Partner Institution</Label>
                            <Input className="mt-1" defaultValue={selectedDocument.partnerName || selectedDocument.partner?.name || ''} />
                            <p className="text-xs text-muted-foreground mt-1">
                              Edit to normalize partner name
                            </p>
                          </div>
                          <div>
                            <Label>Document Type</Label>
                            <Select defaultValue={selectedDocument.type}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Agreement">Agreement</SelectItem>
                                <SelectItem value="MOU">MOU</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Letter">Letter</SelectItem>
                                <SelectItem value="Report">Report</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Signed Date</Label>
                            <Input type="date" className="mt-1" defaultValue={selectedDocument.signedDate || ''} />
                          </div>
                          <div>
                            <Label>Department</Label>
                            <p className="mt-1">{selectedDocument.unit?.name || '-'}</p>
                          </div>
                          <div>
                            <Label>Submitted By</Label>
                            <p className="mt-1">{selectedDocument.createdBy?.fullName || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea className="mt-1" defaultValue={selectedDocument.description} />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Save Technical Changes
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Review Tab */}
                  <TabsContent value="review" className="space-y-4">
                    <div className="dialog-body">
                      <div className="space-y-4">
                        {(selectedDocument.status === 'SUBMITTED' || 
                          selectedDocument.status === 'REVIEWING' ||
                          selectedDocument.handlingStatus === 'NEEDS_REVISION') && (
                          <Card className="p-4 bg-accent/50">
                            <h4 className="mb-2">Admin Review Actions</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Review the document and take appropriate action
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={handleApprove}
                                disabled={loading}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve Document
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="flex-1"
                                onClick={handleReject}
                                disabled={loading}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject Document
                              </Button>
                            </div>
                          </Card>
                        )}

                        <Card className="p-4">
                          <h4 className="mb-2">Send Feedback</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Request revisions or provide comments to the submitting department
                          </p>
                          <Textarea
                            placeholder="Enter your feedback or revision requests..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="mb-3"
                            rows={4}
                          />
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleSendFeedback}
                            disabled={!feedbackText || loading}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Revision Request
                          </Button>
                        </Card>

                        <Card className="p-4">
                          <h4 className="mb-3">Document Proposal Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Submitted By:</span>
                              <span>{selectedDocument.createdBy?.fullName || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Department:</span>
                              <span>{selectedDocument.unit?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Submission Date:</span>
                              <span>{selectedDocument.signedDate || selectedDocument.createdAt?.split?.('T')?.[0] || '-'}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Attachments Tab */}
                  <TabsContent value="attachments" className="space-y-4">
                    <div className="dialog-body">
                      <div className="space-y-3">
                        {selectedDocument.attachments?.map((file, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p>{(file as any).path || String(file)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    PDF Document
                                  </p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              {/* Revision History Button */}
              
            </div>
          )}
          <DialogFooter className="mt-4 border-t pt-4">
                  <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRevisionHistory(true)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Show History
                  </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Revision History Sidebar */}
              <Dialog open={showRevisionHistory} onOpenChange={setShowRevisionHistory}>
              <DialogContent
                className="fixed right-0 top-0 h-full w-[400px] max-w-none rounded-none p-0 shadow-lg"
                style={{ margin: 0 }}
              > 
                <DialogHeader>
                  <DialogTitle>Revision History</DialogTitle>
                  <DialogDescription>
                    Review and manage History information
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col h-full">
                
                  <div className="dialog-body max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                      {revisionHistory.map((revision, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant="outline">{revision.version}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {revision.date.split(" ")[0]}
                                </span>
                              </div>
                              <p className="text-sm mb-1">{revision.action}</p>
                              <p className="text-xs text-muted-foreground mb-1">
                                by {revision.author}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {revision.changes}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowRevisionHistory(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
    </div>
  );
}