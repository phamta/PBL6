"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AdminSidebar } from "@/components/officer/OfficerSidebar";
import { AdminTopbar } from "@/components/officer/OfficerTopbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleCode } from "@/lib/auth/roles";
import { useRole } from "@/hooks/useRole";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { primaryRoleName } = useRole();
  
  const getCurrentPage = () => {
    if (!pathname) return "home";
    // normalize exact admin root
    if (pathname === "/dashboard/admin" || pathname === "/dashboard/admin/") return "home";
    // remove the prefix "/dashboard/admin/" if present
    return pathname.replace(/^\/dashboard\/admin\/?/, "").replace(/^\/+/, "");
  };

  const handleNavigate = (page: string) => {
    const base = "/dashboard/admin";
    if (page === "home") {
      router.push(base);
    } else {
      router.push(`${base}/${page}`);
    }
  };


  return (
    <ProtectedRoute allowedRoles={[RoleCode.SYSTEM_ADMIN]}>
      <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar with animation */}
      <motion.div
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AdminSidebar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AdminTopbar />
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
            <Badge variant="default">{primaryRoleName}</Badge>
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