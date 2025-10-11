# Quick Start - Test API Integration

## Bước 1: Chuẩn bị Backend

### 1.1. Khởi động Database

```powershell
cd backend
docker-compose up -d
```

### 1.2. Run migrations

```powershell
npx prisma migrate dev
```

### 1.3. Seed database (nếu cần)

```powershell
npx prisma db seed
```

### 1.4. Start backend server

```powershell
npm run start:dev
```

✅ Backend sẽ chạy tại: `http://localhost:3001`
📚 API Docs: `http://localhost:3001/api/docs`

---

## Bước 2: Chuẩn bị Frontend

### 2.1. Install dependencies (nếu chưa)

```powershell
cd frontend
npm install
```

### 2.2. Tạo file .env.local

```powershell
# Tạo file .env.local với nội dung:
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 2.3. Start frontend

```powershell
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:3000`

---

## Bước 3: Test Login Flow

### 3.1. Truy cập trang login

```
http://localhost:3000/login
```

### 3.2. Test với account mẫu

```
Email: admin@dntu.edu.vn
Password: (password từ database)
```

### 3.3. Kiểm tra

1. Mở DevTools (F12)
2. Vào tab **Network**
3. Click **Đăng nhập**
4. Kiểm tra:
   - Request đến `POST http://localhost:3001/api/v1/auth/login`
   - Response trả về `accessToken`, `refreshToken`, `user`
   - Redirect to `/dashboard`

### 3.4. Kiểm tra localStorage

```javascript
// Mở Console tab trong DevTools
localStorage.getItem("access_token");
localStorage.getItem("refresh_token");
JSON.parse(localStorage.getItem("user"));
```

---

## Bước 4: Test API Calls

### 4.1. Test trong code

Tạo component test:

```tsx
// app/test/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/api";

export default function TestPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const result = await userService.getUsers({ page: 1, limit: 10 });
      setUsers(result.users);
      console.log("Users:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8">
      <h1>API Test Page</h1>

      {/* Current User */}
      <div className="mb-4">
        <h2>Current User:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      {/* Test Get Users */}
      <button
        onClick={fetchUsers}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Fetch Users
      </button>

      {/* Users List */}
      <div className="mt-4">
        <h2>Users:</h2>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}
```

Truy cập: `http://localhost:3000/test`

### 4.2. Test với Swagger UI

1. Truy cập: `http://localhost:3001/api/docs`
2. Login qua frontend để lấy token
3. Copy `access_token` từ localStorage
4. Click **Authorize** trong Swagger
5. Nhập: `Bearer <access_token>`
6. Test các endpoints

---

## Bước 5: Test Error Handling

### 5.1. Test sai password

```
Email: admin@dntu.edu.vn
Password: wrongpassword
```

✅ Phải hiện toast error: "Email hoặc mật khẩu không chính xác"

### 5.2. Test token expiry

1. Login thành công
2. Đợi 1 giờ (hoặc giảm token expiry trong config)
3. Call API
4. ✅ Token tự động refresh, request tiếp tục thành công

### 5.3. Test logout

1. Click Logout
2. ✅ Redirect to `/login`
3. ✅ localStorage được clear
4. ✅ Không thể access protected routes

---

## Bước 6: Check Console Logs

### Backend logs

```
🚀 Hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng
📍 Server đang chạy tại: http://localhost:3001
📚 API Documentation: http://localhost:3001/api/docs
🗄️  Database: Connected
🔧 Environment: development
```

### Frontend console

```
✅ No errors
✅ API calls successful
✅ Token management working
```

---

## Common Issues & Solutions

### Issue 1: CORS Error

```
Access to XMLHttpRequest at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**

- Check backend `main.ts` có enable CORS cho `http://localhost:3000`
- Restart backend

### Issue 2: Network Error

```
Error: Network Error
```

**Solution:**

- Check backend đang chạy: `http://localhost:3001`
- Check `.env.local` có đúng `NEXT_PUBLIC_API_URL`
- Check database đang chạy

### Issue 3: 401 Unauthorized

```
Error: Unauthorized
```

**Solution:**

- Check token trong localStorage
- Try logout và login lại
- Check token chưa hết hạn

### Issue 4: Module not found

```
Error: Cannot find module '@/lib/api'
```

**Solution:**

```powershell
# Restart Next.js dev server
npm run dev
```

---

## Debug Tools

### 1. Redux DevTools (Optional)

Install extension để xem state changes

### 2. React DevTools

Install để xem component tree và context values

### 3. Network Tab

- Filter: XHR
- Xem request/response details
- Check headers, payload

### 4. Console Tab

- Check errors
- Use `console.log()` để debug

---

## Testing Checklist

- [ ] Backend đang chạy (`http://localhost:3001`)
- [ ] Frontend đang chạy (`http://localhost:3000`)
- [ ] Database đang chạy và có data
- [ ] `.env.local` được tạo đúng
- [ ] Login thành công
- [ ] Token được lưu trong localStorage
- [ ] Redirect to dashboard sau login
- [ ] Logout thành công
- [ ] API calls hoạt động (test với user.getUsers)
- [ ] Error handling hoạt động
- [ ] Token auto-refresh hoạt động

---

## Next Steps

Sau khi login hoạt động, tiếp tục tích hợp:

1. **Dashboard Page** - Hiển thị user info, stats
2. **User Management** - CRUD users
3. **Unit Management** - CRUD units
4. **Document Management** - MOU/MOA
5. **Visa Management** - Visa processing
6. **Guest Management** - Guest groups
7. **Translation Management** - Translation requests
8. **Report Management** - Statistics & reports

---

## Quick Commands Reference

### Backend

```powershell
cd backend
npm run start:dev      # Start dev server
npm run build          # Build production
npm run start:prod     # Start production
npx prisma studio      # Open Prisma Studio
npx prisma migrate dev # Run migrations
```

### Frontend

```powershell
cd frontend
npm run dev            # Start dev server
npm run build          # Build production
npm run start          # Start production
npm run lint           # Run linting
```

---

## Contact & Support

📧 Email: international@dut.udn.vn
📞 Phone: (+84) 236 3736 825
🏫 Address: 54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng

---

**Happy Coding! 🚀**
