"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { GraduationCap, Users, Shield } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <GraduationCap className="w-20 h-20 text-primary" />
          </div>
          <h1 className="mb-4">
            Hệ thống Quản lý Phòng Khoa học và Đối Ngoại
          </h1>
          <p className="text-xl text-muted-foreground">
            Đại học Bách Khoa Đà Nẵng
          </p>
        </motion.div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card 
              className="p-8 cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-primary"
              onClick={() => router.push("/admin")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h2 className="mb-2">Admin</h2>
                <p className="text-muted-foreground mb-6">
                  Quản trị hệ thống, phê duyệt và giám sát toàn bộ hoạt động
                </p>
                <Button className="w-full bg-primary">
                  Đăng nhập Admin
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Staff Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card 
              className="p-8 cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-secondary"
              onClick={() => router.push("/staff")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="mb-2">Faculty/Staff</h2>
                <p className="text-muted-foreground mb-6">
                  Cán bộ đơn vị quản lý văn bản, đoàn vào, sinh viên quốc tế
                </p>
                <Button className="w-full bg-secondary">
                  Đăng nhập Staff
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="mb-8">Tính năng chính</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6">
              <h4 className="mb-2">📄 Quản lý văn bản MOU</h4>
              <p className="text-sm text-muted-foreground">
                Đề xuất, theo dõi và quản lý các thỏa thuận hợp tác quốc tế
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="mb-2">✈️ Khai báo đoàn vào</h4>
              <p className="text-sm text-muted-foreground">
                Đăng ký và quản lý các đoàn khách quốc tế đến thăm trường
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="mb-2">🌍 Sinh viên quốc tế</h4>
              <p className="text-sm text-muted-foreground">
                Quản lý hồ sơ, visa và gia hạn cho sinh viên nước ngoài
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}