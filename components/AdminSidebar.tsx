import { useState } from "react";
import {
  Home,
  FileText,
  Users,
  Globe,
  Languages,
  BarChart3,
  UserCog,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "documents", label: "Signed Document Management", icon: FileText },
  { id: "delegations", label: "Incoming Delegation Management", icon: Users },
  {
    id: "international",
    label: "International Students/Trainees/Lecturers",
    icon: Globe,
  },
  { id: "translations", label: "Translation Confirmation Requests", icon: Languages },
  { id: "statistics", label: "Automatic Statistics & Reports", icon: BarChart3 },
  { id: "users", label: "User Management", icon: UserCog },
  { id: "roles", label: "Role & Permission Management", icon: Shield },
];

export function AdminSidebar({ currentPage, onNavigate }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white">AD</span>
            </div>
            <span className="text-sidebar-foreground">Admin Dashboard</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white">AD</span>
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
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
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