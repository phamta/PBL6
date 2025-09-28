# Admin Module Documentation

Tài liệu này mô tả chi tiết về Admin Module đã được hoàn thiện trong hệ thống PBL6 QLHTQT.

## Tổng quan

Admin Module cung cấp đầy đủ các chức năng quản trị hệ thống, bao gồm:

- ✅ Quản lý người dùng (CRUD, phân quyền)
- ✅ Quản lý vai trò và quyền hạn
- ✅ Cấu hình hệ thống
- ✅ Thống kê và báo cáo
- ✅ Xử lý hàng loạt
- ✅ Xuất dữ liệu
- ✅ Sao lưu và khôi phục
- ✅ Nhật ký hoạt động

## Cấu trúc Module

```
src/modules/admin/
├── admin.controller.ts          # API endpoints
├── admin.service.ts             # Business logic
├── admin.module.ts              # Module configuration
├── index.ts                     # Exports
├── dto/
│   └── index.ts                 # Data Transfer Objects
├── entities/
│   ├── index.ts                 # Entity exports
│   ├── system-log.entity.ts     # System log entity
│   └── system-settings.entity.ts # System settings entity
└── services/
    └── logging.service.ts       # Logging service
```

## API Endpoints

### 👥 Quản lý người dùng

| Method | Endpoint                       | Mô tả                             |
| ------ | ------------------------------ | --------------------------------- |
| GET    | `/admin/users`                 | Lấy danh sách người dùng          |
| GET    | `/admin/users/:id`             | Lấy thông tin chi tiết người dùng |
| POST   | `/admin/users`                 | Tạo người dùng mới                |
| PUT    | `/admin/users/:id`             | Cập nhật thông tin người dùng     |
| DELETE | `/admin/users/:id`             | Xóa người dùng                    |
| POST   | `/admin/users/:id/assign-role` | Gán vai trò cho người dùng        |
| DELETE | `/admin/users/:id/remove-role` | Gỡ vai trò khỏi người dùng        |
| POST   | `/admin/users/batch-update`    | Cập nhật hàng loạt người dùng     |

### 🔐 Quản lý vai trò

| Method | Endpoint           | Mô tả                          |
| ------ | ------------------ | ------------------------------ |
| GET    | `/admin/roles`     | Lấy danh sách vai trò          |
| GET    | `/admin/roles/:id` | Lấy thông tin chi tiết vai trò |
| POST   | `/admin/roles`     | Tạo vai trò mới                |
| PUT    | `/admin/roles/:id` | Cập nhật vai trò               |
| DELETE | `/admin/roles/:id` | Xóa vai trò                    |

### ⚙️ Cấu hình hệ thống

| Method | Endpoint                      | Mô tả                 |
| ------ | ----------------------------- | --------------------- |
| GET    | `/admin/system-settings`      | Lấy danh sách cài đặt |
| GET    | `/admin/system-settings/:key` | Lấy cài đặt theo key  |
| POST   | `/admin/system-settings`      | Tạo cài đặt mới       |
| PUT    | `/admin/system-settings/:key` | Cập nhật cài đặt      |
| DELETE | `/admin/system-settings/:key` | Xóa cài đặt           |

### 📊 Thống kê và báo cáo

| Method | Endpoint                  | Mô tả                |
| ------ | ------------------------- | -------------------- |
| GET    | `/admin/dashboard/stats`  | Thống kê tổng quan   |
| GET    | `/admin/analytics/users`  | Phân tích người dùng |
| GET    | `/admin/analytics/visas`  | Phân tích đơn visa   |
| GET    | `/admin/reports/activity` | Báo cáo hoạt động    |

### 📤 Xuất dữ liệu

| Method | Endpoint              | Mô tả                     |
| ------ | --------------------- | ------------------------- |
| POST   | `/admin/export/users` | Xuất danh sách người dùng |
| POST   | `/admin/export/visas` | Xuất danh sách đơn visa   |
| POST   | `/admin/export/logs`  | Xuất nhật ký hệ thống     |

### 💾 Sao lưu

| Method | Endpoint                | Mô tả                    |
| ------ | ----------------------- | ------------------------ |
| POST   | `/admin/backup/create`  | Tạo bản sao lưu          |
| GET    | `/admin/backup/list`    | Danh sách bản sao lưu    |
| POST   | `/admin/backup/restore` | Khôi phục từ bản sao lưu |

### 📋 Nhật ký

| Method | Endpoint              | Mô tả                |
| ------ | --------------------- | -------------------- |
| GET    | `/admin/logs`         | Lấy nhật ký hệ thống |
| DELETE | `/admin/logs/cleanup` | Dọn dẹp nhật ký cũ   |

## Authentication & Authorization

Tất cả endpoints yêu cầu:

- 🔐 JWT Authentication (`@UseGuards(JwtAuthGuard)`)
- 👑 Admin Role (`@Roles(UserRole.ADMIN)`)

## Entities mới

### SystemSettings Entity

```typescript
@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column('text')
  value: string;

  @Column({ default: 'string' })
  type: string; // 'string', 'number', 'boolean', 'json'

  @Column({ default: 'general' })
  category: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ name: 'is_editable', default: true })
  isEditable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### User Entity Enhancement

Thêm trường `status` vào User entity:

```typescript
@Column({ default: 'active' })
status: string; // 'active', 'inactive', 'suspended', 'pending'
```

## Services

### AdminService

Service chính chứa tất cả business logic cho admin operations.

### LoggingService

Service chuyên dụng để ghi nhật ký các hoạt động admin:

- `logUserOperation()` - Ghi nhật ký thao tác người dùng
- `logRoleChange()` - Ghi nhật ký thay đổi vai trò
- `logSystemConfigUpdate()` - Ghi nhật ký cập nhật cấu hình
- `logBatchOperation()` - Ghi nhật ký thao tác hàng loạt

## Migration

File migration để tạo bảng và cột mới:

```
src/migrations/1702000000000-AddSystemSettingsAndUserStatus.ts
```

Chạy migration:

```bash
npm run typeorm:run
```

## Testing

Sử dụng script test để kiểm tra admin module:

```bash
node scripts/test-admin-module.js
```

## Cài đặt mặc định

Các cài đặt hệ thống mặc định được tạo tự động khi chạy migration:

- `app_name`: Tên ứng dụng
- `app_version`: Phiên bản ứng dụng
- `max_file_size`: Kích thước file tối đa
- `allowed_file_types`: Các loại file được phép
- `email_notifications`: Bật thông báo email
- `auto_backup`: Tự động sao lưu
- `backup_frequency`: Tần suất sao lưu
- `maintenance_mode`: Chế độ bảo trì
- `default_language`: Ngôn ngữ mặc định
- `session_timeout`: Thời gian timeout phiên

## Sử dụng

1. Đảm bảo server đang chạy
2. Đăng nhập với tài khoản admin
3. Sử dụng JWT token để gọi các admin API
4. Tất cả hoạt động sẽ được ghi nhật ký tự động

## Bảo mật

- ✅ JWT Authentication required
- ✅ Role-based authorization (ADMIN only)
- ✅ Input validation với DTO
- ✅ Audit logging cho tất cả operations
- ✅ Soft delete cho user safety

---

_Admin Module đã được hoàn thiện đầy đủ để hỗ trợ tất cả chức năng quản trị cần thiết cho hệ thống PBL6 QLHTQT._
