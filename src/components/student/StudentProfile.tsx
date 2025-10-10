"use clent";

import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Breadcrumbs } from "../Breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserCircle, Save } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
} from "../ui/select";

export function StudentProfile() {
  return (
    <div className="space-y-6">
      

      {/* Header */}
      <div>
        <h1>Hồ Sơ Cá Nhân</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý thông tin tài khoản và cài đặt thông báo
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Avatar + Basic Info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h3>Nguyễn Văn B</h3>
              <p className="text-muted-foreground">Sinh viên quốc tế</p>
              <Button size="sm" variant="outline" className="mt-2">
                Thay đổi ảnh đại diện
              </Button>
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full-name">Họ và tên *</Label>
              <Input
                id="full-name"
                defaultValue="Nguyễn Văn B"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="dob">Ngày sinh *</Label>
              <Input id="dob" type="date" className="mt-2" required />
            </div>
            <div>
              <Label htmlFor="nationality">Quốc tịch *</Label>
              <Input
                id="nationality"
                defaultValue="Việt Nam"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="passport">Số hộ chiếu *</Label>
              <Input id="passport" className="mt-2" required />
            </div>
            <div>
              <Label htmlFor="visa-type">Loại visa hiện tại</Label>
              <Select>
                <SelectTrigger className="mt-2" id="visa-type">
                  <SelectValue placeholder="Chọn loại visa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DN">DN</SelectItem>
                  <SelectItem value="TT">TT</SelectItem>
                  <SelectItem value="ĐT">ĐT</SelectItem>
                  <SelectItem value="LS">LS</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="visa-number">Số visa & thời hạn hết hạn *</Label>
              <Input
                id="visa-number"
                placeholder="Số visa - Hạn"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="last-entry">Ngày nhập cảnh gần nhất</Label>
              <Input id="last-entry" type="date" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="visa-code">Mã số thị thực (nếu có)</Label>
              <Input id="visa-code" className="mt-2" />
            </div>
          </div>

          {/* Thông tin học tập */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="program">Chương trình học</Label>
              <Select>
                <SelectTrigger className="mt-2" id="program">
                  <SelectValue placeholder="Chọn chương trình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đại học">Đại học</SelectItem>
                  <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                  <SelectItem value="Nghiên cứu sinh">
                    Nghiên cứu sinh
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="faculty">Khoa / Phòng tiếp nhận</Label>
              <Select>
                <SelectTrigger className="mt-2" id="faculty">
                  <SelectValue placeholder="Chọn khoa/phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNTT">Khoa CNTT</SelectItem>
                  <SelectItem value="Điện">Khoa Điện</SelectItem>
                  <SelectItem value="Cơ khí">Khoa Cơ khí</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="faculty-manager">Người phụ trách khoa</Label>
              <Input
                id="faculty-manager"
                placeholder="Tên người phụ trách"
                className="mt-2"
              />
              <Input
                id="faculty-manager-email"
                type="email"
                placeholder="Email"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="start-date">Ngày bắt đầu học *</Label>
              <Input id="start-date" type="date" className="mt-2" required />
            </div>
            <div>
              <Label htmlFor="end-date">Ngày kết thúc dự kiến</Label>
              <Input id="end-date" type="date" className="mt-2" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Hủy</Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
