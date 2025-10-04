import { useState } from "react";
import {
  Home,
  FileText,
  Users,
  GraduationCap,
  Languages,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface StaffSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Tổng Quan", icon: Home },
  { id: "document-management", label: "Quản Lý Văn Bản MOU", icon: FileText },
  { id: "delegation-management", label: "Khai Báo Đoàn Vào", icon: Users },
  {
    id: "international-members",
    label: "Sinh Viên Quốc Tế",
    icon: GraduationCap,
  },
  { id: "translation-confirmation", label: "Xác Nhận Dịch Thuật", icon: Languages },
  { id: "reports", label: "Báo Cáo & Thống Kê", icon: BarChart3 },
  { id: "profile", label: "Hồ Sơ Cá Nhân", icon: UserCircle },
];

export function StaffSidebar({ currentPage, onNavigate }: StaffSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-sidebar-border bg-sidebar">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-primary text-xl">🎓</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sidebar-foreground text-sm">ĐH Bách Khoa</span>
              <span className="text-sidebar-foreground/80 text-xs">Đà Nẵng</span>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto shadow-lg">
            <span className="text-primary text-xl">🎓</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <motion.button
                  whileHover={{ x: collapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:shadow-md"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full text-sidebar-foreground hover:bg-sidebar-accent ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </div>
  );
}