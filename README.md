# 🏛️ Hệ thống Quản lý Hợp tác Quốc tế - Trường ĐH Bách Khoa Đà Nẵng

## 📋 Tổng quan

Hệ thống quản lý hợp tác quốc tế (HTQT) là một ứng dụng web toàn diện được thiết kế để quản lý các hoạt động hợp tác quốc tế của Trường Đại học Bách Khoa Đà Nẵng, bao gồm:

- 🤝 **Quản lý MOU** (Memorandum of Understanding)
- 🛂 **Quản lý đơn xin Visa**
- 👥 **Quản lý nhóm khách tham quan**
- 📄 **Quản lý yêu cầu dịch thuật**
- 🔄 **Quản lý gia hạn visa**
- 👤 **Quản lý người dùng và phân quyền**

## 🏗️ Kiến trúc hệ thống

```
pbl6_ql_htqt/
├── back-end/                 # NestJS Backend API
│   ├── src/
│   │   ├── modules/         # Các module chức năng
│   │   │   ├── auth/        # Xác thực & phân quyền
│   │   │   ├── user/        # Quản lý người dùng
│   │   │   ├── mou/         # Quản lý MOU
│   │   │   ├── visa/        # Quản lý visa
│   │   │   ├── visitor/     # Quản lý khách tham quan
│   │   │   ├── translation/ # Quản lý dịch thuật
│   │   │   └── ...
│   │   ├── common/          # Shared utilities
│   │   ├── config/          # Cấu hình
│   │   └── database/        # Database migrations
│   ├── scripts/             # Utility scripts
│   └── uploads/             # File uploads
├── front-end/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router (Next.js 15)
│   │   ├── components/     # React Components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities & API clients
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
└── README.md               # Tài liệu này
```

## 🛠️ Công nghệ sử dụng

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

### Frontend

- **Framework**: Next.js 15 (React)
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: React Context
- **Language**: TypeScript

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **PostgreSQL**: >= 14.0
- **Git**: Latest version

## 🚀 Hướng dẫn cài đặt

### 1. Clone Repository

```bash
git clone https://github.com/phamta/PBL6.git
cd pbl6_ql_htqt
```

### 2. Cài đặt Database (PostgreSQL)

#### Windows:

1. Tải và cài đặt PostgreSQL từ [postgresql.org](https://www.postgresql.org/download/windows/)
2. Tạo database mới:

```sql
-- Kết nối PostgreSQL với user postgres
psql -U postgres

-- Tạo database
CREATE DATABASE ql_htqt;

-- Tạo user cho ứng dụng (tùy chọn)
CREATE USER htqt_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ql_htqt TO htqt_user;

-- Thoát psql
\q
```

#### macOS/Linux:

```bash
# Cài đặt PostgreSQL
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Tạo database
sudo -u postgres createdb ql_htqt
```

### 3. Cấu hình Backend

```bash
# Di chuyển vào thư mục backend
cd back-end

# Cài đặt dependencies
npm install

# Tạo file cấu hình
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Environment
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_DATABASE=ql_htqt

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# API Configuration
API_PREFIX=api/v1
```

### 4. Khởi tạo Database Schema

```bash
# Trong thư mục back-end
npm run build

# Chạy migrations (nếu có)
npm run migration:run

# Hoặc sync schema trực tiếp (development only)
npm run start:dev
```

### 5. Thiết lập dữ liệu ban đầu

Chạy script thiết lập admin và roles:

```bash
# Trong thư mục back-end
node scripts/setup-admin.ts
```

Hoặc chạy SQL trực tiếp:

```sql
-- Kết nối database ql_htqt
\c ql_htqt;

-- Tạo roles
INSERT INTO role (role_id, role_name) VALUES
  (gen_random_uuid(), 'admin'),
  (gen_random_uuid(), 'manager'),
  (gen_random_uuid(), 'specialist'),
  (gen_random_uuid(), 'user'),
  (gen_random_uuid(), 'viewer');

-- Tạo user admin
INSERT INTO "user" (user_id, username, email, password_hash, full_name, phone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@htqt.edu.vn',
   '$2a$10$hashed_password', 'Nguyễn Văn Admin', '0901234567');

-- Gán role admin cho user admin
INSERT INTO user_role (user_id, role_id)
SELECT '11111111-1111-1111-1111-111111111111', role_id
FROM role WHERE role_name = 'admin';
```

### 6. Cấu hình Frontend

```bash
# Di chuyển vào thư mục frontend
cd ../front-end

# Cài đặt dependencies
npm install

# Tạo file cấu hình (nếu cần)
cp .env.local.example .env.local
```

Chỉnh sửa `.env.local` (nếu có):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## 🏃 Chạy ứng dụng

### Development Mode

#### Backend (Terminal 1):

```bash
cd back-end
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3001`

#### Frontend (Terminal 2):

```bash
cd front-end
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Production Mode

#### Build và chạy Backend:

```bash
cd back-end
npm run build
npm run start:prod
```

#### Build và chạy Frontend:

```bash
cd front-end
npm run build
npm start
```

## 🔑 Thông tin đăng nhập mặc định

- **URL**: http://localhost:3000/login
- **Email**: admin@htqt.edu.vn
- **Password**: 123456

## 🗃️ Cấu trúc Database

### Bảng chính:

1. **user** - Thông tin người dùng
2. **role** - Các vai trò trong hệ thống
3. **user_role** - Liên kết user và role
4. **mou** - Thông tin MOU
5. **visa_application** - Đơn xin visa
6. **visitor_group** - Nhóm khách tham quan
7. **translation_request** - Yêu cầu dịch thuật
8. **visa_extension** - Gia hạn visa

### ERD Schema:

```
user ||--o{ user_role }o--|| role
user ||--o{ mou
user ||--o{ visa_application
user ||--o{ visitor_group
user ||--o{ translation_request
user ||--o{ visa_extension
```

## 🔧 Scripts hữu ích

### Backend:

```bash
# Development
npm run start:dev          # Chạy với hot reload
npm run start:debug        # Chạy với debug mode

# Build & Production
npm run build              # Build ứng dụng
npm run start:prod         # Chạy production

# Database
npm run migration:generate # Tạo migration mới
npm run migration:run      # Chạy migrations
npm run migration:revert   # Rollback migration

# Testing
npm run test               # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Test coverage

# Utilities
node scripts/setup-admin.ts     # Tạo admin user
node scripts/check-users-roles.js # Kiểm tra users và roles
```

### Frontend:

```bash
# Development
npm run dev                # Development server
npm run build              # Build production
npm run start              # Start production server
npm run lint               # ESLint check
npm run type-check         # TypeScript check
```

## 🎯 Tính năng chính

### 1. Quản lý người dùng

- ✅ Xác thực JWT
- ✅ Phân quyền theo role (Admin, Manager, Specialist, User, Viewer)
- ✅ CRUD operations
- ✅ Profile management

### 2. Quản lý MOU

- ✅ Tạo, chỉnh sửa, xóa MOU
- ✅ Upload tài liệu
- ✅ Workflow phê duyệt
- ✅ Theo dõi trạng thái

### 3. Quản lý Visa

- ✅ Đơn xin visa
- ✅ Gia hạn visa
- ✅ Tracking timeline
- ✅ Document management

### 4. Quản lý dịch thuật

- ✅ Yêu cầu dịch thuật
- ✅ Quản lý ngôn ngữ
- ✅ Timeline tracking
- ✅ File management

### 5. Dashboard & Reports

- ✅ Thống kê tổng quan
- ✅ Charts và graphs
- ✅ Export data
- ✅ Real-time updates

## 🐛 Troubleshooting

### Lỗi thường gặp:

#### 1. Backend không kết nối được database:

```bash
# Kiểm tra PostgreSQL đang chạy
# Windows
net start postgresql-x64-14

# macOS/Linux
sudo service postgresql start
# hoặc
brew services start postgresql

# Kiểm tra connection
psql -U postgres -d ql_htqt -c "SELECT 1;"
```

#### 2. Port đã được sử dụng:

```bash
# Kiểm tra port 3001 (backend)
netstat -ano | findstr :3001
# Kill process nếu cần
taskkill /PID <PID> /F

# Kiểm tra port 3000 (frontend)
netstat -ano | findstr :3000
```

#### 3. Module không tìm thấy:

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Database schema lỗi:

```bash
# Reset database (CHÚ Ý: Sẽ xóa toàn bộ dữ liệu)
dropdb ql_htqt
createdb ql_htqt
npm run start:dev
```

## 📚 API Documentation

API documentation được tự động tạo bởi Swagger/OpenAPI tại:

- **URL**: http://localhost:3001/api/docs (khi backend chạy)

### Các endpoint chính:

```
POST   /api/v1/auth/login           # Đăng nhập
POST   /api/v1/auth/register        # Đăng ký
GET    /api/v1/users                # Lấy danh sách users
POST   /api/v1/users                # Tạo user mới
GET    /api/v1/mou                  # Lấy danh sách MOU
POST   /api/v1/mou                  # Tạo MOU mới
GET    /api/v1/visa                 # Lấy danh sách visa applications
POST   /api/v1/visa                 # Tạo visa application
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới [MIT License](LICENSE).

## 👥 Team

- **Developer**: Nhóm PBL6
- **Institution**: Trường ĐH Bách Khoa Đà Nẵng
- **Contact**: admin@htqt.edu.vn

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra [Issues](https://github.com/phamta/PBL6/issues)
2. Tạo issue mới nếu chưa có
3. Liên hệ team qua email: admin@htqt.edu.vn

---

## 🔗 API Integration

### ✅ Frontend-Backend đã được tích hợp hoàn chỉnh!

Hệ thống đã có sẵn infrastructure để gọi API từ frontend:

- **API Client**: Axios với auto token refresh
- **Type Safety**: Full TypeScript support
- **Auth Context**: Global authentication state
- **Custom Hooks**: Reusable data fetching hooks
- **Examples**: 15+ ví dụ thực tế

#### Quick Start API:

```tsx
// 1. Sử dụng Auth Context
import { useAuth } from "@/contexts/AuthContext";
const { user, login, logout } = useAuth();

// 2. Gọi API
import * as documentsApi from "@/lib/api/documents";
const documents = await documentsApi.getDocuments();

// 3. Sử dụng Hooks
import { usePaginatedFetch } from "@/hooks/useAPI";
const { data, loading, setPage } = usePaginatedFetch(documentsApi.getDocuments);
```

#### Tài liệu chi tiết:

- 📖 [API Integration Guide](./frontend/API_INTEGRATION_GUIDE.md) - Hướng dẫn chi tiết
- 📋 [Integration Summary](./INTEGRATION_SUMMARY.md) - Tổng quan
- ⚡ [Quick Start](./QUICK_START.md) - Bắt đầu nhanh trong 5 phút
- ✅ [Checklist](./CHECKLIST.md) - Danh sách đầy đủ

#### Test API:

Mở `http://localhost:3000/api-test` để test các API calls

---

_Cập nhật lần cuối: August 31, 2025_
