"use client"

import React, { useState } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
} from "lucide-react";
import {
  LineChart,
  BarChart as RechartsBarChart,
} from "recharts"; // Giả sử bạn có component custom
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatCard } from "@/components/StatCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XAxis, Bar, Line } from "recharts";

export default function LeaderDashboard() {
  const [period, setPeriod] = useState("quarter");

  // === Data: Team performance over time ===
  const teamPerformanceData = [
    { month: "Jan", teamA: 82, teamB: 90, teamC: 74 },
    { month: "Feb", teamA: 85, teamB: 92, teamC: 78 },
    { month: "Mar", teamA: 88, teamB: 91, teamC: 80 },
    { month: "Apr", teamA: 90, teamB: 94, teamC: 83 },
    { month: "May", teamA: 87, teamB: 95, teamC: 81 },
    { month: "Jun", teamA: 89, teamB: 96, teamC: 85 },
  ];

  // === Data: Team workload (bar chart) ===
  const teamWorkloadData = [
    { team: "Team A", tasks: 240 },
    { team: "Team B", tasks: 180 },
    { team: "Team C", tasks: 210 },
  ];

  // === Data: Project status (pie) ===
  const projectStatusData = [
    { name: "In Progress", value: 40, color: "#3b82f6" },
    { name: "Completed", value: 50, color: "#10b981" },
    { name: "Pending", value: 10, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      {/* === Header === */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leader Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Gain insights into team performance and project progress
          </p>
        </div>

        <div className="flex gap-2">
          <Select
            defaultValue={period}
            onValueChange={(val) => setPeriod(val)}
          >
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button className="bg-primary text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate Team Report
          </Button>
        </div>
      </div>

      {/* === Breadcrumb === */}
      <Breadcrumbs items={[{ label: "Báo cáo tổng hợp (Leader)" }]} />

      {/* === Overview Section === */}
      <div>
        <h1 className="text-xl font-semibold">
          Team Performance & Strategic Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor teams’ performance, collaboration, and outcomes.
        </p>
      </div>

      {/* === Stat Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Active Teams"
          value="24"
          change="+3 new teams this quarter"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Projects"
          value="68"
          change="+8.3% growth"
          icon={FileText}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Avg Team Efficiency"
          value="87%"
          change="+4% from last quarter"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Pending Reports"
          value="12"
          change="-5 since last month"
          changeType="positive"
          icon={BarChart3}
          iconColor="bg-orange-500"
        />
      </div>

      {/* === Charts Section === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Team Performance Over Time</h3>
          <LineChart data={teamPerformanceData}>
            <Line dataKey="teamA" stroke="hsl(var(--chart-1))" name="Team A" />
            <Line dataKey="teamB" stroke="hsl(var(--chart-2))" name="Team B" />
            <Line dataKey="teamC" stroke="hsl(var(--chart-3))" name="Team C" />
          </LineChart>
        </div>

        {/* Bar Chart */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Team Workload</h3>
          <RechartsBarChart data={teamWorkloadData}>
            <XAxis dataKey="team" />
            <Bar dataKey="tasks" fill="hsl(var(--chart-2))" />
          </RechartsBarChart>
        </div>
      </div>

      {/* === Insights Section === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="font-semibold">Top Performing Team</h4>
          <p className="text-muted-foreground mt-1">
            Team B achieved 92% target completion this quarter.
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="font-semibold">Efficiency Gains</h4>
          <p className="text-muted-foreground mt-1">
            Overall efficiency increased by 7.5% compared to last period.
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h4 className="font-semibold">Upcoming Projects</h4>
          <p className="text-muted-foreground mt-1">
            5 new cross-department projects scheduled for Q4.
          </p>
        </div>
      </div>
    </div>
  );
}
