"use client";

import React from "react";
import { useState } from "react";
import { BarChart3, Download, Filter, FileText, PieChart, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Breadcrumbs } from "../Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const mouByYearData = [
  { year: "2020", count: 12 },
  { year: "2021", count: 18 },
  { year: "2022", count: 24 },
  { year: "2023", count: 32 },
  { year: "2024", count: 28 },
  { year: "2025", count: 21 },
];

const mouByTypeData = [
  { type: "MOU", value: 45, color: "#0070f3" },
  { type: "MOA", value: 28, color: "#4caf50" },
  { type: "Thỏa thuận", value: 18, color: "#8b5cf6" },
  { type: "Thư cam kết", value: 12, color: "#f59e0b" },
];

const studentsByCountryData = [
  { country: "Trung Quốc", count: 45 },
  { country: "Hàn Quốc", count: 32 },
  { country: "Nhật Bản", count: 28 },
  { country: "Thái Lan", count: 22 },
  { country: "Ấn Độ", count: 18 },
];

const topPartners = [
  { name: "Đại học Barcelona", mous: 5, students: 12, country: "Tây Ban Nha" },
  { name: "Đại học Munich", mous: 4, students: 8, country: "Đức" },
  { name: "MIT", mous: 3, students: 6, country: "Mỹ" },
  { name: "Đại học Tokyo", mous: 4, students: 10, country: "Nhật Bản" },
  { name: "Đại học Sorbonne", mous: 3, students: 7, country: "Pháp" },
];

export function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [reportType, setReportType] = useState("all");

  const chartConfig = {
    count: {
      label: "Số lượng",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Báo cáo & Thống kê" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Báo Cáo & Thống Kê</h1>
          <p className="text-muted-foreground mt-1">
            Tổng hợp và phân tích dữ liệu hợp tác quốc tế
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Xuất Word
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="report-year">Năm báo cáo</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="report-year" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="report-type">Loại báo cáo</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tổng quan</SelectItem>
                <SelectItem value="mou">Văn bản MOU</SelectItem>
                <SelectItem value="students">Sinh viên quốc tế</SelectItem>
                <SelectItem value="delegations">Đoàn vào</SelectItem>
                <SelectItem value="translations">Dịch thuật</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Lọc kết quả
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Tổng MOU</p>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="mb-1">103</h2>
            <p className="text-sm text-muted-foreground">+21 so với năm ngoái</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Sinh viên</p>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="mb-1">145</h2>
            <p className="text-sm text-muted-foreground">Từ 24 quốc gia</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Đoàn vào</p>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="mb-1">67</h2>
            <p className="text-sm text-muted-foreground">Trong năm {selectedYear}</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">Xác nhận dịch</p>
              <PieChart className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="mb-1">89</h2>
            <p className="text-sm text-muted-foreground">Đã xác nhận</p>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MOU by Year */}
        <Card className="p-6">
          <h3 className="mb-4">Biểu Đồ MOU Theo Năm</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={mouByYearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* MOU by Type */}
        <Card className="p-6">
          <h3 className="mb-4">Phân Loại Văn Bản MOU</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={mouByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) =>
                    `${type} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mouByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Students by Country */}
        <Card className="p-6">
          <h3 className="mb-4">Sinh Viên Theo Quốc Gia</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={studentsByCountryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Top Partners Table */}
        <Card className="p-6">
          <h3 className="mb-4">Đối Tác Hàng Đầu</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đối tác</TableHead>
                  <TableHead className="text-center">MOU</TableHead>
                  <TableHead className="text-center">SV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPartners.map((partner, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p>{partner.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {partner.country}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{partner.mous}</TableCell>
                    <TableCell className="text-center">
                      {partner.students}
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
