# Role-Based Redirect After Login - Implementation Guide

## ✅ Đã Implement

### 1. **Role Helper Functions** (`src/lib/auth/roles.ts`)
- `hasRole()` - Kiểm tra user có role cụ thể
- `hasAnyRole()` - Kiểm tra user có bất kỳ role nào trong list
- `getPrimaryRole()` - Lấy role chính (priority cao nhất)
- `getDashboardRoute()` - Lấy dashboard route dựa trên role
- `isAdmin()` - Kiểm tra user có phải admin
- `isStaff()` - Kiểm tra user có phải staff
- `isStudent()` - Kiểm tra user có phải student

### 2. **useRole Hook** (`src/hooks/useRole.ts`)
Custom hook để dễ dàng sử dụng role functions trong components:
```tsx
const { primaryRole, primaryRoleName, dashboardRoute, isAdmin, isStaff } = useRole();
```

### 3. **ProtectedRoute Component** (`src/components/auth/ProtectedRoute.tsx`)
Component bảo vệ routes yêu cầu authentication và role cụ thể:
```tsx
<ProtectedRoute allowedRoles={[RoleCode.SYSTEM_ADMIN]}>
  {children}
</ProtectedRoute>
```

### 4. **AuthContext Updated** (`src/contexts/AuthContext.tsx`)
- Login function tự động redirect dựa trên role
- Register function tự động redirect dựa trên role

### 5. **Dashboard Layouts Updated**
- `dashboard/admin/layout.tsx` - Chỉ cho System Admin
- `dashboard/staff/layout.tsx` - Cho Department Officer, Leadership, Faculty Staff

---

## 📋 Role Priority & Redirect Logic

```
SYSTEM_ADMIN           → /dashboard/admin
DEPARTMENT_OFFICER     → /dashboard/staff
LEADERSHIP             → /dashboard/staff
FACULTY_STAFF          → /dashboard/staff
STUDENT                → /dashboard
```

**Priority Order** (nếu user có nhiều roles):
1. System Admin (cao nhất)
2. Department Officer
3. Leadership
4. Faculty Staff
5. Student (thấp nhất)

---

## 🧪 Test Cases

### Test 1: Login với System Admin
```
Email: admin@dntu.edu.vn
Password: [admin password]

Expected: Redirect to /dashboard/admin
```

### Test 2: Login với Department Officer
```
Email: officer@dntu.edu.vn
Password: [officer password]

Expected: Redirect to /dashboard/staff
```

### Test 3: Login với Faculty Staff
```
Email: staff@dntu.edu.vn
Password: [staff password]

Expected: Redirect to /dashboard/staff
```

### Test 4: Login với Student
```
Email: student@dntu.edu.vn
Password: [student password]

Expected: Redirect to /dashboard
```

### Test 5: User có nhiều roles (Admin + Staff)
```
Expected: Redirect to /dashboard/admin (vì Admin có priority cao nhất)
```

### Test 6: Truy cập trực tiếp /dashboard/admin mà không phải admin
```
Expected: Redirect to dashboard tương ứng với role của user
```

---

## 🔧 Cách Sử dụng

### 1. Trong Component

```tsx
import { useRole } from '@/hooks/useRole';

function MyComponent() {
  const { 
    primaryRole, 
    primaryRoleName, 
    isAdmin, 
    isStaff,
    hasRole 
  } = useRole();

  return (
    <div>
      <p>Role: {primaryRoleName}</p>
      
      {isAdmin && <AdminControls />}
      {isStaff && <StaffControls />}
      
      {hasRole(RoleCode.DEPARTMENT_OFFICER) && (
        <DepartmentFeatures />
      )}
    </div>
  );
}
```

### 2. Protected Route

```tsx
// Chỉ cho Admin
<ProtectedRoute allowedRoles={[RoleCode.SYSTEM_ADMIN]}>
  <AdminPage />
</ProtectedRoute>

// Cho nhiều roles
<ProtectedRoute allowedRoles={[
  RoleCode.DEPARTMENT_OFFICER,
  RoleCode.LEADERSHIP
]}>
  <StaffPage />
</ProtectedRoute>
```

### 3. Conditional Rendering

```tsx
import { isAdmin, isStaff, hasRole } from '@/lib/auth/roles';
import { useAuth } from '@/contexts/AuthContext';

function Navigation() {
  const { user } = useAuth();
  
  return (
    <nav>
      {isAdmin(user) && (
        <Link href="/dashboard/admin">Admin Panel</Link>
      )}
      
      {isStaff(user) && (
        <Link href="/dashboard/staff">Staff Dashboard</Link>
      )}
      
      {hasRole(user, RoleCode.STUDENT) && (
        <Link href="/dashboard">Student Dashboard</Link>
      )}
    </nav>
  );
}
```

---

## 📁 Files Changed/Created

### Created:
- ✅ `src/lib/auth/roles.ts` - Role helper functions
- ✅ `src/hooks/useRole.ts` - useRole hook
- ✅ `src/components/auth/ProtectedRoute.tsx` - Protected route component

### Updated:
- ✅ `src/contexts/AuthContext.tsx` - Added role-based redirect
- ✅ `src/app/dashboard/admin/layout.tsx` - Added ProtectedRoute
- ✅ `src/app/dashboard/staff/layout.tsx` - Added ProtectedRoute

---

## 🚀 Testing Steps

### 1. Kiểm tra Database
```sql
-- Check roles in database
SELECT * FROM roles;

-- Check user roles
SELECT u.email, u."fullName", r.name as role, r.code
FROM users u
JOIN user_roles ur ON u.id = ur."userId"
JOIN roles r ON ur."roleId" = r.id;
```

### 2. Start Backend & Frontend
```powershell
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Test Login Flow
1. Truy cập: `http://localhost:3000/login`
2. Đăng nhập với các tài khoản khác nhau
3. Verify redirect URL
4. Check localStorage có token
5. Check console không có errors

### 4. Test Protected Routes
1. Login với student account
2. Thử truy cập: `http://localhost:3000/dashboard/admin`
3. Expected: Redirect về `/dashboard`

### 5. Test Role Display
1. Login thành công
2. Check badge hiển thị đúng role name
3. Verify menu items phù hợp với role

---

## 🐛 Common Issues

### Issue 1: "Cannot find module '@/lib/auth/roles'"
**Solution:** Restart dev server
```powershell
npm run dev
```

### Issue 2: Redirect loop
**Solution:** Check role codes trong database khớp với RoleCode enum
```typescript
// Backend database role codes phải là:
system_admin
department_officer
leadership
faculty_staff
student
```

### Issue 3: User có nhiều roles nhưng redirect sai
**Solution:** Check priority order trong `getPrimaryRole()` function

---

## 📊 Role Codes Mapping

| Backend DB | Frontend Enum | Display Name |
|------------|---------------|--------------|
| `system_admin` | `RoleCode.SYSTEM_ADMIN` | Quản trị hệ thống |
| `department_officer` | `RoleCode.DEPARTMENT_OFFICER` | Cán bộ phòng |
| `leadership` | `RoleCode.LEADERSHIP` | Lãnh đạo |
| `faculty_staff` | `RoleCode.FACULTY_STAFF` | Cán bộ khoa/viện |
| `student` | `RoleCode.STUDENT` | Sinh viên |

---

## 🔐 Security Notes

1. **Always check roles on backend** - Frontend role checks chỉ cho UI/UX
2. **Use JWT actions/permissions** - Backend verify quyền qua JWT token
3. **Protected routes** - Luôn wrap sensitive routes với ProtectedRoute
4. **API calls** - Backend API endpoints có guards kiểm tra permissions

---

## 📝 Next Steps

1. Implement permission-based UI (ngoài role-based)
2. Add role management UI for admins
3. Add audit logs cho role changes
4. Implement "Switch Role" feature nếu user có nhiều roles
5. Add breadcrumbs với role context

---

## 💡 Tips

1. **Use useRole hook** thay vì import trực tiếp functions
2. **Cache role checks** - useRole đã memoize results
3. **Consistent naming** - Dùng RoleCode enum thay vì hardcode strings
4. **Test all roles** - Tạo test accounts cho mỗi role
5. **Document permissions** - Track role → dashboard → features mapping

---

**Hoàn thành! 🎉**

System đã được cấu hình để redirect user đến dashboard tương ứng với role sau khi login.
