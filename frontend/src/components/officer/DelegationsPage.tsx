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
import { guestService, GuestMember, GuestWithRelations } from "@/lib/api/guest.service";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { exportCongVanBaoCao } from "../ExportCongVanGuest";

// Types for delegation mapping
interface Delegation {
  id: string;
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "REGISTERED" | "APPROVED" | "ARRIVED" | "DEPARTED" | "CANCELLED";
  purpose: string;
  coordinator: string;
  department: string;
  agenda: string;
  participantList: GuestMember[];
  accommodations: string;
  transportation: string;
  budget: string;
  notes: string;
}

// Helper function to map GuestWithRelations to Delegation
function mapGuestToDelegation(guest: GuestWithRelations): Delegation {
  // Map guest status to delegation status (giữ nguyên như API)
  const statusMap: Record<string, Delegation["status"]> = {
    'REGISTERED': 'REGISTERED',
    'APPROVED': 'APPROVED',
    'ARRIVED': 'ARRIVED',
    'DEPARTED': 'DEPARTED',
    'CANCELLED': 'CANCELLED'
  };

  const mappedStatus: Delegation["status"] = statusMap[guest.status] || 'REGISTERED';

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
    participantList: guest.members || [],
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
  const [selectedMember, setSelectedMember] = useState<GuestMember | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Delegation>>({});

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
      REGISTERED: { variant: "secondary", label: "Registered" },
      APPROVED: { variant: "default", label: "Approved" },
      ARRIVED: { variant: "default", label: "Arrived" },
      DEPARTED: { variant: "outline", label: "Departed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return  <Badge
      variant={config.variant}
      className="w-[78px] h-[31px] flex items-center justify-center text-sm"
    >
      {config.label}
    </Badge>;
  };

  const handleExportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting report as ${format.toUpperCase()}`);
    // Implement export logic
  };

  const handlePrintDocument = async (delegation?: Delegation) => {
    const delegationToExport = delegation || selectedDelegation;
    console.log("handlePrintDocument called");
    console.log("delegationToExport:", delegationToExport);

    if (!delegationToExport) {
      console.log("No delegation to export, returning");
      return;
    }

    try {
      console.log("Calling exportCongVanBaoCao with:", delegationToExport);
      await exportCongVanBaoCao(delegationToExport);
      toast.success("Document exported successfully");
    } catch (error) {
      console.error("Failed to export document:", error);
      toast.error("Failed to export document");
    }
  };

  const handleViewDelegation = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
    setIsEditingMode(false);
    setEditFormData({});
  };

  const handleEditDelegation = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
    setEditFormData({ ...delegation });
    setIsEditingMode(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedDelegation) return;

    try {
      // Update delegation via API
      await guestService.update(selectedDelegation.id, {
        groupName: editFormData.title,
        purpose: editFormData.purpose,
        arrivalDate: editFormData.startDate,
        departureDate: editFormData.endDate,
        contactPerson: editFormData.coordinator,
        visitPurpose: editFormData.agenda,
        hostDepartment: editFormData.department,
        notes: editFormData.notes,
      });

      toast.success("Delegation updated successfully");

      // Reload delegations
      const response = await guestService.list({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const mappedDelegations = response.guests.map((guest): Delegation => mapGuestToDelegation(guest));
      setDelegations(mappedDelegations);

      // Exit edit mode
      setIsEditingMode(false);
      setEditFormData({});
    } catch (error) {
      console.error('Failed to update delegation:', error);
      toast.error('Failed to update delegation');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMode(false);
    setEditFormData({});
  };

  const handleApproveDelegation = async (delegationId: string) => {
    try {
      await guestService.approve(delegationId, { notes: "Approved by officer" });
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
      await guestService.reject(delegationId, { reason: "Rejected by officer", notes: "Rejected by officer" });
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
        <div className="flex gap-2">
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
        </div>
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
                {delegations.filter(d => d.status === "REGISTERED").length}
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
                {delegations.filter(d => d.status === "APPROVED").length}
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
                    onClick={() => handleViewDelegation(delegation)}
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
                      <DropdownMenuItem onClick={() => handleViewDelegation(delegation)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handlePrintDocument(delegation)}>
                        <Printer className="w-4 h-4 mr-2" />
                        Export Official Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportReport("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </DropdownMenuItem>
                      {delegation.status === "REGISTERED" && (
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
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDelegation(null);
            setIsEditingMode(false);
            setEditFormData({});
          }
        }}
      >
        <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditingMode ? "Edit Delegation" : "Delegation Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditingMode
                ? "Modify delegation information across all university units"
                : "View and manage university-wide delegation information"
              }
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
                      <Input className="mt-1" defaultValue={selectedDelegation.id} readOnly />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-2">
                        {getStatusBadge(selectedDelegation.status)}
                      </div>
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        value={isEditingMode ? editFormData.startDate?.split('T')[0] || '' : (selectedDelegation.startDate ? selectedDelegation.startDate.split('T')[0] : '')}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        value={isEditingMode ? editFormData.endDate?.split('T')[0] || '' : (selectedDelegation.endDate ? selectedDelegation.endDate.split('T')[0] : '')}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        className="mt-1"
                        value={isEditingMode ? editFormData.department || '' : selectedDelegation.department}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div>
                      <Label>Coordinator</Label>
                      <Input
                        className="mt-1"
                        value={isEditingMode ? editFormData.coordinator || '' : selectedDelegation.coordinator}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, coordinator: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div>
                      <Label>Total Participants</Label>
                      <Input
                        type="number"
                        className="mt-1"
                        value={isEditingMode ? editFormData.participants || '' : selectedDelegation.participants}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, participants: parseInt(e.target.value) || 0 }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div>
                      <Label>Budget</Label>
                      <Input
                        className="mt-1"
                        value={isEditingMode ? editFormData.budget || '' : selectedDelegation.budget}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, budget: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Purpose</Label>
                      <Textarea
                        className="mt-1"
                        value={isEditingMode ? editFormData.purpose || '' : selectedDelegation.purpose}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, purpose: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Agenda</Label>
                      <Textarea
                        className="mt-1"
                        value={isEditingMode ? editFormData.agenda || '' : selectedDelegation.agenda}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, agenda: e.target.value }))}
                        rows={3}
                        readOnly={!isEditingMode}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        className="mt-1"
                        value={isEditingMode ? editFormData.notes || '' : selectedDelegation.notes}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                        readOnly={!isEditingMode}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="mb-3">Participant List</h4>
                    <div className="space-y-2">
                      {selectedDelegation.participantList.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => setSelectedMember(participant)}
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{participant.fullName}</p>
                            {participant.position && (
                              <p className="text-xs text-muted-foreground">{participant.position}</p>
                            )}
                          </div>
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
            {isEditingMode ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button className="bg-primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleEditDelegation(selectedDelegation!)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Delegation
                </Button>
                <Button variant="outline" onClick={() => handlePrintDocument(selectedDelegation || undefined)} disabled={isEditingMode}>
                  <Printer className="w-4 h-4 mr-2" />
                  Export Document
                </Button>
                <Button variant="outline" onClick={() => handleExportReport("pdf")} disabled={isEditingMode}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                {selectedDelegation?.status === "REGISTERED" && !isEditingMode && (
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
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Detail Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent maxWidth="48rem" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              Detailed information about the delegation member
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input className="mt-1" defaultValue={selectedMember.fullName} readOnly />
                </div>
                <div>
                  <Label>Nationality</Label>
                  <Input className="mt-1" defaultValue={selectedMember.nationality} readOnly />
                </div>
                <div>
                  <Label>Passport Number</Label>
                  <Input className="mt-1" defaultValue={selectedMember.passportNumber} readOnly />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input className="mt-1" defaultValue={selectedMember.position} readOnly />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input className="mt-1" defaultValue={selectedMember.organization} readOnly />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input className="mt-1" defaultValue={selectedMember.title || "Not specified"} readOnly />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input className="mt-1" defaultValue={selectedMember.gender || "Not specified"} readOnly />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    defaultValue={selectedMember.dateOfBirth ? selectedMember.dateOfBirth.split('T')[0] : ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input className="mt-1" defaultValue={selectedMember.email || "Not provided"} readOnly />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input className="mt-1" defaultValue={selectedMember.phoneNumber || "Not provided"} readOnly />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedMember.affiliation && (
                <div>
                  <Label>Affiliation</Label>
                  <Textarea className="mt-1" defaultValue={selectedMember.affiliation} readOnly />
                </div>
              )}

              {/* Passport File */}
              {selectedMember.passportFile && (
                <div>
                  <Label>Passport Document</Label>
                  <div className="mt-2 p-3 bg-muted/50 rounded border">
                    <p className="text-sm text-muted-foreground">
                      Passport file available: {selectedMember.passportFile}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}