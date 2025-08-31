import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HTQT - Hệ thống Quản lý Hợp tác Quốc tế | Trường ĐH Bách Khoa Đà Nẵng',
  description: 'Hệ thống quản lý hợp tác quốc tế, visa, MOU, dịch thuật và khách thăm - Trường Đại học Bách Khoa Đà Nẵng',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
