# API Integration Guide - Frontend

## Tổng quan

Hệ thống đã được tích hợp đầy đủ với Backend API sử dụng:
- **Axios** cho HTTP requests
- **JWT Authentication** với auto-refresh token
- **React Context** cho state management
- **TypeScript** cho type safety

## Cấu trúc thư mục

```
src/
├── lib/api/
│   ├── config.ts          # API configuration và endpoints
│   ├── axios.ts           # Axios client với interceptors
│   ├── types.ts           # TypeScript types
│   ├── auth.service.ts    # Authentication service
│   ├── user.service.ts    # User management service
│   ├── unit.service.ts    # Unit management service
│   └── index.ts           # Export tất cả services
├── contexts/
│   └── AuthContext.tsx    # Authentication context
└── components/
    └── login/
        └── LoginPage.tsx  # Login component đã tích hợp API
```

## Environment Variables

Tạo file `.env.local` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_API_DOCS=http://localhost:3001/api/docs
```

## 1. Authentication

### Login

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginComponent() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@dntu.edu.vn', 'password123');
      // Tự động redirect to /dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

### Logout

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Tự động redirect to /login
  };
}
```

### Get Current User

```tsx
import { useAuth } from '@/contexts/AuthContext';

function ProfileComponent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.fullName}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

## 2. API Services

### Auth Service

```tsx
import { authService } from '@/lib/api';

// Login
const response = await authService.login({
  email: 'user@dntu.edu.vn',
  password: 'password123'
});

// Register
const response = await authService.register({
  email: 'newuser@dntu.edu.vn',
  password: 'password123',
  fullName: 'Nguyễn Văn A',
  unitId: 'unit-id'
});

// Get current user
const user = await authService.getCurrentUser();

// Update profile
const updatedUser = await authService.updateProfile({
  fullName: 'Nguyễn Văn B',
  phoneNumber: '0123456789'
});

// Change password
await authService.changePassword({
  currentPassword: 'oldpass',
  newPassword: 'newpass',
  confirmPassword: 'newpass'
});
```

### User Service

```tsx
import { userService } from '@/lib/api';

// Get users list with pagination
const result = await userService.getUsers({
  page: 1,
  limit: 10,
  search: 'nguyen',
  isActive: true
});
console.log(result.data); // User[]
console.log(result.pagination); // { total, page, limit, totalPages }

// Get user by ID
const user = await userService.getUserById('user-id');

// Search users
const searchResult = await userService.searchUsers('nguyen van', 1, 10);

// Get user statistics
const stats = await userService.getUserStats();

// Toggle user status
const response = await userService.toggleUserStatus('user-id');

// Delete user
await userService.deleteUser('user-id');
```

### Unit Service

```tsx
import { unitService } from '@/lib/api';

// Get units list
const result = await unitService.getUnits({
  page: 1,
  limit: 10,
  includeChildren: true
});

// Get unit by ID
const unit = await unitService.getUnitById('unit-id');

// Get unit hierarchy tree
const hierarchy = await unitService.getUnitHierarchy();
```

## 3. Protected Routes

Tạo middleware để protect routes:

```tsx
// app/dashboard/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## 4. Error Handling

Tất cả services đều throw Error với message từ backend:

```tsx
try {
  await authService.login(email, password);
} catch (error) {
  // error.message chứa message từ backend
  toast.error(error.message);
}
```

## 5. Token Management

Token được tự động quản lý bởi axios interceptor:

- **Access Token**: Tự động thêm vào header `Authorization: Bearer <token>`
- **Refresh Token**: Tự động refresh khi access token hết hạn (401)
- **Logout**: Tự động logout và redirect khi refresh token hết hạn

## 6. API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/logout` - Đăng xuất
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Lấy thông tin user
- `PUT /api/v1/auth/me` - Cập nhật profile
- `PUT /api/v1/auth/change-password` - Đổi mật khẩu

### User Management
- `GET /api/v1/users` - Danh sách users
- `GET /api/v1/users/:id` - Chi tiết user
- `GET /api/v1/users/search` - Tìm kiếm users
- `GET /api/v1/users/stats` - Thống kê users
- `PATCH /api/v1/users/:id/toggle-status` - Kích hoạt/vô hiệu hóa
- `DELETE /api/v1/users/:id` - Xóa user

### Unit Management
- `GET /api/v1/units` - Danh sách units
- `GET /api/v1/units/:id` - Chi tiết unit
- `GET /api/v1/units/hierarchy` - Cây phân cấp units

## 7. Testing

### Start Backend
```bash
cd backend
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3001`
API Docs: `http://localhost:3001/api/docs`

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Test Login
1. Truy cập: `http://localhost:3000/login`
2. Đăng nhập với credentials từ database
3. Kiểm tra token trong localStorage
4. Kiểm tra Network tab để xem API calls

## 8. Debugging

### Check localStorage
```javascript
// Access token
localStorage.getItem('access_token');

// Refresh token
localStorage.getItem('refresh_token');

// User info
JSON.parse(localStorage.getItem('user'));
```

### Check API calls
- Mở DevTools > Network tab
- Filter: XHR
- Xem request/response

## 9. Next Steps

Các modules cần tích hợp tiếp theo:

1. **Document Management** - Quản lý MOU/MOA
2. **Visa Management** - Quản lý Visa
3. **Guest Management** - Quản lý đoàn khách
4. **Translation Management** - Quản lý bản dịch
5. **Report Management** - Báo cáo thống kê
6. **Notification** - Thông báo

## 10. Common Issues

### CORS Error
Đảm bảo backend đã enable CORS cho frontend URL:
```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### 401 Unauthorized
- Check token trong localStorage
- Check token expiry
- Try logout và login lại

### Network Error
- Check backend đang chạy
- Check API_URL trong .env.local
- Check network connection

## Support

Nếu gặp vấn đề, vui lòng:
1. Check console errors
2. Check Network tab
3. Check backend logs
4. Liên hệ: international@dut.udn.vn
