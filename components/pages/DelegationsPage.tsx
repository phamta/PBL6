"use client";

import React from "react";
import { useState } from "react";
import { 
  Calendar, 
  List, 
  Check, 
  X, 
  Eye, 
  MapPin, 
  Users, 
  Download,
  FileText,
  Printer,
  FileSpreadsheet,
  Edit,
  Clock
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";

const delegationsData = [
  {
    id: "DEL-2025-001",
    title: "EU Partnership Delegation",
    institution: "University of Barcelona",
    startDate: "2025-10-15",
    endDate: "2025-10-20",
    participants: 8,
    status: "pending",
    purpose: "Academic partnership discussion",
    coordinator: "Dr. Maria Garcia",
    department: "International Relations",
    agenda: "Day 1: Campus tour, Day 2: Partnership discussion, Day 3: MOU signing",
    participantList: [
      "Dr. Maria Garcia - Lead Coordinator",
      "Prof. Juan Martinez - Dean of Engineering",
      "Dr. Sofia Rodriguez - Research Director",
      "5 other faculty members"
    ],
    accommodations: "University Guest House, Rooms 201-208",
    transportation: "Airport pickup arranged",
    budget: "$15,000",
    notes: "VIP delegation requiring special protocol",
  },
  {
    id: "DEL-2025-002",
    title: "Research Collaboration Visit",
    institution: "MIT",
    startDate: "2025-10-22",
    endDate: "2025-10-28",
    participants: 5,
    status: "approved",
    purpose: "Joint research project kickoff",
    coordinator: "Prof. John Smith",
    department: "Research Office",
    agenda: "Research lab visits, Grant planning meetings, Technical workshops",
    participantList: [
      "Prof. John Smith - Principal Investigator",
      "Dr. Emily Chen - Research Scientist",
      "3 PhD students"
    ],
    accommodations: "Downtown Hotel",
    transportation: "Self-arranged",
    budget: "$8,500",
    notes: "Focus on AI and Machine Learning collaboration",
  },
  {
    id: "DEL-2025-003",
    title: "Student Exchange Program",
    institution: "National University Singapore",
    startDate: "2025-11-01",
    endDate: "2025-11-15",
    participants: 12,
    status: "pending",
    purpose: "Student exchange orientation",
    coordinator: "Dr. Chen Wei",
    department: "Student Affairs",
    agenda: "Orientation sessions, Campus integration, Cultural activities",
    participantList: [
      "Dr. Chen Wei - Exchange Coordinator",
      "10 Exchange Students",
      "1 Administrative Staff"
    ],
    accommodations: "Student Dormitory",
    transportation: "University shuttle service",
    budget: "$20,000",
    notes: "Includes cultural immersion program",
  },
  {
    id: "DEL-2025-004",
    title: "Faculty Development Workshop",
    institution: "ETH Zurich",
    startDate: "2025-11-10",
    endDate: "2025-11-12",
    participants: 6,
    status: "approved",
    purpose: "Faculty training and development",
    coordinator: "Prof. Schmidt",
    department: "Academic Development",
    agenda: "Teaching methodology workshops, Assessment techniques, Technology integration",
    participantList: [
      "Prof. Schmidt - Workshop Lead",
      "5 Faculty trainers"
    ],
    accommodations: "Conference Center Hotel",
    transportation: "University van",
    budget: "$12,000",
    notes: "Two-day intensive workshop",
  },
  {
    id: "DEL-2025-005",
    title: "Cultural Exchange Program",
    institution: "Peking University",
    startDate: "2025-11-20",
    endDate: "2025-11-25",
    participants: 15,
    status: "rejected",
    purpose: "Cultural and academic exchange",
    coordinator: "Dr. Wang Li",
    department: "Cultural Programs",
    agenda: "Cultural performances, Academic seminars, City tours",
    participantList: [
      "Dr. Wang Li - Cultural Director",
      "10 Students",
      "4 Faculty members"
    ],
    accommodations: "International House",
    transportation: "Tour bus",
    budget: "$25,000",
    notes: "Rejected due to scheduling conflicts",
  },
];

export function DelegationsPage() {
  const [selectedDelegation, setSelectedDelegation] = useState<
    typeof delegationsData[0] | null
  >(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      approved: { variant: "default", label: "Approved" },
      pending: { variant: "secondary", label: "Pending" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleExportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting report as ${format.toUpperCase()}`);
    // Implement export logic
  };

  const handlePrintDocument = () => {
    console.log("Printing official document");
    // Implement print logic
  };

  return (
    <div className="space-y-6">
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
          <Button className="bg-primary">
            <Users className="w-4 h-4 mr-2" />
            New Delegation
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Delegations</p>
              <h3 className="mt-1">{delegationsData.length}</h3>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Pending Approval</p>
              <h3 className="mt-1">
                {delegationsData.filter(d => d.status === "pending").length}
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
                {delegationsData.filter(d => d.status === "approved").length}
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
                {delegationsData.reduce((sum, d) => sum + d.participants, 0)}
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
          {delegationsData.map((delegation) => (
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
                          {delegation.startDate} - {delegation.endDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="text-sm">{delegation.participants} people</p>
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
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Delegation
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handlePrintDocument}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print Official Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportReport("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </DropdownMenuItem>
                      {delegation.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-green-600">
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
          ))}
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
                {delegationsData.slice(0, 3).map((delegation) => (
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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Delegation Details</DialogTitle>
            <DialogDescription>
              View and manage university-wide delegation information
            </DialogDescription>
          </DialogHeader>
          {selectedDelegation && (
            <ScrollArea className="max-h-[60vh] pr-4">
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
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 flex-wrap">
            <Button variant="outline" onClick={handlePrintDocument}>
              <Printer className="w-4 h-4 mr-2" />
              Print Document
            </Button>
            <Button variant="outline" onClick={() => handleExportReport("pdf")}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            {selectedDelegation?.status === "pending" && (
              <>
                <Button variant="outline" className="text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
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