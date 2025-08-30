# 🔐 Hệ thống Phân quyền PBL6 - Hoàn chỉnh

## 📝 **Tổng quan**

Đã thiết kế và triển khai hệ thống phân quyền hoàn chỉnh với 7 roles và permission-based access control.

## 👥 **7 Roles được định nghĩa**

### 1. **Admin CNTT** (`admin`)

**Vai trò:** Quản lý tài khoản & phân quyền, cấu hình hệ thống
**Quyền hạn:**

- ✅ Quản lý tài khoản (tạo, sửa, xóa, phân quyền)
- ✅ Cấu hình hệ thống
- ✅ Backup & nhật ký hệ thống
- ✅ Truy cập toàn bộ dữ liệu
- ✅ Tất cả quyền của các module

### 2. **Người dùng cơ sở** (`user`)

**Vai trò:** Cán bộ Khoa/Phòng/Viện
**Quyền hạn:**

- ✅ Nộp hồ sơ (Visa, MOU, Bản dịch, Đoàn vào)
- ✅ Theo dõi trạng thái
- ✅ Bổ sung thông tin khi được yêu cầu
- ✅ Quản lý khách quốc tế của đơn vị mình
- 🔒 Chỉ xem dữ liệu đơn vị

### 3. **Sinh viên/Học viên quốc tế** (`student`)

**Vai trò:** Người dùng cá nhân
**Quyền hạn:**

- ✅ Đăng ký gia hạn visa
- ✅ Upload hồ sơ, theo dõi trạng thái
- ✅ Nhận thông báo nhắc hạn
- 🔒 Chỉ xem dữ liệu cá nhân

### 4. **Chuyên viên HTQT/KHCN&ĐN** (`specialist`)

**Vai trò:** Tiếp nhận và xử lý hồ sơ
**Quyền hạn:**

- ✅ Tiếp nhận và kiểm tra hồ sơ
- ✅ Yêu cầu bổ sung, chỉnh sửa
- ✅ Duyệt sơ bộ hoặc từ chối
- ✅ Xuất công văn (NA5/NA6, xác nhận bản dịch)
- ✅ Thống kê và báo cáo
- ✅ Xem toàn bộ dữ liệu

### 5. **Lãnh đạo Phòng HTQT/KHCN** (`manager`)

**Vai trò:** Phê duyệt chính thức
**Quyền hạn:**

- ✅ Xem toàn bộ hồ sơ đã qua bước kiểm tra
- ✅ Phê duyệt hoặc từ chối chính thức
- ✅ Quản lý báo cáo tổng hợp
- ✅ Ký MOU, chấm dứt hợp tác
- ✅ Xuất báo cáo Excel/PDF

### 6. **Người dùng tra cứu** (`viewer`)

**Vai trò:** Xem dữ liệu công khai
**Quyền hạn:**

- ✅ Chỉ có quyền xem dữ liệu đã công khai/được phép
- ✅ Xem danh sách MOU đã ký
- ✅ Xem thống kê báo cáo
- 🔒 Không có quyền tạo/sửa

### 7. **Hệ thống** (`system`)

**Vai trò:** Bot tự động
**Quyền hạn:**

- ✅ Gửi email nhắc hạn visa, MOU sắp hết hiệu lực
- ✅ Gửi thông báo dashboard
- ✅ Xem dữ liệu để xử lý tự động

## 🔑 **Permission System**

### **Cấu trúc Permission**

```typescript
format: "module:action"
Ví dụ: "mou:create", "visa:approve", "user:delete"
```

### **Các nhóm Permission chính:**

- **User Management:** `user:create`, `user:read`, `user:update`, `user:delete`, `user:assign_role`
- **System:** `system:config`, `system:backup`, `system:logs`
- **Visa:** `visa:create`, `visa:read`, `visa:update`, `visa:review`, `visa:approve`
- **MOU:** `mou:create`, `mou:read`, `mou:update`, `mou:review`, `mou:approve`, `mou:sign`
- **Translation:** `translation:create`, `translation:read`, `translation:review`, `translation:certify`
- **Reports:** `report:view`, `report:export`, `report:stats`
- **Data Access:** `data:view_all`, `data:view_department`, `data:view_own`, `data:view_public`

## 🏗️ **Backend Architecture**

### **Files Created/Updated:**

1. **Permission System:**

   - `src/common/enums/permission.enum.ts` - Permission definitions
   - `src/auth/guards/permissions.guard.ts` - Permission validation
   - `src/auth/decorators/permissions.decorator.ts` - Permission decorator
   - `src/auth/services/permission.service.ts` - Permission utilities

2. **Updated Controllers:**

   - `src/modules/user/user.controller.ts` - Permission-based access
   - `src/modules/mou/mou.controller.ts` - Permission-based access
   - `src/modules/report/report.controller.ts` - Permission-based access

3. **Database:**
   - `src/database/migrations/role-migration.sql` - Role migration script

### **Usage Examples:**

```typescript
// Controller permission check
@UseGuards(PermissionsGuard)
@Permissions(Permission.MOU_CREATE)
createMOU() { ... }

// Service permission check
@UseGuards(PermissionsGuard)
@Permissions(Permission.USER_ASSIGN_ROLE, Permission.USER_UPDATE)
assignRole() { ... }
```

## 🎨 **Frontend Architecture**

### **Files Created:**

1. **Permission Hook:**
   - `src/hooks/usePermissions.ts` - Permission checking utilities
2. **Permission Components:**
   - `src/components/auth/PermissionGate.tsx` - Conditional rendering
3. **Admin Pages:**
   - `src/app/dashboard/admin/roles/page.tsx` - Role management interface

### **Usage Examples:**

```typescript
// Permission checking
const { can, hasPermission } = usePermissions();

if (can.createMOU()) {
  // Show create button
}

// Conditional rendering
<PermissionGate permission="mou:create">
  <CreateButton />
</PermissionGate>

// Role checking
<RoleGate roles={['admin', 'manager']}>
  <AdminPanel />
</RoleGate>
```

## 🚀 **Migration Strategy**

### **Role Mapping:**

- `KHOA` → `MANAGER` (Lãnh đạo Phòng)
- `PHONG` → `SPECIALIST` (Chuyên viên)
- `USER` → `USER` (giữ nguyên)
- `ADMIN` → `ADMIN` (giữ nguyên)

### **Migration Steps:**

1. ✅ Update UserRole enum
2. ✅ Create Permission system
3. ✅ Update Controllers to use Permissions
4. ✅ Create Frontend permission system
5. 🔄 Run database migration
6. 🔄 Update remaining service files
7. 🔄 Test all modules

## 📊 **Role-Permission Matrix**

| Module              | Admin   | User | Student | Specialist | Manager | Viewer | System |
| ------------------- | ------- | ---- | ------- | ---------- | ------- | ------ | ------ |
| **User Management** | ✅ Full | ❌   | ❌      | ❌         | ❌      | ❌     | ❌     |
| **Visa Create**     | ✅      | ✅   | ✅      | ❌         | ❌      | ❌     | ❌     |
| **Visa Review**     | ✅      | ❌   | ❌      | ✅         | ❌      | ❌     | ❌     |
| **Visa Approve**    | ✅      | ❌   | ❌      | ❌         | ✅      | ❌     | ❌     |
| **MOU Create**      | ✅      | ✅   | ❌      | ❌         | ❌      | ❌     | ❌     |
| **MOU Review**      | ✅      | ❌   | ❌      | ✅         | ❌      | ❌     | ❌     |
| **MOU Approve**     | ✅      | ❌   | ❌      | ❌         | ✅      | ❌     | ❌     |
| **MOU Sign**        | ✅      | ❌   | ❌      | ❌         | ✅      | ❌     | ❌     |
| **Reports Export**  | ✅      | ❌   | ❌      | ✅         | ✅      | ❌     | ❌     |
| **System Config**   | ✅      | ❌   | ❌      | ❌         | ❌      | ❌     | ❌     |
| **View Data**       | All     | Dept | Own     | All        | All     | Public | All    |

## 🔧 **Next Steps**

1. **Complete Migration:**

   ```sql
   -- Run migration script
   psql -d your_database < src/database/migrations/role-migration.sql
   ```

2. **Update Remaining Files:**

   - Visa extension services
   - Translation services
   - Visitor services
   - Other controllers

3. **Test All Modules:**

   - User authentication
   - Permission validation
   - Role-based access
   - API endpoints

4. **Frontend Integration:**
   - Update navigation based on permissions
   - Hide/show buttons based on roles
   - Create role management interface

## ✅ **Benefits Achieved**

1. **Granular Control:** Permission-based thay vì role-based đơn thuần
2. **Scalability:** Dễ dàng thêm permissions mới
3. **Security:** Kiểm soát chặt chẽ từng hành động
4. **Maintainability:** Code rõ ràng, dễ bảo trì
5. **User Experience:** Interface phù hợp với từng role
6. **Audit Trail:** Theo dõi được quyền hạn của từng user

## 🎯 **Status**

- ✅ **Backend Permission System** - Hoàn thành
- ✅ **Frontend Permission Hooks** - Hoàn thành
- ✅ **Role Management Interface** - Hoàn thành
- ✅ **Migration Scripts** - Hoàn thành
- 🔄 **File Updates** - Đang tiến hành
- ⏳ **Testing** - Chờ hoàn thiện
- ⏳ **Deployment** - Chờ testing

Hệ thống đã sẵn sàng để test và deploy với đầy đủ 7 roles và permission system mạnh mẽ!
