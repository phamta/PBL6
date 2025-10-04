import { Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "motion/react";

interface StaffTopbarProps {
  userName?: string;
  userEmail?: string;
  department?: string;
}

export function StaffTopbar({ 
  userName = "Nguyễn Văn A",
  userEmail = "nva@dut.udn.vn",
  department = "Phòng Khoa học và Đối Ngoại"
}: StaffTopbarProps) {
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Left: System Name */}
      <div className="flex items-center gap-4">
        <div>
          <h4 className="text-primary">Hệ Thống Quản Lý</h4>
          <p className="text-sm text-muted-foreground">{department}</p>
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications & User */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông Báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-3">
              <div className="flex flex-col gap-1">
                <p>Đề xuất MOU đã được phê duyệt</p>
                <span className="text-muted-foreground">10 phút trước</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3">
              <div className="flex flex-col gap-1">
                <p>Visa sinh viên sắp hết hạn - 3 trường hợp</p>
                <span className="text-muted-foreground">1 giờ trước</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài Khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ Sơ Cá Nhân</DropdownMenuItem>
            <DropdownMenuItem>Đổi Mật Khẩu</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng Xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}