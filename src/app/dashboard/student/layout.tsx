"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentTopbar } from "@/components/student/StudentTopbar";
//import { StudentTopbar } from "@/components/student/StudentTopbar"; // Nếu chưa có, có thể bỏ dòng này
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentPage = () => {
    if (!pathname) return "dashboard";
    if (pathname === "/dashboard/student" || pathname === "/dashboard/student/") return "dashboard";
    return pathname.replace(/^\/dashboard\/student\/?/, "").replace(/^\/+/, "");
  };

  const handleNavigate = (page: string) => {
    const base = "/dashboard/student";
    if (page === "dashboard") {
      router.push(base);
    } else {
      router.push(`${base}/${page}`);
    }
  };

  // Nếu muốn có nút chuyển sang role khác, có thể thêm vào
  // const switchToOtherRole = () => { ... };

  return (
    
    <div className="flex h-screen bg-background overflow-hidden">
      <motion.div
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <StudentSidebar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      </motion.div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <StudentTopbar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/30 border-b border-border px-6 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Role:</span>
            <Badge variant="default">Student</Badge>
          </div>
          {/* Có thể bỏ nút chuyển role nếu không cần */}
        </motion.div>

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