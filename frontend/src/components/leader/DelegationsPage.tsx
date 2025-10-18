"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  Download,
  FileText,
  FileSpreadsheet,
  List,
  Calendar,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  Building,
  MapPin,
  DollarSign,
  Printer,
  Plus,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Breadcrumbs } from "../Breadcrumbs";
import { guestService, GuestWithRelations } from "@/lib/api/guest.service";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Types for delegation mapping
interface Delegation {
  id: string;
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "pending" | "approved" | "rejected" | "arrived" | "departed" | "cancelled";
  purpose: string;
  coordinator: string;
  department: string;
  agenda: string;
  participantList: string[];
  accommodations: string;
  transportation: string;
  budget: string;
  notes: string;
}

// Helper function to map GuestWithRelations to Delegation
function mapGuestToDelegation(guest: GuestWithRelations): Delegation {
  // Map guest status to delegation status
  const statusMap: Record<string, Delegation["status"]> = {
    'REGISTERED': 'pending',
    'APPROVED': 'approved',
    'ARRIVED': 'arrived',
    'DEPARTED': 'departed',
    'CANCELLED': 'cancelled'
  };

  const mappedStatus: Delegation["status"] = statusMap[guest.status] || 'pending';

  return {
    id: guest.id,
    title: guest.groupName || "Unnamed Delegation",
    institution: guest.partner?.name || "Unknown Institution",
    startDate: guest.arrivalDate,
    endDate: guest.departureDate,
    participants: guest.totalMembers,
    status: mappedStatus,
    purpose: guest.purpose,
    coordinator: guest.contactPerson,
    department: guest.unit?.name || "Unknown Department",
    agenda: guest.visitPurpose || "",
    participantList: guest.members?.map(member =>
      `${member.fullName}${member.position ? ` - ${member.position}` : ''}`
    ) || [],
    accommodations: guest.notes?.includes("accommodations") ? guest.notes : "Not specified",
    transportation: guest.notes?.includes("transportation") ? guest.notes : "Not specified",
    budget: guest.notes?.includes("budget") ? guest.notes : "Not specified",
    notes: guest.notes || "",
  };
}


export function DelegationsPage() {
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  // const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);

  // Load delegations data
  useEffect(() => {
    const loadDelegations = async () => {
      try {
        setLoading(true);
        const response = await guestService.list({
          page: 1,
          limit: 100, // Load more for officer view
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        const mappedDelegations = response.guests.map((guest): Delegation => mapGuestToDelegation(guest));
        setDelegations(mappedDelegations);
      } catch (error) {
        console.error('Failed to load delegations:', error);
        toast.error('Failed to load delegations data');
      } finally {
        setLoading(false);
      }
    };

    loadDelegations();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      approved: { variant: "default", label: "Approved" },
      pending: { variant: "secondary", label: "Pending" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return  <Badge
      variant={config.variant}
      className="w-[78px] h-[31px] flex items-center justify-center text-sm"
    >
      {config.label}
    </Badge>;
  };

  // const handleExportReport = (format: "pdf" | "excel") => {
  //   console.log(`Exporting report as ${format.toUpperCase()}`);
  //   // Implement export logic
  // };

  const handlePrintDocument = () => {
    console.log("Printing official document");
    // Implement print logic
  };

  // const handleEditDelegation = (delegation: Delegation) => {
  //   setEditingDelegation(delegation);
  //   setSelectedDelegation(null);
  // };

  const handleApproveDelegation = async (delegationId: string) => {
    try {
      await guestService.approve(delegationId, { notes: "Approved by leader" });
      toast.success("Delegation approved successfully");
      // Reload delegations
      const response = await guestService.list({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const mappedDelegations = response.guests.map((guest): Delegation => mapGuestToDelegation(guest));
      setDelegations(mappedDelegations);
    } catch (error) {
      console.error('Failed to approve delegation:', error);
      toast.error('Failed to approve delegation');
    }
  };

  const handleRejectDelegation = async (delegationId: string) => {
    try {
      await guestService.reject(delegationId, { reason: "Rejected by leader", notes: "Rejected by leader" });
      toast.success("Delegation rejected successfully");
      // Reload delegations
      const response = await guestService.list({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const mappedDelegations = response.guests.map((guest): Delegation => mapGuestToDelegation(guest));
      setDelegations(mappedDelegations);
    } catch (error) {
      console.error('Failed to reject delegation:', error);
      toast.error('Failed to reject delegation');
    }
  };

  return (
    <div className="space-y-6">
       <Breadcrumbs items={[{ label: "Quản lý đoàn công tác" }]} />
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1>Incoming Delegation Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track incoming delegations across the university
          </p>
        </div>
        {/* <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExportReport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport("excel")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel Spreadsheet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Delegations</p>
              <h3 className="mt-1">{delegations.length}</h3>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Pending Approval</p>
              <h3 className="mt-1">
                {delegations.filter(d => d.status === "pending").length}
              </h3>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Approved</p>
              <h3 className="mt-1">
                {delegations.filter(d => d.status === "approved").length}
              </h3>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Participants</p>
              <h3 className="mt-1">
                {delegations.reduce((sum, d) => sum + d.participants, 0)}
              </h3>
            </div>
            <Users className="w-8 h-8 text-cyan-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">
            <List className="w-4 h-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading delegations...</p>
            </div>
          ) : delegations.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3>No delegations found</h3>
              <p className="text-muted-foreground">There are no delegations to display at the moment.</p>
            </Card>
          ) : (
            delegations.map((delegation) => (
            <Card key={delegation.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1">{delegation.title}</h3>
                        <p className="text-muted-foreground">
                          {delegation.institution}
                        </p>
                      </div>
                      {getStatusBadge(delegation.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Dates</p>
                        <p className="text-sm">
                          {new Date(delegation.startDate).toLocaleDateString()} - {new Date(delegation.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="text-sm">{delegation.participantList.length} people</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="text-sm">{delegation.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coordinator</p>
                        <p className="text-sm">{delegation.coordinator}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDelegation(delegation)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedDelegation(delegation)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => handleEditDelegation(delegation)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Delegation
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem onClick={handlePrintDocument}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print Official Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportReport("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </DropdownMenuItem> */}
                      {delegation.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleApproveDelegation(delegation.id)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRejectDelegation(delegation.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="p-6">
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3>Calendar View</h3>
              <p className="text-muted-foreground mt-2">
                Calendar integration would be displayed here
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {delegations.slice(0, 3).map((delegation) => (
                  <Card key={delegation.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        {delegation.startDate}
                      </span>
                    </div>
                    <h4>{delegation.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {delegation.institution}
                    </p>
                    <div className="mt-3">{getStatusBadge(delegation.status)}</div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Detail Dialog */}
      <Dialog
        open={!!selectedDelegation}
        onOpenChange={(open) => !open && setSelectedDelegation(null)}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delegation Details</DialogTitle>
            <DialogDescription>
              View and manage university-wide delegation information
            </DialogDescription>
          </DialogHeader>
          {selectedDelegation && (
            <div className="dialog-body max-h-[70vh] overflow-y-auto">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="logistics">Logistics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3>{selectedDelegation.title}</h3>
                      <p className="text-muted-foreground">
                        {selectedDelegation.institution}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Delegation ID</Label>
                      <Input className="mt-1" defaultValue={selectedDelegation.id} />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-2">
                        {getStatusBadge(selectedDelegation.status)}
                      </div>
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input type="date" className="mt-1" defaultValue={selectedDelegation.startDate} />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input type="date" className="mt-1" defaultValue={selectedDelegation.endDate} />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input className="mt-1" defaultValue={selectedDelegation.department} />
                    </div>
                    <div>
                      <Label>Coordinator</Label>
                      <Input className="mt-1" defaultValue={selectedDelegation.coordinator} />
                    </div>
                    <div>
                      <Label>Total Participants</Label>
                      <Input className="mt-1" defaultValue={selectedDelegation.participants} />
                    </div>
                    <div>
                      <Label>Budget</Label>
                      <Input className="mt-1" defaultValue={selectedDelegation.budget} />
                    </div>
                    <div className="col-span-2">
                      <Label>Purpose</Label>
                      <Textarea className="mt-1" defaultValue={selectedDelegation.purpose} />
                    </div>
                    <div className="col-span-2">
                      <Label>Agenda</Label>
                      <Textarea className="mt-1" defaultValue={selectedDelegation.agenda} rows={3} />
                    </div>
                    <div className="col-span-2">
                      <Label>Additional Notes</Label>
                      <Textarea className="mt-1" defaultValue={selectedDelegation.notes} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="mb-3">Participant List</h4>
                    <div className="space-y-2">
                      {selectedDelegation.participantList.map((participant, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm">{participant}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="logistics" className="space-y-4">
                  <div className="grid gap-4">
                    <Card className="p-4">
                      <h4 className="mb-2">Accommodations</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedDelegation.accommodations}
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="mb-2">Transportation</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedDelegation.transportation}
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="mb-2">Budget Allocation</h4>
                      <p className="text-sm text-muted-foreground">
                        Total Budget: {selectedDelegation.budget}
                      </p>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="mt-4 border-t pt-4">
            {/* <Button variant="outline" onClick={handlePrintDocument}>
              <Printer className="w-4 h-4 mr-2" />
              Print Document
            </Button>
            <Button variant="outline" onClick={() => handleExportReport("pdf")}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button> */}
            {selectedDelegation?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => handleRejectDelegation(selectedDelegation.id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApproveDelegation(selectedDelegation.id)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </div>
  );
}