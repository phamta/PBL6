# Hướng dẫn Tích hợp API Frontend - Backend

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cấu hình](#cấu-hình)
3. [Sử dụng API](#sử-dụng-api)
4. [Authentication](#authentication)
5. [Ví dụ thực tế](#ví-dụ-thực-tế)
6. [Best Practices](#best-practices)

---

## 🎯 Tổng quan

Hệ thống đã được tích hợp hoàn chỉnh giữa frontend (Next.js) và backend (NestJS) với các tính năng:

- ✅ Axios client với interceptors
- ✅ Automatic token refresh
- ✅ Global authentication state management
- ✅ Type-safe API calls
- ✅ Error handling
- ✅ CORS configuration

### Cấu trúc thư mục

```
frontend/src/
├── lib/
│   ├── config.ts              # API configuration
│   ├── types.ts               # TypeScript interfaces
│   ├── api.ts                 # Main axios client
│   └── api/
│       ├── index.ts           # Export tất cả API services
│       ├── auth.ts            # Authentication APIs
│       ├── documents.ts       # Document APIs
│       ├── guests.ts          # Guest APIs
│       └── visas.ts           # Visa APIs
├── contexts/
│   └── AuthContext.tsx        # Global auth state
└── components/
    ├── login/
    │   └── LoginPageWithAPI.tsx    # Login với API integration
    └── examples/
        └── APIUsageExamples.tsx    # Ví dụ sử dụng
```

---

## ⚙️ Cấu hình

### 1. Backend (.env)

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://user:password@localhost:5432/pbl6_htqt"

JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

### 2. Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Cài đặt dependencies

Frontend đã có sẵn `axios` trong package.json. Nếu chưa có, chạy:

```bash
cd frontend
npm install axios
```

---

## 🔧 Sử dụng API

### 1. Setup AuthProvider trong Layout

File `app/layout.tsx` đã được cập nhật:

```tsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Sử dụng Auth trong Components

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check authentication
  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }

  return (
    <div>
      <h1>Xin chào, {user?.fullName}</h1>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### 3. Gọi API

#### Cách 1: Import từ api services

```tsx
import * as documentsApi from "@/lib/api/documents";
import * as guestsApi from "@/lib/api/guests";

// Lấy danh sách documents
const response = await documentsApi.getDocuments({
  page: 1,
  limit: 10,
  search: "MOU",
});

// Tạo document mới
await documentsApi.createDocument({
  title: "MOU với ĐH ABC",
  documentNumber: "MOU-2025-001",
  documentType: "MOU",
  signDate: "2025-10-08",
});
```

#### Cách 2: Import default object

```tsx
import { documentsApi, guestsApi } from "@/lib/api";

const documents = await documentsApi.getDocuments();
const guests = await guestsApi.getGuests();
```

#### Cách 3: Sử dụng trực tiếp axios wrapper

```tsx
import { get, post, put, del } from "@/lib/api";

// GET request
const data = await get("/documents");

// POST request
await post("/documents", { title: "..." });

// PUT request
await put("/documents/123", { title: "..." });

// DELETE request
await del("/documents/123");
```

---

## 🔐 Authentication

### Login Flow

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Auto redirect được xử lý bởi AuthContext
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Protected Routes

#### Cách 1: Sử dụng HOC

```tsx
import { withAuth } from "@/contexts/AuthContext";

function AdminPage() {
  return <div>Admin Dashboard</div>;
}

// Chỉ SYSTEM_ADMIN mới truy cập được
export default withAuth(AdminPage, {
  requiredRoles: ["SYSTEM_ADMIN"],
  redirectTo: "/unauthorized",
});
```

#### Cách 2: Check trong component

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function StaffPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Staff Dashboard</div>;
}
```

### Token Management

Token được tự động quản lý bởi axios interceptors:

- Access token được lưu trong localStorage
- Tự động thêm vào header mỗi request
- Tự động refresh khi token hết hạn
- Tự động redirect về login nếu refresh failed

---

## 📚 Ví dụ thực tế

### 1. Fetch và hiển thị danh sách

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as documentsApi from "@/lib/api/documents";
import type { Document } from "@/lib/types";

export function DocumentsList() {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated, page]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsApi.getDocuments({ page, limit: 10 });
      if (response.success && response.data) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      {documents.map((doc) => (
        <div key={doc.id}>
          <h3>{doc.title}</h3>
          <p>{doc.documentNumber}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Form tạo mới

```tsx
"use client";

import { useState } from "react";
import * as documentsApi from "@/lib/api/documents";
import { toast } from "sonner";

export function CreateDocumentForm() {
  const [formData, setFormData] = useState({
    title: "",
    documentNumber: "",
    documentType: "MOU",
    signDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await documentsApi.createDocument(formData);

      if (response.success) {
        toast.success("Tạo văn bản thành công");
        // Reset form hoặc redirect
      }
    } catch (error: any) {
      toast.error("Lỗi", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tiêu đề"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Số văn bản"
        value={formData.documentNumber}
        onChange={(e) =>
          setFormData({ ...formData, documentNumber: e.target.value })
        }
      />
      <input
        type="date"
        value={formData.signDate}
        onChange={(e) => setFormData({ ...formData, signDate: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Đang tạo..." : "Tạo văn bản"}
      </button>
    </form>
  );
}
```

### 3. Upload file

```tsx
import { uploadFile } from "@/lib/api";

const handleFileUpload = async (file: File) => {
  try {
    const response = await uploadFile(
      "/documents/upload",
      file,
      { documentId: "123" } // Additional data
    );

    if (response.success) {
      toast.success("Upload thành công");
    }
  } catch (error) {
    toast.error("Upload thất bại");
  }
};
```

### 4. Search với debounce

```tsx
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce"; // Tự implement
import * as guestsApi from "@/lib/api/guests";

export function GuestSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchGuests(debouncedSearch);
    }
  }, [debouncedSearch]);

  const searchGuests = async (term: string) => {
    try {
      const response = await guestsApi.getGuests({ search: term });
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm khách..."
      />
      {/* Display results */}
    </div>
  );
}
```

---

## ✅ Best Practices

### 1. Error Handling

```tsx
try {
  const response = await documentsApi.getDocuments();
  if (response.success) {
    // Handle success
  }
} catch (error: any) {
  // Error đã được xử lý bởi interceptor
  // Có thể hiển thị thêm thông báo
  toast.error("Có lỗi xảy ra", {
    description: error.message,
  });
}
```

### 2. Loading States

```tsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    await api.getData();
  } finally {
    setLoading(false); // Luôn reset loading
  }
};
```

### 3. Type Safety

```tsx
import type { Document, ApiResponse } from "@/lib/types";

const [documents, setDocuments] = useState<Document[]>([]);

const response: ApiResponse<Document[]> = await documentsApi.getDocuments();
```

### 4. Reusable Hooks

```tsx
// hooks/useDocuments.ts
export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async (params?: SearchParams) => {
    setLoading(true);
    try {
      const response = await documentsApi.getDocuments(params);
      if (response.success) {
        setDocuments(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return { documents, loading, fetchDocuments };
}

// Sử dụng
const { documents, loading, fetchDocuments } = useDocuments();
```

### 5. Optimistic Updates

```tsx
const deleteDocument = async (id: string) => {
  // Optimistically remove from UI
  setDocuments((docs) => docs.filter((d) => d.id !== id));

  try {
    await documentsApi.deleteDocument(id);
    toast.success("Xóa thành công");
  } catch (error) {
    // Rollback on error
    fetchDocuments(); // Re-fetch
    toast.error("Xóa thất bại");
  }
};
```

---

## 🚀 Khởi động

### 1. Backend

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3001`
API Docs: `http://localhost:3001/api/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Test API

Mở browser console và test:

```javascript
// Test API connection
fetch("http://localhost:3001/api/v1/auth/me", {
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
  },
});
```

---

## 🐛 Troubleshooting

### CORS Error

Đảm bảo backend có cấu hình CORS đúng trong `main.ts`:

```typescript
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true,
});
```

### Token không tự động refresh

Kiểm tra:

1. Backend có endpoint `/auth/refresh`
2. Refresh token được lưu trong localStorage
3. Response từ `/auth/refresh` có đúng format

### TypeScript Errors

Chạy:

```bash
npm run build
```

Để kiểm tra lỗi TypeScript.

---

## 📞 Hỗ trợ

- Backend API Docs: `http://localhost:3001/api/docs`
- GitHub Issues: [Repository link]
- Email: international@dut.udn.vn

---

**Chúc bạn code vui vẻ! 🎉**
