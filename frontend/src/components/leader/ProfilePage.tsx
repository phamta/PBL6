"use client";

import React, { useState } from "react";
import { UserCircle, Mail, Lock, Bell, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Breadcrumbs } from "../Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "motion/react";
import { Switch } from "../ui/switch";

export function LeaderProfilePage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [reportNotif, setReportNotif] = useState(true);
  const [approvalNotif, setApprovalNotif] = useState(true);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Hồ sơ lãnh đạo" }]} />

      {/* Header */}
      <div>
        <h1>Hồ Sơ Lãnh Đạo</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý hồ sơ cá nhân và thiết lập nhận thông báo quan trọng
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Thông tin</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-primary" />
                  </div>
                  <div>
                    <h3>Trần Thị B</h3>
                    <p className="text-muted-foreground">
                      Trưởng phòng Khoa học và Đối Ngoại
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Thay đổi ảnh đại diện
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full-name">Họ và tên *</Label>
                    <Input id="full-name" defaultValue="Trần Thị B" className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="employee-id">Mã lãnh đạo</Label>
                    <Input
                      id="employee-id"
                      defaultValue="LD2025001"
                      className="mt-2"
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="ttb@dut.udn.vn"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" defaultValue="0236 3736 888" className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="department">Đơn vị</Label>
                    <Input
                      id="department"
                      defaultValue="Phòng Khoa học và Đối Ngoại"
                      className="mt-2"
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Chức vụ</Label>
                    <Input id="position" defaultValue="Trưởng phòng" className="mt-2" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Hủy</Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Đổi Mật Khẩu
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Cập nhật mật khẩu để tăng cường bảo mật tài khoản lãnh đạo
                  </p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="current-password">Mật khẩu hiện tại *</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="mt-2"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới *</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="mt-2"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="mt-2"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Hủy</Button>
                  <Button>
                    <Lock className="w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Cài Đặt Thông Báo
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Quản lý các loại thông báo bạn muốn nhận
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div>
                      <p>Thông báo qua Email</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo quan trọng về hoạt động trong đơn vị
                      </p>
                    </div>
                    <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div>
                      <p>Báo cáo và thống kê</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo khi có báo cáo định kỳ hoặc dữ liệu tổng hợp mới
                      </p>
                    </div>
                    <Switch checked={reportNotif} onCheckedChange={setReportNotif} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div>
                      <p>Phê duyệt đề xuất</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo khi có đề xuất cần phê duyệt
                      </p>
                    </div>
                    <Switch checked={approvalNotif} onCheckedChange={setApprovalNotif} />
                  </div>

                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="mb-1 text-blue-900 dark:text-blue-100">
                          Email thông báo
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Các thông báo sẽ được gửi đến: ttb@dut.udn.vn
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Hủy</Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
