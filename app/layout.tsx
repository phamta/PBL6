import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Phòng KHĐN - ĐH Bách Khoa Đà Nẵng",
  description: "Hệ thống quản lý hợp tác quốc tế và đối ngoại",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}