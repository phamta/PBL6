"use client";

import React, { useEffect, useState } from "react";
import {
  documentsService,
  FullDocument,
  DocumentItem,
} from "@/lib/api/documents.service";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Clock,
  FileCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function DocumentsPageLeader() {
  const [selectedDocument, setSelectedDocument] = useState<FullDocument | null>(
    null
  );
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbackText, setFeedbackText] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (doc.title || "").toLowerCase().includes(q) ||
      (doc.partnerName || "").toLowerCase().includes(q) ||
      (doc.id || "").toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (doc.status || "").toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<
      string,
      { variant: "default" | "secondary" | "outline" | "destructive"; label: string }
    > = {
      DRAFT: { variant: "outline", label: "Draft" },
      SUBMITTED: { variant: "secondary", label: "Submitted" },
      REVIEWING: { variant: "secondary", label: "Reviewing" },
      APPROVED: { variant: "default", label: "Approved" },
      SIGNED: { variant: "default", label: "Signed" },
      EXPIRED: { variant: "destructive", label: "Expired" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };
    const cfg = map[status] || { variant: "outline", label: status };
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentsService.list({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
      });
      setDocuments(res.items || []);
    } catch (e) {
      console.error("Failed to load documents", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [page, limit, statusFilter]);

  const openDocument = async (id: string) => {
    try {
      setLoading(true);
      const full = await documentsService.get(id);
      setSelectedDocument(full);
    } catch (e) {
      console.error("Failed to load document", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedDocument) return;
    const comment = feedbackText.trim() || "Approved by leader";
    try {
      setLoading(true);
      await documentsService.approve(selectedDocument.id, { comment });
      await loadDocuments();
      setSelectedDocument(null);
      setFeedbackText("");
    } catch (e) {
      console.error("Approve failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDocument) return;
    const comment = feedbackText.trim();
    if (!comment) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      setLoading(true);
      await documentsService.reject(selectedDocument.id, { comment });
      await loadDocuments();
      setSelectedDocument(null);
      setFeedbackText("");
    } catch (e) {
      console.error("Reject failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Leader - Document Approval" }]} />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
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
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.partnerName}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDocument(doc.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>Approve or Reject this document</DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <>
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <p><strong>Title:</strong> {selectedDocument.title}</p>
                  <p><strong>Partner:</strong> {selectedDocument.partnerName}</p>
                  <p><strong>Status:</strong> {selectedDocument.status}</p>
                </TabsContent>
                <TabsContent value="attachments">
                  {selectedDocument.attachments?.map((file, i) => (
                    <Card key={i} className="p-3 flex justify-between items-center">
                      <span>{String(file)}</span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <label className="block mb-1 font-medium">Comment / Reason</label>
                <textarea
                  className="w-full border rounded-md p-2"
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Nhập lý do hoặc nhận xét..."
                />
              </div>
            </>
          )}

          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedDocument(null)}>
              Close
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}