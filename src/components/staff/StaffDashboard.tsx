"use client";

import React from "react";
import { 
  FileText, 
  Users, 
  GraduationCap, 
  Languages, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  CalendarDays,
  Activity,
  BarChart3
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { StaggerContainer, StaggerItem } from "../PageTransition";

const documentsByType = [
  { type: "MOU", count: 8 },
  { type: "Agreement", count: 6 },
  { type: "MOA", count: 4 },
  { type: "Letter", count: 3 },
];

const visaExtensionsOverTime = [
  { month: "Jun", extensions: 2 },
  { month: "Jul", extensions: 3 },
  { month: "Aug", extensions: 5 },
  { month: "Sep", extensions: 4 },
  { month: "Oct", extensions: 6 },
];

const recentActivities = [
  {
    id: 1,
    type: "mou",
    action: "MOU Proposal Submitted",
    description: "Partnership Agreement with University of Barcelona",
    user: "Dr. Smith",
    time: "5 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    type: "delegation",
    action: "Delegation Registered",
    description: "EU Partnership Visit - 5 participants",
    user: "Prof. Johnson",
    time: "1 hour ago",
    status: "confirmed",
  },
  {
    id: 3,
    type: "student",
    action: "Student Visa Extension",
    description: "Maria Garcia - Extension approved",
    user: "Admin Team",
    time: "3 hours ago",
    status: "approved",
  },
  {
    id: 4,
    type: "translation",
    action: "Translation Confirmed",
    description: "Research Collaboration MOU - EN to FR",
    user: "Translation Office",
    time: "5 hours ago",
    status: "completed",
  },
  {
    id: 5,
    type: "mou",
    action: "MOU Approved",
    description: "Technical University Munich Agreement",
    user: "Admin User",
    time: "1 day ago",
    status: "approved",
  },
  {
    id: 6,
    type: "delegation",
    action: "Guest Visit Scheduled",
    description: "Research Collaboration - 3 participants",
    user: "Dr. Chen",
    time: "1 day ago",
    status: "scheduled",
  },
  {
    id: 7,
    type: "student",
    action: "International Student Registered",
    description: "Ahmed Hassan - PhD Program",
    user: "Prof. Martinez",
    time: "2 days ago",
    status: "active",
  },
  {
    id: 8,
    type: "translation",
    action: "Translation Request Submitted",
    description: "Partnership Letter - EN to DE",
    user: "Dr. Weber",
    time: "2 days ago",
    status: "pending",
  },
  {
    id: 9,
    type: "mou",
    action: "MOU Signed",
    description: "Sorbonne University Partnership",
    user: "University President",
    time: "3 days ago",
    status: "signed",
  },
  {
    id: 10,
    type: "delegation",
    action: "Delegation Report Exported",
    description: "Q3 2025 Visitor Statistics",
    user: "Dr. Smith",
    time: "3 days ago",
    status: "completed",
  },
];

export function StaffDashboard() {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      approved: { variant: "default", label: "Approved" },
      pending: { variant: "secondary", label: "Pending" },
      proposed: { variant: "outline", label: "Proposed" },
      confirmed: { variant: "default", label: "Confirmed" },
      completed: { variant: "default", label: "Completed" },
      signed: { variant: "default", label: "Signed" },
      active: { variant: "default", label: "Active" },
      scheduled: { variant: "secondary", label: "Scheduled" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mou":
        return <FileText className="w-5 h-5" />;
      case "delegation":
        return <Users className="w-5 h-5" />;
      case "student":
        return <GraduationCap className="w-5 h-5" />;
      case "translation":
        return <Languages className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "mou":
        return "bg-blue-100 text-blue-600";
      case "delegation":
        return "bg-purple-100 text-purple-600";
      case "student":
        return "bg-cyan-100 text-cyan-600";
      case "translation":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    extensions: {
      label: "Extensions",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="mb-2">Chào mừng trở lại 👋</h1>
          <p className="text-muted-foreground">
            Tổng quan hoạt động hợp tác quốc tế của đơn vị hôm nay
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <CalendarDays className="w-4 h-4" />
          <span>Thứ Bảy, 04 tháng 10, 2025</span>
        </motion.div>
      </motion.div>

      {/* Enhanced Stat Cards */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MOU Proposals Card */}
        <StaggerItem>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <div className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                +2 this week
              </Badge>
            </div>
            <h3 className="text-muted-foreground mb-1">Total MOUs</h3>
            <div className="flex items-end gap-2">
              <h1 className="text-4xl">21</h1>
              <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>12%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">3 pending approval</p>
          </div>
        </Card>
        </motion.div>
        </StaggerItem>

        {/* Delegations Card */}
        <StaggerItem>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <div className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                5 upcoming
              </Badge>
            </div>
            <h3 className="text-muted-foreground mb-1">Total Visitors</h3>
            <div className="flex items-end gap-2">
              <h1 className="text-4xl">38</h1>
              <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>8%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">2 scheduled this month</p>
          </div>
        </Card>
        </motion.div>
        </StaggerItem>

        {/* Students Card */}
        <StaggerItem>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
        <Card className="relative overflow-hidden border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <div className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-cyan-100 rounded-xl">
                <GraduationCap className="w-6 h-6 text-cyan-600" />
              </div>
              <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                4 expiring soon
              </Badge>
            </div>
            <h3 className="text-muted-foreground mb-1">Active Students</h3>
            <div className="flex items-end gap-2">
              <h1 className="text-4xl">28</h1>
              <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>15%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">6 visa extensions</p>
          </div>
        </Card>
        </motion.div>
        </StaggerItem>

        {/* Translations Card */}
        <StaggerItem>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
        <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <div className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Languages className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                2 pending
              </Badge>
            </div>
            <h3 className="text-muted-foreground mb-1">Pending Translations</h3>
            <div className="flex items-end gap-2">
              <h1 className="text-4xl">8</h1>
              <div className="flex items-center gap-1 text-sm text-red-600 mb-2">
                <ArrowDownRight className="w-4 h-4" />
                <span>5%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">32 confirmed total</p>
          </div>
        </Card>
        </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Section */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents by Type */}
        <StaggerItem>
        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Documents by Type
              </h3>
              <p className="text-muted-foreground mt-1">Distribution of your department's documents</p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={documentsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="type" />
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
        </motion.div>
        </StaggerItem>

        {/* Visa Extensions Over Time */}
        <StaggerItem>
        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Visa Extensions Over Time
              </h3>
              <p className="text-muted-foreground mt-1">Monthly visa extension requests</p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visaExtensionsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="extensions"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <p className="text-muted-foreground mt-1">Last 10 submitted or updated records</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <span>{activity.action}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.user}
                  </TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      </motion.div>

      {/* Quick Action Cards */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                  3 Pending
                </Badge>
              </div>
              <h4 className="mb-2">MOU Proposals</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Review and track approval status for your submitted proposals
              </p>
              <Button variant="outline" className="w-full border-blue-300 hover:bg-blue-50">
                Review Proposals
              </Button>
            </Card>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                  4 Expiring
                </Badge>
              </div>
              <h4 className="mb-2">Visa Extensions</h4>
              <p className="text-sm text-muted-foreground mb-4">
                4 student visas expiring within 30 days - take action now
              </p>
              <Button variant="outline" className="w-full border-purple-300 hover:bg-purple-50">
                Submit Extensions
              </Button>
            </Card>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  2 Ready
                </Badge>
              </div>
              <h4 className="mb-2">Confirmations</h4>
              <p className="text-sm text-muted-foreground mb-4">
                2 translation confirmation letters ready for download
              </p>
              <Button variant="outline" className="w-full border-green-300 hover:bg-green-50">
                Download Letters
              </Button>
            </Card>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}