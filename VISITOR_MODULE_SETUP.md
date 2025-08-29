# Module Quản lý Đoàn Vào - Hướng dẫn cài đặt

## Backend Setup (NestJS)

### 1. Cài đặt các packages cần thiết

```bash
cd back-end
npm install exceljs pdfkit multer @types/multer
npm install @nestjs/typeorm typeorm
```

### 2. Cập nhật app.module.ts

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VisitorModule } from "./modules/visitor.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ... existing config
    }),
    VisitorModule,
  ],
})
export class AppModule {}
```

### 3. Database Migration

Tạo migration để tạo bảng visitors:

```sql
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  passport_number VARCHAR(50) UNIQUE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  date_of_birth DATE NOT NULL,
  position VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  arrival_date_time TIMESTAMP NOT NULL,
  departure_date_time TIMESTAMP NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  purpose_details TEXT,
  inviting_unit VARCHAR(255) NOT NULL,
  passport_scan_path VARCHAR(500),
  document_path VARCHAR(500),
  visitor_code VARCHAR(50) NOT NULL,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Tạo thư mục uploads

```bash
mkdir uploads
mkdir uploads/visitors
```

## Frontend Setup (Next.js)

### 1. Cài đặt các packages cần thiết

```bash
cd front-end
npm install axios
npm install @types/file-saver
```

### 2. Cập nhật environment variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Cập nhật navigation

Thêm vào sidebar navigation:

```typescript
{
  title: "Quản lý Khách Quốc Tế",
  href: "/dashboard/visitor",
  icon: Users,
}
```

## Quyền và Role

### Backend Role Configuration

1. **Người dùng cơ sở (USER)**:

   - Chỉ xem/thêm/sửa/xóa khách của đơn vị mình
   - userRole !== 'KHCN_DN' trong service

2. **Phòng KHCN&ĐN (KHCN_DN)**:
   - Xem toàn bộ khách
   - Xuất báo cáo toàn trường
   - userRole === 'KHCN_DN' trong service

### Frontend Permission

Tạo hook kiểm tra quyền:

```typescript
// hooks/usePermissions.ts
export const useVisitorPermissions = () => {
  const { user } = useAuth();

  return {
    canViewAll: user?.role === "KHCN_DN",
    canExportAll: user?.role === "KHCN_DN",
    userUnit: user?.unit || "",
  };
};
```

## API Endpoints

```
POST   /visitor                 - Tạo khách mới
GET    /visitor                 - Lấy danh sách khách (có filter)
GET    /visitor/:id             - Lấy thông tin khách
PUT    /visitor/:id             - Cập nhật khách
DELETE /visitor/:id             - Xóa khách
GET    /visitor/report          - Xuất báo cáo
```

## Features Checklist

### Backend ✅

- [x] Entity và Database schema
- [x] DTOs với validation
- [x] Service với logic phân quyền
- [x] Controller với file upload
- [x] Xuất báo cáo Excel/PDF/Word
- [x] Tìm kiếm và lọc dữ liệu
- [x] Pagination

### Frontend ✅

- [x] API client với TypeScript
- [x] Form thêm/sửa khách
- [x] Danh sách khách với filter
- [x] Chi tiết khách
- [x] Upload file scan hộ chiếu
- [x] Xuất báo cáo nhiều định dạng
- [x] Responsive design

### Security & Permissions ✅

- [x] Role-based access control
- [x] Unit-based data filtering
- [x] File upload validation
- [x] Input validation và sanitization

## Testing

### Backend Testing

```bash
# Test API endpoints
curl -X POST http://localhost:3001/visitor \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "nationality": "USA",
    "passportNumber": "A12345678",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "position": "Professor",
    "organization": "Harvard University",
    "email": "john@harvard.edu",
    "phoneNumber": "+1234567890",
    "arrivalDateTime": "2024-01-15T10:00:00Z",
    "departureDateTime": "2024-01-20T15:00:00Z",
    "purpose": "Academic Exchange",
    "invitingUnit": "IT Department"
  }'
```

### Frontend Testing

1. Truy cập `/dashboard/visitor`
2. Test thêm khách mới
3. Test upload file
4. Test filter và search
5. Test xuất báo cáo
6. Test phân quyền theo role

## Deployment Notes

1. **Database**: Đảm bảo PostgreSQL có extension uuid-ossp
2. **File Storage**: Cấu hình thư mục uploads với quyền write
3. **Environment**: Set đúng API_URL cho production
4. **CORS**: Cấu hình CORS cho domain frontend
5. **Auth**: Tích hợp với hệ thống auth hiện tại

## Troubleshooting

### Lỗi thường gặp:

1. **File upload fails**: Kiểm tra quyền thư mục uploads
2. **CORS error**: Cấu hình CORS trong backend
3. **Database connection**: Kiểm tra connection string
4. **Permission denied**: Kiểm tra user role và unit matching
