# International Cooperation Management System

Hệ thống quản lý hợp tác quốc tế cho trường đại học.

## Tính năng chính

- **Quản lý người dùng**: Đăng nhập, xác thực JWT
- **Quản lý MOU**: Tạo và theo dõi các bản ghi nhớ hợp tác
- **Quản lý Visa**: Xử lý hồ sơ gia hạn visa
- **Quản lý khách thăm**: Đăng ký và theo dõi khách quốc tế
- **Dịch thuật**: Quản lý yêu cầu dịch thuật tài liệu

## Cấu trúc dự án

```
pbl6_ql_htqt/
├── back-end/          # NestJS API Server
├── front-end/         # Next.js 14 Frontend
└── README.md
```

## Công nghệ sử dụng

### Backend (NestJS)

- **Framework**: NestJS với TypeScript
- **Database**: PostgreSQL với TypeORM
- **Authentication**: JWT với Passport
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt cho mã hóa mật khẩu

### Frontend (Next.js)

- **Framework**: Next.js 14 với App Router
- **UI**: Tailwind CSS + Shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Axios với interceptors
- **Authentication**: JWT cookies với middleware

## Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
# Backend
cd back-end
npm install

# Frontend
cd ../front-end
npm install
```

### 2. Cấu hình Database

Tạo database PostgreSQL:

```sql
CREATE DATABASE pbl6_htqt;
```

Tạo file `.env` trong thư mục `back-end`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=pbl6_htqt

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# App
PORT=3001
```

### 3. Chạy ứng dụng

```bash
# Chạy backend (terminal 1)
cd back-end
npm run start:dev

# Chạy frontend (terminal 2)
cd front-end
npm run dev
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api (Swagger)

## Tài khoản mặc định

Sau khi backend khởi động lần đầu, hệ thống sẽ tự động tạo tài khoản admin:

```
Email: admin@university.edu.vn
Password: admin123
```

## API Endpoints

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký (chỉ admin)

### MOU Management

- `GET /mou` - Lấy danh sách MOU
- `POST /mou` - Tạo MOU mới
- `PUT /mou/:id` - Cập nhật MOU
- `DELETE /mou/:id` - Xóa MOU

### Visa Management

- `GET /visa` - Lấy danh sách hồ sơ visa
- `POST /visa` - Tạo hồ sơ visa mới
- `PUT /visa/:id` - Cập nhật hồ sơ visa

### Visitor Management

- `GET /visitor` - Lấy danh sách khách thăm
- `POST /visitor` - Đăng ký khách thăm mới
- `PUT /visitor/:id` - Cập nhật thông tin khách thăm

### Translation Management

- `GET /translation` - Lấy danh sách yêu cầu dịch thuật
- `POST /translation` - Tạo yêu cầu dịch thuật mới
- `PUT /translation/:id` - Cập nhật yêu cầu dịch thuật

## Cấu trúc Database

### Bảng Users

- id, email, username, password, role, createdAt, updatedAt

### Bảng MOU

- id, title, partnerOrganization, description, startDate, endDate, status, createdAt, updatedAt

### Bảng VisaApplication

- id, applicantName, nationality, passportNumber, currentVisaExpiry, requestedExtensionDate, purpose, status, createdAt, updatedAt

### Bảng Visitor

- id, fullName, nationality, passportNumber, purpose, visitDate, duration, hostContactPerson, accommodationDetails, createdAt, updatedAt

### Bảng Translation

- id, documentTitle, sourceLanguage, targetLanguage, documentType, requestDate, deadline, requesterName, requesterContact, priority, status, notes, createdAt, updatedAt

## Tính năng bảo mật

- **JWT Authentication**: Xác thực dựa trên token
- **Password Hashing**: Mã hóa mật khẩu với bcrypt
- **Route Protection**: Middleware bảo vệ các route quan trọng
- **CORS**: Cấu hình CORS cho bảo mật cross-origin
- **Validation**: Validate dữ liệu đầu vào ở cả frontend và backend

## Development Notes

- Backend sử dụng TypeORM với auto-synchronization (chỉ trong development)
- Frontend sử dụng Tailwind CSS với responsive design
- Tất cả các component đều typed với TypeScript
- API client có auto-retry và error handling
- Authentication state được quản lý qua cookies với middleware

## Contributing

1. Clone repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
