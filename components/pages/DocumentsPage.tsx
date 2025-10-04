"use client";

import React from "react";
import { useState } from "react";
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

const documentsData = [
  {
    id: "DOC-2025-001",
    title: "International Partnership Agreement",
    partner: "University of Barcelona",
    signedDate: "2025-09-28",
    status: "signed",
    type: "Agreement",
    department: "International Relations",
    submittedBy: "Dr. Maria Garcia",
    attachments: ["agreement_signed.pdf", "terms_conditions.pdf"],
    description: "Bilateral partnership agreement for student exchange and research collaboration.",
  },
  {
    id: "DOC-2025-002",
    title: "Student Exchange MOU",
    partner: "Technical University Munich",
    signedDate: "2025-09-25",
    status: "signed",
    type: "MOU",
    department: "Engineering",
    submittedBy: "Prof. Schmidt",
    attachments: ["mou_final.pdf"],
    description: "Memorandum of Understanding for engineering student exchange program.",
  },
  {
    id: "DOC-2025-003",
    title: "Research Collaboration Contract",
    partner: "ETH Zurich",
    signedDate: "2025-09-22",
    status: "pending-approval",
    type: "Contract",
    department: "Research Office",
    submittedBy: "Dr. Weber",
    attachments: ["contract_draft.pdf"],
    description: "Joint research project on sustainable energy solutions.",
  },
  {
    id: "DOC-2025-004",
    title: "Joint Degree Program Agreement",
    partner: "Sorbonne University",
    signedDate: "2025-09-20",
    status: "signed",
    type: "Agreement",
    department: "Academic Affairs",
    submittedBy: "Prof. Dubois",
    attachments: ["program_agreement.pdf", "curriculum.pdf"],
    description: "Double degree program in International Business.",
  },
  {
    id: "DOC-2025-005",
    title: "Faculty Exchange MOU",
    partner: "National University Singapore",
    signedDate: "2025-09-18",
    status: "under-review",
    type: "MOU",
    department: "Faculty Affairs",
    submittedBy: "Dr. Chen",
    attachments: ["faculty_exchange_mou.pdf"],
    description: "Faculty exchange program for teaching and research.",
  },
  {
    id: "DOC-2025-006",
    title: "Erasmus+ Partnership",
    partner: "University of Amsterdam",
    signedDate: "2025-09-15",
    status: "needs-revision",
    type: "Agreement",
    department: "European Programs",
    submittedBy: "Dr. Van der Berg",
    attachments: ["erasmus_draft.pdf"],
    description: "Erasmus+ mobility partnership agreement.",
  },
  {
    id: "DOC-2025-007",
    title: "Research Grant Agreement",
    partner: "MIT",
    signedDate: "2025-09-12",
    status: "expired",
    type: "Contract",
    department: "Research Office",
    submittedBy: "Prof. Johnson",
    attachments: ["grant_agreement.pdf"],
    description: "Collaborative research grant for AI applications.",
  },
  {
    id: "DOC-2025-008",
    title: "Cultural Exchange Letter",
    partner: "Peking University",
    signedDate: "2025-09-10",
    status: "signed",
    type: "Letter",
    department: "Cultural Programs",
    submittedBy: "Dr. Wang",
    attachments: ["cultural_exchange.pdf"],
    description: "Cultural exchange and arts collaboration program.",
  },
];

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
];

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<typeof documentsData[0] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbackText, setFeedbackText] = useState("");
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const filteredDocuments = documentsData.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string; icon: React.ReactNode }> = {
      signed: { 
        variant: "default", 
        label: "Signed",
        icon: <FileCheck className="w-3 h-3 mr-1" />
      },
      "pending-approval": { 
        variant: "secondary", 
        label: "Pending Approval",
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      "under-review": { 
        variant: "outline", 
        label: "Under Review",
        icon: <Eye className="w-3 h-3 mr-1" />
      },
      "needs-revision": {
        variant: "destructive",
        label: "Needs Revision",
        icon: <AlertCircle className="w-3 h-3 mr-1" />
      },
      expired: { 
        variant: "destructive", 
        label: "Expired",
        icon: <X className="w-3 h-3 mr-1" />
      },
    };
    const config = variants[status] || { variant: "outline" as const, label: status, icon: null };
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const handleApprove = () => {
    // Implement approval logic
    console.log("Document approved");
    setSelectedDocument(null);
  };

  const handleReject = () => {
    // Implement rejection logic
    console.log("Document rejected");
    setSelectedDocument(null);
  };

  const handleSendFeedback = () => {
    // Implement feedback sending logic
    console.log("Feedback sent:", feedbackText);
    setFeedbackText("");
  };

  return (
    <div className="space-y-6">
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
                  <TableCell>{document.partner}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {document.department}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {document.signedDate}
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
                          onClick={() => setSelectedDocument(document)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(document.status === "pending-approval" || document.status === "under-review") && (
                          <>
                            <DropdownMenuItem>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Request Revision
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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Review and manage document information
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="flex gap-6">
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
                    <ScrollArea className="h-[400px] pr-4">
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
                            <Input className="mt-1" defaultValue={selectedDocument.partner} />
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
                            <Input type="date" className="mt-1" defaultValue={selectedDocument.signedDate} />
                          </div>
                          <div>
                            <Label>Department</Label>
                            <p className="mt-1">{selectedDocument.department}</p>
                          </div>
                          <div>
                            <Label>Submitted By</Label>
                            <p className="mt-1">{selectedDocument.submittedBy}</p>
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
                    </ScrollArea>
                  </TabsContent>

                  {/* Review Tab */}
                  <TabsContent value="review" className="space-y-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {(selectedDocument.status === "pending-approval" || 
                          selectedDocument.status === "under-review" ||
                          selectedDocument.status === "needs-revision") && (
                          <Card className="p-4 bg-accent/50">
                            <h4 className="mb-2">Admin Review Actions</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Review the document and take appropriate action
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={handleApprove}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve Document
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="flex-1"
                                onClick={handleReject}
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
                            disabled={!feedbackText}
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
                              <span>{selectedDocument.submittedBy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Department:</span>
                              <span>{selectedDocument.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Submission Date:</span>
                              <span>{selectedDocument.signedDate}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Attachments Tab */}
                  <TabsContent value="attachments" className="space-y-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {selectedDocument.attachments.map((file, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p>{file}</p>
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
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                    Close
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRevisionHistory(!showRevisionHistory)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {showRevisionHistory ? "Hide" : "Show"} History
                  </Button>
                </DialogFooter>
              </div>

              {/* Revision History Sidebar */}
              {showRevisionHistory && (
                <>
                  <Separator orientation="vertical" className="h-auto" />
                  <div className="w-80">
                    <h4 className="mb-4">Revision History</h4>
                    <ScrollArea className="h-[500px]">
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
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}