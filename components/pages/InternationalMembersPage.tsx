"use client";

import React from "react";
import { useState } from "react";
import { 
  Globe, 
  Search, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  UserPlus,
  FileText,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  Check,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const membersData = [
  {
    id: "INT-001",
    name: "Maria Garcia Rodriguez",
    role: "Student",
    nationality: "Spain",
    status: "active",
    program: "Master's in Computer Science",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2026-06-30",
    visaStatus: "valid",
    startDate: "2024-09-01",
    endDate: "2026-06-30",
    email: "maria.garcia@university.edu",
  },
  {
    id: "INT-002",
    name: "Chen Wei",
    role: "Trainee",
    nationality: "China",
    status: "active",
    program: "Research Internship - AI Lab",
    visaType: "Exchange Visitor (J-1)",
    visaExpiry: "2025-10-20",
    visaStatus: "expiring-soon",
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    email: "chen.wei@university.edu",
  },
  {
    id: "INT-003",
    name: "Prof. John Smith",
    role: "Lecturer",
    nationality: "USA",
    status: "active",
    program: "Visiting Professor - Engineering",
    visaType: "Work Visa (H-1B)",
    visaExpiry: "2025-12-31",
    visaStatus: "valid",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    email: "j.smith@university.edu",
  },
  {
    id: "INT-004",
    name: "Yuki Tanaka",
    role: "Student",
    nationality: "Japan",
    status: "active",
    program: "Exchange Student - Business",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2026-01-31",
    visaStatus: "valid",
    startDate: "2025-09-01",
    endDate: "2026-01-31",
    email: "yuki.tanaka@university.edu",
  },
  {
    id: "INT-005",
    name: "Ahmed Hassan",
    role: "Student",
    nationality: "Egypt",
    status: "pending",
    program: "PhD in Mechanical Engineering",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2029-06-30",
    visaStatus: "under-renewal",
    startDate: "2025-10-15",
    endDate: "2029-06-30",
    email: "ahmed.hassan@university.edu",
  },
  {
    id: "INT-006",
    name: "Dr. Sophie Dubois",
    role: "Lecturer",
    nationality: "France",
    status: "active",
    program: "Visiting Researcher - Chemistry",
    visaType: "Exchange Visitor (J-1)",
    visaExpiry: "2025-11-30",
    visaStatus: "expiring-soon",
    startDate: "2024-06-01",
    endDate: "2025-11-30",
    email: "sophie.dubois@university.edu",
  },
  {
    id: "INT-007",
    name: "Raj Patel",
    role: "Trainee",
    nationality: "India",
    status: "completed",
    program: "Industrial Training - Software Dev",
    visaType: "Training Visa (H-3)",
    visaExpiry: "2024-12-31",
    visaStatus: "expired",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    email: "raj.patel@university.edu",
  },
  {
    id: "INT-008",
    name: "Anna Kowalski",
    role: "Student",
    nationality: "Poland",
    status: "active",
    program: "Bachelor's in Architecture",
    visaType: "Student Visa (F-1)",
    visaExpiry: "2026-06-30",
    visaStatus: "valid",
    startDate: "2023-09-01",
    endDate: "2026-06-30",
    email: "anna.kowalski@university.edu",
  },
];

const nationalityDistribution = [
  { country: "Spain", count: 2, color: "#3b82f6" },
  { country: "China", count: 3, color: "#8b5cf6" },
  { country: "USA", count: 1, color: "#06b6d4" },
  { country: "Japan", count: 1, color: "#10b981" },
  { country: "India", count: 2, color: "#f59e0b" },
  { country: "France", count: 1, color: "#ec4899" },
  { country: "Others", count: 3, color: "#6b7280" },
];

const programDistribution = [
  { program: "Students", count: 5 },
  { program: "Trainees", count: 2 },
  { program: "Lecturers", count: 4 },
];

const visaTypeDistribution = [
  { type: "Student Visa", count: 5 },
  { type: "Exchange Visitor", count: 3 },
  { type: "Work Visa", count: 3 },
  { type: "Training Visa", count: 2 },
];

export function InternationalMembersPage() {
  const [selectedMember, setSelectedMember] = useState<typeof membersData[0] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("members");

  const filteredMembers = membersData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      active: { variant: "default", label: "Active" },
      pending: { variant: "secondary", label: "Pending" },
      completed: { variant: "outline", label: "Completed" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getVisaStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string; icon: React.ReactNode }> = {
      valid: { 
        variant: "default", 
        label: "Valid",
        icon: <Check className="w-3 h-3 mr-1" />
      },
      "expiring-soon": { 
        variant: "secondary", 
        label: "Expiring Soon",
        icon: <AlertCircle className="w-3 h-3 mr-1" />
      },
      "under-renewal": { 
        variant: "outline", 
        label: "Under Renewal",
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      expired: { 
        variant: "destructive", 
        label: "Expired",
        icon: <AlertCircle className="w-3 h-3 mr-1" />
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

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Student: "bg-blue-100 text-blue-700",
      Trainee: "bg-purple-100 text-purple-700",
      Lecturer: "bg-green-100 text-green-700",
    };
    return (
      <Badge variant="outline" className={colors[role] || ""}>
        {role}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExportReport = (format: "csv" | "excel" | "word") => {
    console.log(`Exporting report as ${format.toUpperCase()}`);
  };

  const handlePrintLetter = () => {
    console.log("Printing official letter");
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  const expiringCount = membersData.filter(m => m.visaStatus === "expiring-soon").length;
  const renewalCount = membersData.filter(m => m.visaStatus === "under-renewal").length;
  const validCount = membersData.filter(m => m.visaStatus === "valid").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1>International Students/Trainees/Lecturers</h1>
          <p className="text-muted-foreground mt-1">
            Manage international members, visa extensions, and generate reports
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExportReport("csv")}>
                <FileText className="w-4 h-4 mr-2" />
                CSV File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport("excel")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel Spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport("word")}>
                <FileText className="w-4 h-4 mr-2" />
                Word Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="statistics">Statistics & Reports</TabsTrigger>
          <TabsTrigger value="visa">Visa Management</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, nationality, or program..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Trainee">Trainee</SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 bg-primary text-primary-foreground">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 truncate">{member.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {member.nationality}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                    <div className="mb-2">
                      {getVisaStatusBadge(member.visaStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {member.program}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Total Members</p>
                  <h2 className="mt-1">{membersData.length}</h2>
                </div>
                <Globe className="w-10 h-10 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Active Programs</p>
                  <h2 className="mt-1">
                    {membersData.filter(m => m.status === "active").length}
                  </h2>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Countries</p>
                  <h2 className="mt-1">{nationalityDistribution.length}</h2>
                </div>
                <Globe className="w-10 h-10 text-cyan-500" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Distribution by Nationality</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nationalityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, percent }) =>
                        `${country} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {nationalityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Distribution by Role</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={programDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="program" />
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
              <h3 className="mb-4">Distribution by Visa Type</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={visaTypeDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      radius={[0, 8, 8, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Quick Export</h3>
              <p className="text-muted-foreground mb-6">
                Generate comprehensive reports in various formats
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportReport("csv")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportReport("excel")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportReport("word")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as Word
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Visa Management Tab */}
        <TabsContent value="visa" className="space-y-6">
          {/* Visa Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Expiring Soon</p>
                  <h2 className="mt-1">{expiringCount}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Within 1 month
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Under Renewal</p>
                  <h2 className="mt-1">{renewalCount}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    In process
                  </p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Valid Visas</p>
                  <h2 className="mt-1">{validCount}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    No action needed
                  </p>
                </div>
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Card>
          </div>

          {/* Visa Extension Requests */}
          <Card className="p-6">
            <h3 className="mb-4">Recent Visa Extension Requests</h3>
            <div className="space-y-3">
              {membersData
                .filter(m => m.visaStatus === "expiring-soon" || m.visaStatus === "under-renewal")
                .map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4>{member.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Visa expires: {member.visaExpiry}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVisaStatusBadge(member.visaStatus)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedMember(member)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Review Request
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrintLetter}>
                              <Printer className="w-4 h-4 mr-2" />
                              Print Letter
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-green-600">
                              <Check className="w-4 h-4 mr-2" />
                              Approve Extension
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Detail Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              View and manage international member information
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 bg-primary text-primary-foreground">
                    <AvatarFallback className="text-xl">
                      {getInitials(selectedMember.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{selectedMember.name}</h3>
                    <p className="text-muted-foreground">{selectedMember.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Member ID</Label>
                    <p className="mt-1">{selectedMember.id}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p className="mt-1">{selectedMember.nationality}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1">{getRoleBadge(selectedMember.role)}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedMember.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Program</Label>
                    <p className="mt-1">{selectedMember.program}</p>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <p className="mt-1">{selectedMember.startDate}</p>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <p className="mt-1">{selectedMember.endDate}</p>
                  </div>
                </div>

                <Card className="p-4 bg-accent/50">
                  <h4 className="mb-3">Visa Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Visa Type</Label>
                      <p className="mt-1">{selectedMember.visaType}</p>
                    </div>
                    <div>
                      <Label>Visa Status</Label>
                      <div className="mt-1">{getVisaStatusBadge(selectedMember.visaStatus)}</div>
                    </div>
                    <div className="col-span-2">
                      <Label>Expiry Date</Label>
                      <p className="mt-1">{selectedMember.visaExpiry}</p>
                    </div>
                  </div>
                </Card>

                {(selectedMember.visaStatus === "expiring-soon" || 
                  selectedMember.visaStatus === "under-renewal") && (
                  <Card className="p-4">
                    <h4 className="mb-3">Visa Extension Actions</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add notes or comments about the visa extension request..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-2" />
                          Approve Extension
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={handlePrintLetter}>
                          <Printer className="w-4 h-4 mr-2" />
                          Generate Letter
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              Close
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
            <Button variant="outline" onClick={handlePrintLetter}>
              <Printer className="w-4 h-4 mr-2" />
              Print Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}