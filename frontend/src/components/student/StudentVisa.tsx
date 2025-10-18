"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { FileText, Clock, Info, Download, ExternalLink } from "lucide-react";

export default function StudentVisa() {
  return (
    <div className="p-6 grid gap-6 md:grid-cols-3 bg-muted/30 min-h-screen">
      {/* Tình trạng visa */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" /> Tình trạng Visa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">Còn <span className="font-semibold text-orange-500">15 ngày</span></p>
          <Progress value={75} className="mb-4" />
          <div className="flex gap-3">
            <Button variant="outline">Chi tiết</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Gia hạn ngay</Button>
          </div>
        </CardContent>
      </Card>

      {/* Thao tác nhanh */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" /> Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <QuickAction icon={<FileText />} text="Gia hạn visa" action="Nộp đơn" />
          <QuickAction icon={<Download />} text="Tải giấy tờ liên quan" action="Tải xuống" />
          <QuickAction icon={<ExternalLink />} text="Hướng dẫn gia hạn" action="Xem hướng dẫn" variant="outline" />
        </CardContent>
      </Card>

      {/* Thông tin Visa */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-green-500" /> Thông tin Visa
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <VisaInfo label="Số visa" value="VN2023123456" />
          <VisaInfo label="Loại visa" value="DH - Du học" />
          <VisaInfo label="Số lần nhập cảnh" value="Nhiều lần" />
          <VisaInfo label="Thời hạn" value="6 tháng" />
          <VisaInfo label="Nơi cấp" value="Đại sứ quán Việt Nam tại Washington" />
        </CardContent>
      </Card>

      {/* Đơn đang xử lý */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" /> Đơn đang xử lý
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-2">Đơn xin gia hạn visa <Badge variant="secondary">Đang xử lý</Badge></div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>01/08/2023</span>
            <span>25/08/2023</span>
          </div>
          <Progress value={60} className="my-2" />
          <p className="text-xs text-muted-foreground mb-3">Đang xử lý tại khoa (60%)</p>
          <div className="flex gap-2">
            <Button variant="outline">Xem chi tiết</Button>
            <Button variant="destructive">Hủy đơn</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lịch sử Visa */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Lịch sử Visa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <VisaHistory title="Visa Du học DH" date="15/03/2023 - 15/09/2023" status="Đã hết hạn" color="bg-red-100 text-red-600" />
          <VisaHistory title="Visa Du học DH" date="15/09/2022 - 15/03/2023" status="Đã hoàn thành" color="bg-green-100 text-green-600" />
          <VisaHistory title="Visa Du học DH" date="15/03/2022 - 15/09/2022" status="Đã hoàn thành" color="bg-green-100 text-green-600" />
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Component phụ ----
function QuickAction({ icon, text, action, variant }: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-blue-600">{icon}</span>
        {text}
      </div>
      <Button size="sm" variant={variant || "outline"}>{action}</Button>
    </div>
  );
}

function VisaInfo({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function VisaHistory({ title, date, status, color }: any) {
  return (
    <div className="flex justify-between items-center border rounded-lg p-3 bg-white shadow-sm">
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
    </div>
  );
}