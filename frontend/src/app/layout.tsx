import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Hợp tác Quốc tế - ĐH Bách khoa Đà Nẵng",
  description: "Nền tảng quản lý thông minh giúp tối ưu hóa quy trình làm việc, tiết kiệm thời gian và nâng cao hiệu quả công tác hợp tác quốc tế tại Đại học Bách khoa Đà Nẵng.",
  keywords: ["DUT", "Đại học Bách khoa Đà Nẵng", "Hợp tác quốc tế", "Quản lý văn bản", "MOU", "MOA"],
  authors: [{ name: "Đại học Bách khoa Đà Nẵng" }],
  openGraph: {
    title: "Hệ thống Quản lý Hợp tác Quốc tế - ĐH Bách khoa Đà Nẵng",
    description: "Nền tảng quản lý thông minh cho công tác hợp tác quốc tế",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}