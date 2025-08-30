import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PBL6 - Hệ thống Quản lý Hợp tác Quốc tế',
  description: 'Hệ thống quản lý visa, MOU, dịch thuật và khách thăm quốc tế',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
