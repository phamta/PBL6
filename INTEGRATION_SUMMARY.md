# 🚀 Tích hợp Frontend - Backend API

## ✅ Đã hoàn thành

Hệ thống đã được tích hợp hoàn chỉnh giữa frontend (Next.js) và backend (NestJS) với các tính năng sau:

### 📦 Files đã tạo

#### 1. **Core API Infrastructure**

- ✅ `lib/config.ts` - Cấu hình API endpoints và constants
- ✅ `lib/types.ts` - TypeScript interfaces cho tất cả data models
- ✅ `lib/api.ts` - Main axios client với interceptors

#### 2. **API Services**

- ✅ `lib/api/auth.ts` - Authentication APIs (login, register, logout, etc.)
- ✅ `lib/api/documents.ts` - Document management APIs
- ✅ `lib/api/guests.ts` - Guest management APIs
- ✅ `lib/api/visas.ts` - Visa management APIs
- ✅ `lib/api/index.ts` - Export tất cả services

#### 3. **State Management**

- ✅ `contexts/AuthContext.tsx` - Global authentication context với:
  - Login/Logout functionality
  - User state management
  - Protected routes HOC
  - Auto token refresh

#### 4. **Components & Examples**

- ✅ `components/login/LoginPageWithAPI.tsx` - Login form tích hợp API
- ✅ `components/examples/APIUsageExamples.tsx` - 5 ví dụ sử dụng API thực tế

#### 5. **Configuration Files**

- ✅ `backend/.env.example` - Backend environment template
- ✅ `frontend/.env.example` - Frontend environment template

#### 6. **Documentation**

- ✅ `frontend/API_INTEGRATION_GUIDE.md` - Hướng dẫn chi tiết 100+ dòng

#### 7. **Layout Update**

- ✅ `app/layout.tsx` - Đã tích hợp AuthProvider

---

## 🎯 Tính năng chính

### 1. **Automatic Token Management**

- Tự động thêm JWT token vào mọi request
- Tự động refresh token khi hết hạn
- Tự động redirect về login nếu token invalid

### 2. **Type-Safe API Calls**

```typescript
import * as documentsApi from "@/lib/api/documents";
import type { Document } from "@/lib/types";

const response = await documentsApi.getDocuments({ page: 1, limit: 10 });
// response có type ApiResponse<Document[]>
```

### 3. **Global Auth State**

```tsx
import { useAuth } from "@/contexts/AuthContext";

const { user, isAuthenticated, login, logout } = useAuth();
```

### 4. **Error Handling**

- Centralized error handling trong axios interceptors
- Toast notifications cho errors
- Proper error messages từ backend

### 5. **CORS Support**

Backend đã cấu hình CORS cho frontend:

```typescript
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true,
});
```

---

## 📚 Cách sử dụng

### 1. Đăng nhập

```tsx
import { useAuth } from "@/contexts/AuthContext";

function LoginComponent() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: "user@example.com", password: "password" });
      // Auto redirect theo role
    } catch (error) {
      console.error(error);
    }
  };
}
```

### 2. Fetch dữ liệu

```tsx
import * as documentsApi from "@/lib/api/documents";

const documents = await documentsApi.getDocuments({
  page: 1,
  limit: 10,
  search: "MOU",
});
```

### 3. Create dữ liệu

```tsx
await documentsApi.createDocument({
  title: "MOU với ĐH ABC",
  documentNumber: "MOU-2025-001",
  documentType: "MOU",
  signDate: "2025-10-08",
});
```

### 4. Protected Routes

```tsx
import { withAuth } from "@/contexts/AuthContext";

function AdminPage() {
  return <div>Admin Only</div>;
}

export default withAuth(AdminPage, {
  requiredRoles: ["SYSTEM_ADMIN"],
});
```

---

## 🔧 Setup & Cài đặt

### 1. Backend

```bash
cd backend

# Copy và cấu hình .env
cp .env.example .env
# Sửa DATABASE_URL, JWT_SECRET, FRONTEND_URL

# Install dependencies
npm install

# Setup database
npm run prisma:migrate
npm run prisma:seed

# Start server
npm run start:dev
```

Backend chạy tại: `http://localhost:3001`

### 2. Frontend

```bash
cd frontend

# Copy và cấu hình .env.local
cp .env.example .env.local
# Sửa NEXT_PUBLIC_API_URL nếu cần

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

---

## 📖 Tài liệu chi tiết

Xem file **[API_INTEGRATION_GUIDE.md](./frontend/API_INTEGRATION_GUIDE.md)** cho:

- Hướng dẫn chi tiết từng bước
- Ví dụ code đầy đủ
- Best practices
- Troubleshooting
- API endpoints

---

## 🔑 API Endpoints

Backend cung cấp các endpoints chính:

### Authentication

- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/logout` - Đăng xuất
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Lấy thông tin user
- `PUT /api/v1/auth/me` - Cập nhật profile
- `PUT /api/v1/auth/change-password` - Đổi mật khẩu

### Documents

- `GET /api/v1/documents` - Danh sách documents
- `GET /api/v1/documents/:id` - Chi tiết document
- `POST /api/v1/documents` - Tạo document
- `PUT /api/v1/documents/:id` - Cập nhật document
- `DELETE /api/v1/documents/:id` - Xóa document
- `POST /api/v1/documents/:id/approve` - Phê duyệt
- `POST /api/v1/documents/:id/reject` - Từ chối

### Guests

- `GET /api/v1/guests` - Danh sách guests
- `GET /api/v1/guests/:id` - Chi tiết guest
- `POST /api/v1/guests` - Tạo guest
- `PUT /api/v1/guests/:id` - Cập nhật guest
- `DELETE /api/v1/guests/:id` - Xóa guest

### Visas

- `GET /api/v1/visas` - Danh sách visas
- `GET /api/v1/visas/:id` - Chi tiết visa
- `POST /api/v1/visas` - Tạo visa
- `PUT /api/v1/visas/:id` - Cập nhật visa
- `DELETE /api/v1/visas/:id` - Xóa visa
- `POST /api/v1/visas/:id/approve` - Phê duyệt
- `POST /api/v1/visas/:id/reject` - Từ chối
- `POST /api/v1/visas/:id/extend` - Gia hạn

**Xem đầy đủ tại:** `http://localhost:3001/api/docs` (Swagger UI)

---

## 💡 Ví dụ sử dụng

### Example 1: Hiển thị danh sách

Xem: `components/examples/APIUsageExamples.tsx` → `DocumentsListExample`

### Example 2: Form tạo mới

Xem: `components/examples/APIUsageExamples.tsx` → `CreateDocumentExample`

### Example 3: Tìm kiếm

Xem: `components/examples/APIUsageExamples.tsx` → `SearchGuestsExample`

### Example 4: User Profile

Xem: `components/examples/APIUsageExamples.tsx` → `UserProfileExample`

### Example 5: Protected Component

Xem: `components/examples/APIUsageExamples.tsx` → `AdminOnlyExample`

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **HTTP Client:** Axios
- **State Management:** React Context API
- **UI:** Radix UI + Tailwind CSS
- **Notifications:** Sonner
- **TypeScript:** Full type safety

### Backend

- **Framework:** NestJS
- **Database:** PostgreSQL + Prisma
- **Authentication:** JWT (Access + Refresh tokens)
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator

---

## 🔐 Security Features

- ✅ JWT Authentication với access & refresh tokens
- ✅ Automatic token refresh
- ✅ CORS protection
- ✅ Input validation
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (RBAC)
- ✅ Activity logging

---

## 📝 Best Practices được áp dụng

1. **Separation of Concerns** - API logic tách biệt khỏi UI
2. **Type Safety** - TypeScript interfaces cho tất cả data
3. **Error Handling** - Centralized error handling
4. **Code Reusability** - Reusable API services & hooks
5. **Security** - Token management, CORS, validation
6. **Developer Experience** - Clear documentation & examples

---

## 🐛 Troubleshooting

### CORS Error?

Kiểm tra `FRONTEND_URL` trong backend `.env`

### Token không tự động refresh?

Kiểm tra backend có endpoint `/api/v1/auth/refresh`

### TypeScript errors?

Chạy `npm run build` để check errors

### API không kết nối được?

1. Kiểm tra backend đang chạy: `http://localhost:3001`
2. Kiểm tra `NEXT_PUBLIC_API_URL` trong frontend `.env.local`
3. Check CORS settings

---

## 📞 Hỗ trợ

- **API Documentation:** http://localhost:3001/api/docs
- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:3000
- **Email:** international@dut.udn.vn

---

## 🎉 Kết luận

Hệ thống đã sẵn sàng để sử dụng! Bạn có thể:

1. ✅ Đăng nhập/đăng ký user
2. ✅ Gọi API với type safety
3. ✅ Quản lý authentication state globally
4. ✅ Tạo protected routes
5. ✅ Sử dụng các API services có sẵn
6. ✅ Tham khảo examples để tích hợp vào components

**Happy coding! 🚀**
