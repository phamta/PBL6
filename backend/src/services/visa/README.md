# Visa Service Documentation

## Tổng Quan

Visa Service là một hệ thống quản lý visa toàn diện được thiết kế theo kiến trúc SOA (Service-Oriented Architecture) để hỗ trợ các chức năng quản lý visa và gia hạn visa tại các tổ chức giáo dục.

## Các Chức Năng Chính

### UC001: Tạo Hồ Sơ Visa

- **Vai trò**: FACULTY_STAFF
- **Mô tả**: Cán bộ khoa/viện có thể tạo hồ sơ visa mới cho khách quốc tế
- **Endpoint**: `POST /visas`

### UC002: Quản Lý Danh Sách Visa

- **Vai trò**: FACULTY_STAFF, DEPARTMENT_OFFICER, LEADERSHIP, SYSTEM_ADMIN
- **Mô tả**: Xem danh sách visa với tính năng tìm kiếm, lọc và phân trang
- **Endpoint**: `GET /visas`

### UC003: Xem Chi Tiết Visa

- **Vai trò**: FACULTY_STAFF, DEPARTMENT_OFFICER, LEADERSHIP, SYSTEM_ADMIN
- **Mô tả**: Xem thông tin chi tiết visa bao gồm lịch sử gia hạn
- **Endpoint**: `GET /visas/:id`

### UC004: Hệ Thống Nhắc Nhở Tự Động

- **Vai trò**: Hệ thống (Scheduled Task)
- **Mô tả**: Tự động kiểm tra và gửi thông báo cho visa sắp hết hạn
- **Endpoint**: `GET /visas/expiring`
- **Lịch trình**:
  - Kiểm tra hàng ngày lúc 9:00 AM (visa hết hạn trong 30 ngày)
  - Kiểm tra khẩn cấp thứ 2 hàng tuần lúc 8:00 AM (visa hết hạn trong 7 ngày)

### UC005: Quy Trình Gia Hạn Visa

#### Bước 1: Tạo Yêu Cầu Gia Hạn

- **Vai trò**: DEPARTMENT_OFFICER
- **Mô tả**: Cán bộ phòng có thể tạo yêu cầu gia hạn visa
- **Endpoint**: `POST /visas/:id/extend`

#### Bước 2: Phê Duyệt Gia Hạn

- **Vai trò**: LEADERSHIP
- **Mô tả**: Lãnh đạo phê duyệt hoặc từ chối yêu cầu gia hạn
- **Endpoint**: `POST /visas/extensions/:extensionId/approve`
- **Tự động**: Sinh công văn NA5/NA6 khi được phê duyệt

### UC006: Cập Nhật Thông Tin Visa

- **Vai trò**: FACULTY_STAFF (visa của mình), DEPARTMENT_OFFICER, LEADERSHIP
- **Mô tả**: Cập nhật thông tin visa
- **Endpoint**: `PATCH /visas/:id`

### UC007: Hủy Visa

- **Vai trò**: FACULTY_STAFF (visa của mình), LEADERSHIP
- **Mô tả**: Hủy visa (soft delete)
- **Endpoint**: `DELETE /visas/:id`

### UC008: Thống Kê và Báo Cáo

- **Vai trò**: DEPARTMENT_OFFICER, LEADERSHIP, SYSTEM_ADMIN
- **Mô tả**: Xem thống kê visa và báo cáo
- **Endpoint**: `GET /visas/statistics`

## Cấu Trúc Dữ Liệu

### Visa Model

```typescript
{
  id: string;
  holderName: string;
  holderCountry: string;
  passportNumber: string;
  visaNumber: string;
  issueDate: DateTime;
  expirationDate: DateTime;
  purpose: string;
  sponsorUnit: string;
  status: VisaStatus;
  attachments: string[];
  createdById: string;
  approvedById?: string;
  approvedAt?: DateTime;
  reminderSent: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Visa Status Enum

- `ACTIVE`: Đang hiệu lực
- `EXPIRING`: Sắp hết hạn
- `EXPIRED`: Đã hết hạn
- `EXTENDED`: Đã gia hạn
- `CANCELLED`: Đã hủy

### Visa Extension Model

```typescript
{
  id: string;
  visaId: string;
  newExpirationDate: DateTime;
  reason: string;
  officialLetter?: string;
  status: string; // PENDING, APPROVED, REJECTED
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

## API Endpoints

### Tạo Visa Mới

```bash
POST /visas
Content-Type: application/json
Authorization: Bearer <token>

{
  "holderName": "John Doe",
  "holderCountry": "United States",
  "passportNumber": "A12345678",
  "visaNumber": "VN2024001234",
  "issueDate": "2024-01-15",
  "expirationDate": "2024-12-31",
  "purpose": "Academic research collaboration",
  "sponsorUnit": "University of Technology Ho Chi Minh City",
  "attachments": ["visa-application.pdf", "passport-copy.pdf"]
}
```

### Lấy Danh Sách Visa

```bash
GET /visas?search=John&status=ACTIVE&page=1&limit=10&sortBy=expirationDate&sortOrder=asc
Authorization: Bearer <token>
```

### Tạo Yêu Cầu Gia Hạn

```bash
POST /visas/:visaId/extend
Content-Type: application/json
Authorization: Bearer <token>

{
  "newExpirationDate": "2025-06-30",
  "reason": "Continuation of academic research project requiring additional 6 months"
}
```

### Phê Duyệt Gia Hạn

```bash
POST /visas/extensions/:extensionId/approve
Content-Type: application/json
Authorization: Bearer <token>

{
  "action": "APPROVE",
  "comments": "All documentation verified. Approved for extension."
}
```

## Event System

Visa Service phát ra các events sau:

- `visa.created`: Khi tạo visa mới
- `visa.updated`: Khi cập nhật visa
- `visa.cancelled`: Khi hủy visa
- `visa.expiring`: Khi phát hiện visa sắp hết hạn
- `visa.extension.requested`: Khi tạo yêu cầu gia hạn
- `visa.extension.approved`: Khi phê duyệt gia hạn
- `visa.extension.rejected`: Khi từ chối gia hạn

## Scheduled Tasks

### Kiểm Tra Visa Hết Hạn Hàng Ngày

- **Thời gian**: 9:00 AM mỗi ngày
- **Chức năng**: Kiểm tra visa hết hạn trong 30 ngày
- **Cron**: `0 9 * * *`

### Kiểm Tra Visa Hết Hạn Khẩn Cấp

- **Thời gian**: 8:00 AM thứ 2 hàng tuần
- **Chức năng**: Kiểm tra visa hết hạn trong 7 ngày
- **Cron**: `0 8 * * MON`

### Báo Cáo Thống Kê Hàng Tháng

- **Thời gian**: 10:00 AM ngày 1 mỗi tháng
- **Chức năng**: Sinh báo cáo thống kê visa
- **Cron**: `0 10 1 * *`

## Bảo Mật và Quyền Hạn

### Role-based Access Control (RBAC)

- **FACULTY_STAFF**: Tạo visa, cập nhật visa của mình, hủy visa của mình
- **DEPARTMENT_OFFICER**: Tạo yêu cầu gia hạn, xem tất cả visa, cập nhật tất cả visa
- **LEADERSHIP**: Phê duyệt gia hạn, xem tất cả visa, hủy tất cả visa
- **SYSTEM_ADMIN**: Toàn quyền truy cập

### JWT Authentication

Tất cả endpoints đều yêu cầu JWT token hợp lệ trong header:

```
Authorization: Bearer <jwt_token>
```

## Validation Rules

### CreateVisaDto

- `holderName`: 2-100 ký tự
- `holderCountry`: 2-50 ký tự
- `passportNumber`: 6-20 ký tự, chỉ chữ cái và số
- `visaNumber`: 8-20 ký tự, chỉ chữ cái và số, duy nhất
- `issueDate`: Định dạng ISO date, không được trong tương lai
- `expirationDate`: Định dạng ISO date, phải sau issueDate
- `purpose`: 10-500 ký tự
- `sponsorUnit`: 2-100 ký tự

### ExtendVisaDto

- `newExpirationDate`: Phải sau ngày hết hạn hiện tại và trong tương lai
- `reason`: 10-500 ký tự

## Error Handling

### Common Error Codes

- `400 Bad Request`: Dữ liệu không hợp lệ
- `401 Unauthorized`: Không có token hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy tài nguyên
- `409 Conflict`: Trùng lặp dữ liệu (visa number)

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "visaNumber",
      "message": "Visa number must be between 8 and 20 characters"
    }
  ]
}
```

## Testing

### Unit Tests

- `visa.service.spec.ts`: Test logic nghiệp vụ
- Kiểm tra các use case UC004, UC005
- Mock PrismaService và EventEmitter2

### Integration Tests

- `visa.integration.spec.ts`: Test toàn bộ workflow
- Kiểm tra API endpoints
- Validate role-based access control

### Chạy Tests

```bash
# Unit tests
npm run test visa.service.spec.ts

# Integration tests
npm run test:e2e visa.integration.spec.ts

# All visa tests
npm run test visa
```

## Deployment

### Dependencies

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/event-emitter": "^2.0.0",
  "@nestjs/schedule": "^4.0.0",
  "@prisma/client": "^5.0.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0"
}
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/visa_db"
JWT_SECRET="your-jwt-secret"
```

### Module Integration

Để tích hợp Visa Service vào ứng dụng chính:

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { VisaModule } from "./services/visa/visa.module";

@Module({
  imports: [
    VisaModule,
    // other modules
  ],
})
export class AppModule {}
```

## Monitoring và Logging

### Log Levels

- **INFO**: Thông tin chung về hoạt động
- **WARN**: Cảnh báo về visa sắp hết hạn
- **ERROR**: Lỗi trong quá trình xử lý
- **DEBUG**: Chi tiết debug (chỉ trong development)

### Health Checks

- Database connection
- EventEmitter status
- Scheduler service status

## Performance Optimization

### Database Indexes

Đảm bảo có indexes cho:

- `visaNumber` (unique)
- `expirationDate` (cho UC004)
- `status` (cho filtering)
- `createdById` (cho authorization)

### Caching

- Redis cache cho thống kê
- In-memory cache cho lookup tables

### Pagination

- Default: 10 items per page
- Maximum: 100 items per page
- Use offset-based pagination

## Troubleshooting

### Common Issues

1. **Scheduler không chạy**
   - Kiểm tra `ScheduleModule.forRoot()` trong module
   - Verify timezone settings

2. **Events không được emit**
   - Kiểm tra `EventEmitterModule.forRoot()` configuration
   - Verify listener registration

3. **Authorization errors**
   - Kiểm tra JWT token validity
   - Verify role assignments

4. **Database connection issues**
   - Kiểm tra DATABASE_URL
   - Verify Prisma client generation

### Debug Mode

```typescript
// Enable debug logging
const app = await NestFactory.create(AppModule, {
  logger: ["log", "error", "warn", "debug", "verbose"],
});
```
