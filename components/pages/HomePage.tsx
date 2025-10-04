"use client";

import React from "react";
import { Users, FileText, Send, BarChart, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { Card } from "../ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const userChartData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 145 },
  { month: "Mar", users: 178 },
  { month: "Apr", users: 190 },
  { month: "May", users: 220 },
  { month: "Jun", users: 245 },
];

const documentChartData = [
  { type: "Agreements", count: 45 },
  { type: "MOUs", count: 32 },
  { type: "Contracts", count: 28 },
  { type: "Letters", count: 56 },
  { type: "Reports", count: 41 },
];

const recentActivities = [
  {
    id: 1,
    action: "Document signed",
    user: "John Smith",
    detail: "Partnership Agreement 2025-001",
    time: "5 minutes ago",
    type: "success",
  },
  {
    id: 2,
    action: "Delegation approved",
    user: "Maria Garcia",
    detail: "EU Exchange Program",
    time: "1 hour ago",
    type: "success",
  },
  {
    id: 3,
    action: "Translation requested",
    user: "Chen Wei",
    detail: "Research Collaboration MOU",
    time: "2 hours ago",
    type: "pending",
  },
  {
    id: 4,
    action: "User registered",
    user: "Ahmed Hassan",
    detail: "International Student - Egypt",
    time: "3 hours ago",
    type: "info",
  },
  {
    id: 5,
    action: "Report generated",
    user: "System",
    detail: "Monthly Statistics Report",
    time: "5 hours ago",
    type: "info",
  },
];

const translationRequests = [
  {
    id: "TR-2025-001",
    document: "Research Partnership Agreement",
    from: "English",
    to: "Spanish",
    requester: "Dr. Martinez",
    status: "pending",
    date: "2025-10-03",
  },
  {
    id: "TR-2025-002",
    document: "Student Exchange MOU",
    from: "French",
    to: "English",
    requester: "Prof. Dubois",
    status: "in-progress",
    date: "2025-10-02",
  },
  {
    id: "TR-2025-003",
    document: "Joint Research Proposal",
    from: "German",
    to: "English",
    requester: "Dr. Schmidt",
    status: "completed",
    date: "2025-10-01",
  },
  {
    id: "TR-2025-004",
    document: "Cultural Exchange Agreement",
    from: "Chinese",
    to: "English",
    requester: "Prof. Wang",
    status: "pending",
    date: "2025-10-03",
  },
];

export function HomePage() {
  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,245"
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Documents"
          value="892"
          change="+8.3% from last month"
          changeType="positive"
          icon={FileText}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Active Delegations"
          value="34"
          change="5 pending approval"
          changeType="neutral"
          icon={Send}
          iconColor="bg-cyan-500"
        />
        <StatCard
          title="Pending Translations"
          value="18"
          change="-2 from yesterday"
          changeType="positive"
          icon={BarChart}
          iconColor="bg-green-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Over Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Users Over Time</h3>
              <p className="text-muted-foreground mt-1">Monthly user growth trend</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Documents by Type */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Documents by Type</h3>
              <p className="text-muted-foreground mt-1">Distribution of document types</p>
            </div>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={documentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Recent Activity</h3>
              <p className="text-muted-foreground mt-1">Latest system activities</p>
            </div>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{activity.action}</span>
                        <span className="text-sm text-muted-foreground">
                          {activity.detail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Translation Requests */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Recent Translation Requests</h3>
              <p className="text-muted-foreground mt-1">Latest translation submissions</p>
            </div>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {translationRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-muted-foreground">
                      {request.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{request.document}</span>
                        <span className="text-sm text-muted-foreground">
                          {request.from} → {request.to}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "completed"
                            ? "default"
                            : request.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}