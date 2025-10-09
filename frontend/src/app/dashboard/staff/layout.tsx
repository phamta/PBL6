"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StaffSidebar } from "@/components/staff/StaffSidebar";
import { StaffTopbar } from "@/components/staff/StaffTopbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleCode } from "@/lib/auth/roles";
import { useRole } from "@/hooks/useRole";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { primaryRoleName } = useRole();
  

  const getCurrentPage = () => {
    if (!pathname) return "dashboard";
    // normalize exact staff root
    if (pathname === "/dashboard/staff" || pathname === "/dashboard/staff/") return "dashboard";
    // remove the prefix "/dashboard/staff/" if present
    const page = pathname.replace(/^\/dashboard\/staff\/?/, "").replace(/^\/+/, "");

    // map url segments to internal page keys
    if (page === "documents") return "document-management";
    if (page === "delegations") return "delegation-management";
    if (page === "international") return "international-members";
    if (page === "visa") return "visa-management";
    if (page === "translations") return "translation-confirmation";
    return page || "dashboard";
  };

  const handleNavigate = (page: string) => {
    const urlMap: Record<string, string> = {
      "dashboard": "",
      "document-management": "documents",
      "delegation-management": "delegations",
      "international-members": "international",
      "visa-management": "visa",
      "translation-confirmation": "translations",
      "reports": "reports",
      "profile": "profile",
    };
    const url = urlMap[page] ?? page;
    const base = "/dashboard/staff";
    if (!url) {
      router.push(base);
    } else {
      router.push(`${base}/${url}`);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[
      RoleCode.DEPARTMENT_OFFICER,
      RoleCode.LEADERSHIP,
      RoleCode.FACULTY_STAFF,
      RoleCode.SYSTEM_ADMIN, // Admin cũng có thể access staff dashboard
    ]}>
      <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar with animation */}
      <motion.div
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <StaffSidebar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <StaffTopbar />
        </motion.div>

        {/* Role Switcher - Demo Purpose */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/30 border-b border-border px-6 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Role:</span>
            <Badge variant="secondary">{primaryRoleName}</Badge>
          </div>

        </motion.div>

        {/* Page Content with transitions */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}