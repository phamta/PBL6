# ⚡ Quick Start - API Integration

## 🚀 5 phút để bắt đầu

### Bước 1: Cấu hình Environment Variables

#### Backend (`backend/.env`)

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/pbl6_htqt"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Bước 2: Khởi động Backend

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

✅ Backend running at: http://localhost:3001
📚 API Docs: http://localhost:3001/api/docs

### Bước 3: Khởi động Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: http://localhost:3000

---

## 📖 Sử dụng ngay

### 1. Import API service

```tsx
import * as documentsApi from "@/lib/api/documents";
import { useAuth } from "@/contexts/AuthContext";
```

### 2. Gọi API trong component

```tsx
"use client";

import { useEffect, useState } from "react";
import * as documentsApi from "@/lib/api/documents";

export function MyComponent() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    documentsApi.getDocuments({ page: 1, limit: 10 }).then((response) => {
      if (response.success) {
        setDocuments(response.data);
      }
    });
  }, []);

  return (
    <div>
      {documents.map((doc) => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  );
}
```

### 3. Sử dụng Authentication

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function LoginButton() {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    login({
      email: "user@example.com",
      password: "password",
    });
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      Đăng nhập
    </button>
  );
}
```

---

## 📝 API Services có sẵn

### Auth

```tsx
import * as authApi from "@/lib/api/auth";

await authApi.login({ email, password });
await authApi.register({ email, password, fullName });
await authApi.getCurrentUser();
await authApi.logout();
```

### Documents

```tsx
import * as documentsApi from "@/lib/api/documents";

await documentsApi.getDocuments();
await documentsApi.createDocument(data);
await documentsApi.updateDocument(id, data);
await documentsApi.deleteDocument(id);
```

### Guests

```tsx
import * as guestsApi from "@/lib/api/guests";

await guestsApi.getGuests();
await guestsApi.createGuest(data);
await guestsApi.searchGuestByPassport(passportNumber);
```

### Visas

```tsx
import * as visasApi from "@/lib/api/visas";

await visasApi.getVisas();
await visasApi.createVisa(data);
await visasApi.approveVisa(id);
await visasApi.extendVisa(id, newExpiryDate);
```

---

## 🔐 Protected Routes

```tsx
import { withAuth } from "@/contexts/AuthContext";

function AdminPage() {
  return <div>Admin Dashboard</div>;
}

// Chỉ admin mới access được
export default withAuth(AdminPage, {
  requiredRoles: ["SYSTEM_ADMIN"],
});
```

---

## 💡 Tips

1. **Auto token refresh:** Không cần lo lắng về token expiry
2. **Type safety:** Sử dụng TypeScript interfaces từ `@/lib/types`
3. **Error handling:** Errors tự động handled bởi interceptors
4. **Loading states:** Sử dụng `isLoading` từ `useAuth` hook

---

## 📚 Tài liệu đầy đủ

- [API Integration Guide](./frontend/API_INTEGRATION_GUIDE.md) - Hướng dẫn chi tiết
- [Integration Summary](./INTEGRATION_SUMMARY.md) - Tổng quan
- [API Docs](http://localhost:3001/api/docs) - Swagger UI

---

**Sẵn sàng code! 🎉**
