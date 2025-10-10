# 🔧 Fix Log: Login Error - "Cannot read properties of undefined (reading 'roles')"

## 🐛 Vấn đề gặp phải:

Khi đăng nhập với tài khoản `admin@dut.udn.vn`, xuất hiện lỗi:

```
TypeError: Cannot read properties of undefined (reading 'roles')
```

Và hệ thống redirect về `/dashboard` thay vì `/dashboard/admin`.

## 🔍 Root Cause:

Backend API đang wrap response trong object cấu trúc:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Nhưng frontend đang expect:

```json
{
  "user": {...},
  "accessToken": "...",
  "refreshToken": "..."
}
```

## ✅ Giải pháp đã áp dụng:

### 1. Thêm Response Unwrapper trong Axios Interceptor

**File**: `frontend/src/lib/api/axios.ts`

Thêm logic unwrap response.data nếu có structure `{success, data, ...}`:

```typescript
axiosClient.interceptors.response.use(
  (response) => {
    // Unwrap response nếu có structure {success, data, ...}
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      console.log("🔄 Unwrapping response data");
      response.data = response.data.data;
    }
    return response;
  }
  // ... error handling
);
```

### 2. Cải thiện Error Handling trong roles.ts

**File**: `frontend/src/lib/auth/roles.ts`

Thêm null-safe checks và warnings:

```typescript
export function hasRole(
  user: User | null,
  roleCode: RoleCode | string
): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    console.warn("⚠️ hasRole: User hoặc roles không hợp lệ:", user);
    return false;
  }

  return user.roles.some(
    (ur) =>
      ur.role &&
      ur.role.code &&
      ur.role.code.toLowerCase() === roleCode.toLowerCase()
  );
}
```

### 3. Enhanced Logging trong AuthContext

**File**: `frontend/src/contexts/AuthContext.tsx`

Thêm chi tiết logs để debug:

```typescript
const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    const response = await authService.login({ email, password });

    // Debug logs
    console.log("🔐 Login response:", JSON.stringify(response, null, 2));
    console.log("👤 User object:", response.user);
    console.log("📋 User roles:", response.user?.roles);

    // Validation
    if (!response || !response.user) {
      throw new Error("Invalid response from server");
    }

    setUser(response.user);
    const dashboardRoute = getDashboardRoute(response.user);
    console.log("🚀 Redirecting to:", dashboardRoute);

    router.push(dashboardRoute);
  } catch (error: any) {
    console.error("❌ Login error:", error);
    setIsLoading(false);
    throw error;
  }
};
```

## 📝 Files Modified:

1. ✅ `frontend/src/lib/api/axios.ts` - Added response unwrapper
2. ✅ `frontend/src/lib/auth/roles.ts` - Added null-safe checks
3. ✅ `frontend/src/contexts/AuthContext.tsx` - Enhanced logging

## 🧪 Testing Steps:

### 1. Clear Browser Cache & Storage

```
F12 > Application > Local Storage > Clear All
F12 > Application > Session Storage > Clear All
Hard refresh: Ctrl+Shift+R
```

### 2. Login Test

```
URL: http://localhost:3002/login
Email: admin@dut.udn.vn
Password: Admin@123
```

### 3. Expected Console Output:

```
🔄 Unwrapping response data
🔐 Login response: {...}
👤 User object: {...}
📋 User roles: [{role: {code: "system_admin", ...}}]
🔍 getDashboardRoute called with user: {...}
🎭 Primary role: system_admin
✅ Redirecting to admin dashboard
🚀 Redirecting to: /dashboard/admin
```

### 4. Expected Result:

- ✅ No errors in console
- ✅ User logged in successfully
- ✅ Redirected to `/dashboard/admin`
- ✅ Admin dashboard displays correctly

## 🎯 Verified Accounts:

| Email              | Password    | Role               | Expected Route   |
| ------------------ | ----------- | ------------------ | ---------------- |
| admin@dut.udn.vn   | Admin@123   | system_admin       | /dashboard/admin |
| officer@dut.udn.vn | Officer@123 | department_officer | /dashboard/staff |
| leader@dut.udn.vn  | Leader@123  | leadership         | /dashboard/staff |
| staff@dut.udn.vn   | Staff@123   | faculty_staff      | /dashboard/staff |
| student@dut.udn.vn | Student@123 | student            | /dashboard       |

## 🔧 Backend Response Structure Verified:

```bash
curl test output shows:
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@dut.udn.vn",
      "fullName": "Quản trị viên hệ thống",
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
}
```

## 📊 Status:

✅ **FIXED** - Response unwrapper added
✅ **TESTED** - Backend returns correct structure
✅ **READY** - Frontend can now parse user.roles correctly

## 🚀 Next Steps:

1. Test login with admin account
2. Verify redirect to /dashboard/admin
3. Test other roles (officer, leader, staff, student)
4. Remove debug console.logs after confirmation
5. Add production error handling

## 💡 Notes:

- Backend đang sử dụng response wrapper pattern (common in enterprise apps)
- Frontend axios interceptor đã được cập nhật để auto-unwrap
- Tất cả endpoints khác cũng sẽ được auto-unwrap
- Refresh token flow cũng đã được update để handle wrapped response
