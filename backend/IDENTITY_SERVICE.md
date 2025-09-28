# Identity Service - Hệ thống Quản lý Hợp tác Quốc tế

Identity Service là một trong những service chính của hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng, được xây dựng theo kiến trúc SOA (Service-Oriented Architecture).

## 🏗️ Cấu trúc Service

```
src/services/identity/
├── auth/                   # Authentication Module
│   ├── dto/               # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── refresh-token.dto.ts
│   ├── auth.controller.ts # REST API endpoints
│   ├── auth.service.ts    # Business logic
│   ├── auth.module.ts     # Module configuration
│   ├── jwt.strategy.ts    # JWT strategy
│   └── refresh-token.strategy.ts
├── user/                  # User Management Module
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   ├── change-password.dto.ts
│   │   └── query-users.dto.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── unit/                  # Unit/Organization Management
│   ├── dto/
│   │   ├── create-unit.dto.ts
│   │   ├── update-unit.dto.ts
│   │   └── query-units.dto.ts
│   ├── unit.controller.ts
│   ├── unit.service.ts
│   └── unit.module.ts
└── identity.module.ts     # Main Identity module
```

## 🔐 Authentication (Auth Module)

### Endpoints

| Method | Endpoint           | Description               | Auth Required    |
| ------ | ------------------ | ------------------------- | ---------------- |
| POST   | `/auth/register`   | Đăng ký tài khoản mới     | ❌               |
| POST   | `/auth/login`      | Đăng nhập                 | ❌               |
| POST   | `/auth/refresh`    | Refresh token             | 🔄 Refresh Token |
| POST   | `/auth/logout`     | Đăng xuất                 | 🔄 Refresh Token |
| POST   | `/auth/logout-all` | Đăng xuất tất cả thiết bị | ✅ Access Token  |
| GET    | `/auth/profile`    | Lấy thông tin profile     | ✅ Access Token  |

### Features

- ✅ JWT Authentication với Access + Refresh Token
- ✅ Password hashing với bcrypt
- ✅ Multi-device support
- ✅ Token refresh mechanism
- ✅ Secure logout (token invalidation)

## 👥 User Management (User Module)

### Endpoints

| Method | Endpoint                     | Description     | Permissions                      |
| ------ | ---------------------------- | --------------- | -------------------------------- |
| POST   | `/users`                     | Tạo user mới    | SYSTEM_ADMIN, DEPARTMENT_OFFICER |
| GET    | `/users`                     | Danh sách users | All authenticated users          |
| GET    | `/users/:id`                 | Chi tiết user   | Owner/Admin/Department Officer   |
| PUT    | `/users/:id`                 | Cập nhật user   | Owner/Admin/Department Officer   |
| DELETE | `/users/:id`                 | Xóa user        | SYSTEM_ADMIN only                |
| PUT    | `/users/:id/change-password` | Đổi mật khẩu    | Owner only                       |
| PUT    | `/users/:id/reset-password`  | Reset mật khẩu  | SYSTEM_ADMIN, DEPARTMENT_OFFICER |

### Features

- ✅ CRUD operations với role-based access control
- ✅ Pagination và filtering
- ✅ Search theo tên/email
- ✅ Password management (change/reset)
- ✅ User activation/deactivation

### User Roles

- **SYSTEM_ADMIN**: Quản trị hệ thống (full access)
- **DEPARTMENT_OFFICER**: Cán bộ phòng KHCN&ĐN (quản lý users trong unit)
- **LEADERSHIP**: Lãnh đạo (read access)
- **FACULTY_STAFF**: Cán bộ khoa/viện (limited access)
- **STUDENT**: Sinh viên (basic access)

## 🏢 Unit Management (Unit Module)

### Endpoints

| Method | Endpoint                   | Description           | Permissions                      |
| ------ | -------------------------- | --------------------- | -------------------------------- |
| POST   | `/units`                   | Tạo đơn vị mới        | SYSTEM_ADMIN, DEPARTMENT_OFFICER |
| GET    | `/units`                   | Danh sách đơn vị      | All authenticated users          |
| GET    | `/units/hierarchy`         | Cây phân cấp đơn vị   | All authenticated users          |
| GET    | `/units/:id`               | Chi tiết đơn vị       | All authenticated users          |
| PUT    | `/units/:id`               | Cập nhật đơn vị       | SYSTEM_ADMIN, DEPARTMENT_OFFICER |
| PATCH  | `/units/:id/toggle-status` | Kích hoạt/vô hiệu hóa | SYSTEM_ADMIN, DEPARTMENT_OFFICER |
| DELETE | `/units/:id`               | Xóa đơn vị            | SYSTEM_ADMIN only                |

### Features

- ✅ Hierarchical organization structure
- ✅ Parent-child relationships
- ✅ Circular reference prevention
- ✅ Cascade activation/deactivation
- ✅ Unit filtering và search

## 🚀 Cách sử dụng

### 1. Khởi động server

```bash
npm run start:dev
```

### 2. Đăng ký tài khoản đầu tiên (System Admin)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dntu.edu.vn",
    "password": "Admin123456",
    "fullName": "System Administrator",
    "role": "SYSTEM_ADMIN"
  }'
```

### 3. Đăng nhập

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dntu.edu.vn",
    "password": "Admin123456"
  }'
```

### 4. Sử dụng Access Token

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔍 API Documentation

Sau khi start server, truy cập:

- **Swagger UI**: http://localhost:3000/api
- **API JSON**: http://localhost:3000/api-json

## 🛡️ Security Features

- ✅ JWT với RS256 algorithm
- ✅ Password hashing với bcrypt (rounds: 12)
- ✅ Input validation với class-validator
- ✅ Role-based access control (RBAC)
- ✅ API rate limiting
- ✅ Request sanitization
- ✅ Refresh token rotation
- ✅ Cross-Origin Resource Sharing (CORS)

## 📊 Database Schema

### Users Table

- id (CUID)
- email (unique)
- password (hashed)
- fullName
- phoneNumber
- avatar
- role (enum)
- unitId (foreign key)
- isActive
- timestamps

### Units Table

- id (CUID)
- name (unique)
- code (unique, optional)
- parentId (self-referential)
- level (hierarchy level)
- isActive
- timestamps

### RefreshTokens Table

- id (CUID)
- token (hashed)
- userId (foreign key)
- expiresAt
- createdAt

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_ACCESS_TOKEN_EXPIRY="15m"
JWT_REFRESH_TOKEN_EXPIRY="30d"

# Server
PORT=3000
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Logging

Service sử dụng Winston logger với các levels:

- ERROR: System errors
- WARN: Business logic warnings
- INFO: General information
- DEBUG: Detailed debugging (dev only)

## 🚨 Error Handling

- ✅ Global exception filter
- ✅ Standardized error responses
- ✅ Validation error handling
- ✅ Database constraint errors
- ✅ Custom business logic exceptions

## 📈 Performance

- ✅ Database connection pooling
- ✅ Query optimization với Prisma
- ✅ Response caching (Redis ready)
- ✅ Pagination for large datasets
- ✅ Selective field loading

## 🔄 Next Steps

1. ✅ **Identity Service** (HOÀN THÀNH)
2. ⏳ Document Management Service
3. ⏳ Visa Application Service
4. ⏳ Guest Management Service
5. ⏳ Translation Service
6. ⏳ Report Generation Service
7. ⏳ System Configuration Service
8. ⏳ Notification Service
9. ⏳ Activity Logging Service

---

**Phát triển bởi**: Nhóm PBL6 - ĐHBK Đà Nẵng  
**Ngày cập nhật**: September 2025  
**Version**: 1.0.0
