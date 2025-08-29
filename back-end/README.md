# PBL6 - Hệ thống Quản lý Hợp tác Quốc tế Backend

Backend API cho hệ thống quản lý hợp tác quốc tế được xây dựng với NestJS, TypeORM và PostgreSQL.

## Yêu cầu hệ thống

- Node.js >= 18
- PostgreSQL >= 12
- npm hoặc yarn

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Cấu hình database trong file `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_DATABASE=pbl6_htqt
JWT_SECRET=your-super-secret-jwt-key-here
```

3. Tạo database PostgreSQL:

```sql
CREATE DATABASE pbl6_htqt;
```

4. Chạy migrations để tạo tables:

```bash
npm run typeorm:migration:run
```

## Chạy ứng dụng

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký

### Users

- `GET /api/v1/users` - Lấy danh sách users (Admin, Khoa)
- `GET /api/v1/users/profile` - Lấy thông tin profile
- `PATCH /api/v1/users/profile` - Cập nhật profile
- `POST /api/v1/users` - Tạo user mới (Admin)
- `PATCH /api/v1/users/:id` - Cập nhật user (Admin)
- `DELETE /api/v1/users/:id` - Xóa user (Admin)

### Visa Applications

- `GET /api/v1/visa` - Lấy danh sách đơn visa (Admin, Khoa, Phòng)
- `GET /api/v1/visa/my-applications` - Lấy đơn visa của user
- `POST /api/v1/visa` - Tạo đơn visa mới
- `GET /api/v1/visa/:id` - Xem chi tiết đơn visa
- `PATCH /api/v1/visa/:id` - Cập nhật đơn visa (Admin, Khoa)
- `DELETE /api/v1/visa/:id` - Xóa đơn visa (Admin)

### MOU Management

- `GET /api/v1/mou` - Lấy danh sách MOU
- `POST /api/v1/mou` - Tạo MOU mới (Admin, Khoa)
- `GET /api/v1/mou/:id` - Xem chi tiết MOU
- `PATCH /api/v1/mou/:id` - Cập nhật MOU (Admin, Khoa)
- `DELETE /api/v1/mou/:id` - Xóa MOU (Admin)

### Visitor Management

- `GET /api/v1/visitor` - Lấy danh sách đoàn khách
- `POST /api/v1/visitor` - Tạo đoàn khách mới (Admin, Khoa, Phòng)
- `GET /api/v1/visitor/:id` - Xem chi tiết đoàn khách
- `PATCH /api/v1/visitor/:id` - Cập nhật đoàn khách (Admin, Khoa, Phòng)
- `DELETE /api/v1/visitor/:id` - Xóa đoàn khách (Admin)

### Translation Management

- `GET /api/v1/translation` - Lấy danh sách bản dịch
- `POST /api/v1/translation` - Tạo bản dịch mới (Admin, Khoa, Phòng)
- `GET /api/v1/translation/:id` - Xem chi tiết bản dịch
- `PATCH /api/v1/translation/:id` - Cập nhật bản dịch (Admin, Khoa)
- `DELETE /api/v1/translation/:id` - Xóa bản dịch (Admin)

## Phân quyền

- **Admin**: Toàn quyền truy cập
- **Khoa**: Quản lý các hoạt động trong khoa
- **Phòng**: Quản lý các hoạt động trong phòng
- **User**: Chỉ xem và tạo đơn của mình

## Database Schema

### Users

- id (UUID, PK)
- email (string, unique)
- password (string, hashed)
- fullName (string)
- phone (string, nullable)
- department (string, nullable)
- role (enum: admin, khoa, phong, user)
- status (enum: active, inactive, banned)
- avatar (string, nullable)
- createdAt, updatedAt

### Visa Applications

- id (UUID, PK)
- applicantName (string)
- nationality (string)
- passportNumber (string)
- currentVisaExpiry (date)
- requestedExtensionDate (date)
- purpose (text, nullable)
- status (enum: pending, approved, rejected, processing)
- notes (text, nullable)
- documents (json, nullable)
- userId (UUID, FK to users)
- createdAt, updatedAt

### MOUs

- id (UUID, PK)
- title (string)
- partnerOrganization (string)
- partnerCountry (string)
- description (text)
- signedDate (date)
- expiryDate (date)
- status (enum: draft, active, expired, terminated)
- documents (json, nullable)
- terms (text, nullable)
- createdAt, updatedAt

### Visitors

- id (UUID, PK)
- groupName (string)
- organizationName (string)
- country (string)
- numberOfMembers (int)
- contactPerson (string)
- contactEmail (string)
- contactPhone (string, nullable)
- arrivalDate (date)
- departureDate (date)
- purpose (text)
- status (enum: scheduled, arrived, completed, cancelled)
- itinerary (text, nullable)
- notes (text, nullable)
- membersList (json, nullable)
- createdAt, updatedAt

### Translations

- id (UUID, PK)
- documentTitle (string)
- documentType (enum: certificate, transcript, contract, other)
- originalLanguage (string)
- targetLanguage (string)
- translatedBy (string)
- translationDate (date)
- status (enum: pending, verified, rejected)
- originalDocument (string, nullable)
- translatedDocument (string, nullable)
- notes (text, nullable)
- verifiedBy (string, nullable)
- verificationDate (date, nullable)
- createdAt, updatedAt

## TypeORM Commands

### Tạo migration mới

```bash
npm run typeorm:migration:create src/database/migrations/MigrationName
```

### Generate migration từ entity changes

```bash
npm run typeorm:migration:generate src/database/migrations/MigrationName
```

### Chạy migrations

```bash
npm run typeorm:migration:run
```

### Rollback migration

```bash
npm run typeorm:migration:revert
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
