"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StaffSidebar } from "../../components/StaffSidebar";
import { StaffTopbar } from "../../components/StaffTopbar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { usePathname, useRouter } from "next/navigation";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  const getCurrentPage = () => {
    if (pathname === "/staff") return "dashboard";
    const page = pathname.replace("/staff/", "");
    // Convert URL format to internal page names
    if (page === "documents") return "document-management";
    if (page === "delegations") return "delegation-management";
    if (page === "international") return "international-members";
    if (page === "visa") return "visa-management";
    if (page === "translations") return "translation-confirmation";
    return page;
  };

  const handleNavigate = (page: string) => {
    // Convert internal page names to URL format
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
    
    const url = urlMap[page] || page;
    if (url === "") {
      router.push("/staff");
    } else {
      router.push(`/staff/${url}`);
    }
  };

  const switchToAdmin = () => {
    router.push("/admin");
  };

  return (
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
            <Badge variant="secondary">Faculty/Staff</Badge>
          </div>
          <Button size="sm" variant="outline" onClick={switchToAdmin}>
            Chuyển sang Admin View
          </Button>
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
  );
}