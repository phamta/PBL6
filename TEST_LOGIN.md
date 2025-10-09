# 🧪 Test Login Instructions

## ✅ Hệ thống đã sẵn sàng

### 🖥️ Services đang chạy:
- **Backend API**: http://localhost:3001 ✅
- **Frontend App**: http://localhost:3002 ✅
- **API Docs**: http://localhost:3001/api/docs ✅

---

## 👥 Tài khoản test đã seed:

### 1️⃣ System Admin (Quản trị hệ thống)
- **Email**: `admin@dut.udn.vn`
- **Password**: `Admin@123`
- **Expected Redirect**: `/dashboard/admin` ✨

### 2️⃣ Department Officer (Cán bộ phòng)
- **Email**: `officer@dut.udn.vn`
- **Password**: `Officer@123`
- **Expected Redirect**: `/dashboard/staff`

### 3️⃣ Leadership (Lãnh đạo)
- **Email**: `leader@dut.udn.vn`
- **Password**: `Leader@123`
- **Expected Redirect**: `/dashboard/staff`

### 4️⃣ Faculty Staff (Cán bộ khoa/viện)
- **Email**: `staff@dut.udn.vn`
- **Password**: `Staff@123`
- **Expected Redirect**: `/dashboard/staff`

### 5️⃣ Student (Sinh viên)
- **Email**: `student@dut.udn.vn`
- **Password**: `Student@123`
- **Expected Redirect**: `/dashboard`

---

## 🧪 Các bước test:

### Bước 1: Mở ứng dụng
```
http://localhost:3002/login
```

### Bước 2: Đăng nhập với tài khoản Admin
- Email: `admin@dut.udn.vn`
- Password: `Admin@123`

### Bước 3: Kiểm tra Console Log
Mở Developer Tools (F12) > Console Tab, bạn sẽ thấy:
```
🔐 Login successful - User: { ... }
👤 User roles: [ { role: { code: 'system_admin', ... } } ]
🔍 getDashboardRoute called with user: { ... }
🎭 Primary role: system_admin
✅ Redirecting to admin dashboard
🚀 Redirecting to: /dashboard/admin
```

### Bước 4: Xác nhận redirect
- URL phải là: `http://localhost:3002/dashboard/admin`
- Trang admin dashboard sẽ hiển thị

---

## 🐛 Nếu vẫn lỗi - Debug steps:

### 1. Kiểm tra Console logs
- Mở F12 > Console
- Xem các log `🔐`, `👤`, `🔍`, `🎭`, `✅`, `🚀`
- Nếu không có logs → kiểm tra AuthContext
- Nếu có logs nhưng sai route → kiểm tra roles.ts logic

### 2. Kiểm tra Network tab
- Mở F12 > Network
- Login và xem request `POST /api/v1/auth/login`
- Response phải có:
  ```json
  {
    "user": {
      "id": "...",
      "email": "admin@dut.udn.vn",
      "roles": [
        {
          "role": {
            "code": "system_admin",
            "name": "Quản trị hệ thống"
          }
        }
      ]
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```

### 3. Kiểm tra localStorage
- Mở F12 > Application > Local Storage > http://localhost:3002
- Phải có keys:
  - `access_token`
  - `refresh_token`
  - `user` (chứa user object với roles)

### 4. Kiểm tra backend response
Test trực tiếp API:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dut.udn.vn","password":"Admin@123"}'
```

---

## ✅ Kết quả mong đợi:

Khi đăng nhập với `admin@dut.udn.vn`:
1. ✅ Login thành công
2. ✅ Console logs hiển thị đúng role: `system_admin`
3. ✅ Redirect đến: `http://localhost:3002/dashboard/admin`
4. ✅ Trang admin dashboard hiển thị với badge "Quản trị hệ thống"

---

## 📊 Database Summary:

```
Actions: 60
Permissions: 12
Roles: 5
Permission-Action Mappings: 63
Role-Permission Mappings: 39
Units: 4
Users: 5
User-Role Assignments: 5
```

---

## 🔧 Nếu cần reset database:

```bash
cd backend
npm run seed:rbac
```

---

## 📝 Notes:

- Frontend đang chạy port **3002** (vì 3000 và 3001 đã bị sử dụng)
- Backend đang chạy port **3001**
- Console logs đã được thêm để debug
- Sau khi test xong, có thể xóa các console.log trong production
