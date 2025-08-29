# Hướng dẫn cài đặt PostgreSQL và setup Database

## 1. Cài đặt PostgreSQL

### Windows:

1. Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Chạy file installer
3. Thiết lập mật khẩu cho user `postgres`
4. Ghi nhớ port (mặc định 5432)

### macOS:

```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Tạo Database

### Cách 1: Sử dụng psql command line

```bash
# Đăng nhập vào PostgreSQL
psql -U postgres -h localhost

# Tạo database
CREATE DATABASE pbl6_htqt;

# Thoát
\q
```

### Cách 2: Sử dụng pgAdmin

1. Mở pgAdmin
2. Kết nối đến server PostgreSQL
3. Right-click vào "Databases" → "Create" → "Database..."
4. Nhập tên: `pbl6_htqt`
5. Click "Save"

## 3. Cấu hình Environment Variables

Cập nhật file `.env` trong thư mục `back-end`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password_here
DB_DATABASE=pbl6_htqt

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
```

## 4. Chạy Migrations

Sau khi đã tạo database và cấu hình .env:

```bash
# Chạy migrations để tạo tables
npm run typeorm:migration:run

# Kiểm tra trạng thái migrations
npm run typeorm migration:show
```

## 5. Khởi động ứng dụng

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 6. Kiểm tra kết nối

Sau khi khởi động thành công, bạn sẽ thấy:

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [InstanceLoader] DatabaseModule dependencies initialized
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
Application is running on: http://localhost:3000/api/v1
```

## 7. Test API

### Đăng ký user mới:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456",
    "fullName": "Admin User",
    "department": "IT"
  }'
```

### Đăng nhập:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456"
  }'
```

## 8. Troubleshooting

### Lỗi: "database does not exist"

- Kiểm tra tên database trong .env
- Đảm bảo đã tạo database `pbl6_htqt`

### Lỗi: "password authentication failed"

- Kiểm tra username/password trong .env
- Đảm bảo user postgres có quyền truy cập

### Lỗi: "ECONNREFUSED"

- Kiểm tra PostgreSQL service đã chạy chưa
- Kiểm tra host và port trong .env

### Lỗi migration:

- Đảm bảo database trống hoặc không có conflicts
- Chạy `npm run typeorm:migration:revert` để rollback nếu cần
