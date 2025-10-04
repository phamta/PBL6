"use client";

import React from "react";
import { useState } from "react";
import { BarChart3, Download, FileText, TrendingUp, Users, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { StatCard } from "../StatCard";
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const monthlyData = [
  { month: "Jan", users: 120, documents: 85, delegations: 12 },
  { month: "Feb", users: 145, documents: 92, delegations: 15 },
  { month: "Mar", users: 178, documents: 110, delegations: 18 },
  { month: "Apr", users: 190, documents: 105, delegations: 14 },
  { month: "May", users: 220, documents: 125, delegations: 22 },
  { month: "Jun", users: 245, documents: 138, delegations: 20 },
];

const documentTypeData = [
  { type: "Agreements", count: 45, percentage: 25 },
  { type: "MOUs", count: 32, percentage: 18 },
  { type: "Contracts", count: 28, percentage: 15 },
  { type: "Letters", count: 56, percentage: 31 },
  { type: "Reports", count: 21, percentage: 11 },
];

const nationalityData = [
  { country: "Spain", count: 45 },
  { country: "China", count: 38 },
  { country: "USA", count: 32 },
  { country: "France", count: 28 },
  { country: "Germany", count: 25 },
  { country: "Japan", count: 22 },
  { country: "Others", count: 55 },
];

const pieChartData = [
  { name: "Active", value: 156, color: "#3b82f6" },
  { name: "Pending", value: 34, color: "#8b5cf6" },
  { name: "Completed", count: 55, value: 55, color: "#10b981" },
];

export function StatisticsPage() {
  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
    documents: {
      label: "Documents",
      color: "hsl(var(--chart-2))",
    },
    delegations: {
      label: "Delegations",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Automatic Statistics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            View comprehensive analytics and generate reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-primary">
            <FileText className="w-4 h-4 mr-2" />
            Generate PDF Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,245"
          change="+12.5% from last period"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Documents"
          value="892"
          change="+8.3% from last period"
          changeType="positive"
          icon={FileText}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Total Delegations"
          value="101"
          change="+15.2% from last period"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-cyan-500"
        />
        <StatCard
          title="Translations"
          value="267"
          change="+5.4% from last period"
          changeType="positive"
          icon={BarChart3}
          iconColor="bg-green-500"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="p-6">
          <div className="mb-6">
            <h3>Monthly Trends</h3>
            <p className="text-muted-foreground mt-1">
              Users, documents, and delegations over time
            </p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="documents"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Documents"
                />
                <Line
                  type="monotone"
                  dataKey="delegations"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Delegations"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <div className="mb-6">
            <h3>Status Distribution</h3>
            <p className="text-muted-foreground mt-1">
              Current status of all records
            </p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Document Types Distribution */}
        <Card className="p-6">
          <div className="mb-6">
            <h3>Document Types</h3>
            <p className="text-muted-foreground mt-1">
              Distribution by document type
            </p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={documentTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-1))"
                  radius={[0, 8, 8, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Nationality Distribution */}
        <Card className="p-6">
          <div className="mb-6">
            <h3>International Members by Country</h3>
            <p className="text-muted-foreground mt-1">
              Top countries represented
            </p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={nationalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-3))"
                  radius={[8, 8, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="p-6">
        <h3 className="mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4>User Growth</h4>
              <p className="text-muted-foreground mt-1">
                User registrations increased by 12.5% compared to last period
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4>Document Processing</h4>
              <p className="text-muted-foreground mt-1">
                Average document processing time reduced to 2.3 days
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4>Delegation Approval Rate</h4>
              <p className="text-muted-foreground mt-1">
                85% approval rate with average review time of 1.5 days
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}