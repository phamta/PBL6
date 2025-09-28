# Hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng (Backend)

Hệ thống quản lý hoạt động hợp tác quốc tế của Phòng Khoa học Công nghệ & Đào tạo - Đại học Bách khoa Đà Nẵng.

## 🏗️ Kiến trúc

### Công nghệ sử dụng
- **Backend Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: JWT (Access + Refresh Token)
- **Password Hashing**: Bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator + class-transformer
- **Architecture**: SOA (Service-Oriented Architecture)

### Cấu trúc dự án
```
src/
├── common/             # Shared modules (guards, interceptors, filters)
├── config/             # Configuration files
├── database/           # Prisma service và database module
└── services/           # Business services (SOA)
    ├── identity/       # Authentication & User management
    ├── document/       # MOU management (UC002, UC003)
    ├── visa/           # Visa management (UC004, UC005)
    ├── guest/          # International guest management (UC006)
    ├── translation/    # Translation certification (UC007)
    ├── report/         # Statistics & reports (UC008)
    ├── config/         # System configuration (UC009)
    ├── notification/   # Email & notification system
    └── activity/       # Activity logging
```

## 🚀 Cài đặt và Khởi chạy

### 1. Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 12.x
- Redis (optional, for queue)

### 2. Cài đặt dependencies
```bash
cd backend
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pbl6_international_cooperation"

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (for queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 4. Khởi tạo Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 5. Chạy ứng dụng
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## 📚 API Documentation

Sau khi chạy server, truy cập Swagger UI tại:
```
http://localhost:3001/api/docs
```

## 🔐 Authentication & Authorization

### Roles (Vai trò)
- **SYSTEM_ADMIN**: Quản trị hệ thống
- **DEPARTMENT_OFFICER**: Cán bộ phòng KHCN&ĐN  
- **LEADERSHIP**: Lãnh đạo
- **FACULTY_STAFF**: Cán bộ khoa/viện
- **STUDENT**: Sinh viên

### JWT Flow
1. Login → nhận Access Token (15 phút) + Refresh Token (7 ngày)
2. Sử dụng Access Token cho API calls
3. Khi Access Token hết hạn → dùng Refresh Token để lấy token mới
4. Logout → xóa Refresh Token

## 📋 Use Cases được implement

### UC002: Khởi tạo đề xuất MOU
- **Endpoint**: `POST /api/v1/documents`
- **Mô tả**: Tạo đề xuất MOU mới với thông tin đối tác
- **Quyền**: All authenticated users

### UC003: Duyệt MOU  
- **Endpoint**: `PATCH /api/v1/documents/{id}/approve`
- **Mô tả**: Duyệt hoặc từ chối đề xuất MOU
- **Quyền**: DEPARTMENT_OFFICER, LEADERSHIP, SYSTEM_ADMIN

### UC004: Thông báo tự động gia hạn visa
- **Service**: Visa Service + Notification Service
- **Mô tả**: Tự động gửi email nhắc hạn visa trước 30 ngày

### UC005: Gia hạn visa
- **Endpoint**: `POST /api/v1/visas/{id}/extensions`
- **Mô tả**: Tạo yêu cầu gia hạn visa và sinh công văn NA5/NA6

### UC006: Quản lý đoàn vào
- **Endpoint**: `POST /api/v1/guests`
- **Mô tả**: Đăng ký và quản lý thông tin đoàn khách quốc tế

### UC007: Đăng ký xác nhận bản dịch
- **Endpoint**: `POST /api/v1/translations`
- **Mô tả**: Đăng ký xác nhận bản dịch và sinh văn bản xác nhận

### UC008: Thống kê & báo cáo
- **Endpoint**: `GET /api/v1/reports`
- **Mô tả**: Tạo và xuất báo cáo theo nhiều định dạng (Word/PDF/Excel)

### UC009: Quản lý cấu hình hệ thống
- **Endpoint**: `GET/PUT /api/v1/system-config`
- **Mô tả**: Cấu hình tham số hệ thống và phân quyền

## 🗄️ Database Schema

### Core Models
- **User**: Người dùng hệ thống
- **Unit**: Đơn vị/khoa/viện
- **Document**: MOU và văn bản hợp tác
- **Visa**: Thông tin visa
- **VisaExtension**: Gia hạn visa
- **Guest**: Đoàn khách quốc tế
- **GuestMember**: Thành viên trong đoàn
- **Translation**: Yêu cầu xác nhận bản dịch
- **ActivityLog**: Log hoạt động người dùng
- **NotificationLog**: Log thông báo
- **SystemConfig**: Cấu hình hệ thống
- **ReportLog**: Lịch sử báo cáo

## 🔧 Development

### Linting & Formatting
```bash
npm run lint
npm run format
```

### Testing
```bash
npm run test
npm run test:e2e
npm run test:cov
```

### Database Operations
```bash
# Reset database
npm run prisma:migrate:reset

# Deploy migrations to production
npm run prisma:migrate:deploy

# Generate new migration
npx prisma migrate dev --name add_new_feature
```

## 📦 Scripts Available

```json
{
  "build": "nest build",
  "start": "nest start", 
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main",
  "prisma:generate": "prisma generate",
  "prisma:push": "prisma db push",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio"
}
```

## 🚢 Deployment

### Production Environment
1. Set `NODE_ENV=production` in `.env`
2. Configure production database URL
3. Set secure JWT secrets
4. Configure email service
5. Build and deploy:

```bash
npm run build
npm run start:prod
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 📞 Support

- **Email**: phamta@duytan.edu.vn
- **Documentation**: http://localhost:3001/api/docs
- **Repository**: https://github.com/phamta/PBL6

---

**Phát triển bởi**: Nhóm PBL6 - Đại học Bách khoa Đà Nẵng