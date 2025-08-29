# Module Xác Nhận Bản Dịch - Tài Liệu Tổng Quan

## 📋 Mô Tả Tổng Quan

Module **Xác Nhận Bản Dịch** là một hệ thống quản lý quy trình xác nhận bản dịch tài liệu, cho phép các đơn vị nộp yêu cầu xác nhận bản dịch và KHCN&ĐN xem xét, phê duyệt.

## 🎯 Chức Năng Chính

### Cho Người Dùng (User):

1. **Tạo yêu cầu xác nhận bản dịch mới**

   - Nhập thông tin tài liệu gốc
   - Chọn loại tài liệu và cặp ngôn ngữ
   - Tải lên tài liệu gốc và bản dịch (nếu có)
   - Mô tả mục đích sử dụng

2. **Theo dõi trạng thái yêu cầu**

   - Xem danh sách yêu cầu đã nộp
   - Theo dõi tiến trình xử lý
   - Nhận thông báo khi có cập nhật

3. **Chỉnh sửa yêu cầu**

   - Cập nhật thông tin khi ở trạng thái PENDING hoặc NEEDS_REVISION
   - Bổ sung tài liệu thiếu

4. **Tải xuống tài liệu**
   - Tải về tài liệu gốc đã nộp
   - Tải về giấy xác nhận khi được duyệt

### Cho KHCN&ĐN (Admin):

1. **Xem xét và duyệt yêu cầu**

   - Xem tất cả yêu cầu từ các đơn vị
   - Bắt đầu quá trình xem xét
   - Phê duyệt hoặc từ chối yêu cầu
   - Yêu cầu chỉnh sửa với ghi chú cụ thể

2. **Quản lý quy trình phê duyệt**

   - Theo dõi trạng thái tất cả yêu cầu
   - Lọc và tìm kiếm theo nhiều tiêu chí
   - Xem chi tiết và lịch sử của từng yêu cầu

3. **Tạo báo cáo thống kê**
   - Xuất báo cáo Excel/PDF
   - Thống kê theo thời gian, đơn vị, loại tài liệu
   - Phân tích xu hướng và hiệu suất

## 🏗️ Kiến Trúc Hệ Thống

### Backend (NestJS + TypeORM + PostgreSQL)

#### 📁 Cấu Trúc Files:

```
back-end/src/
├── entities/
│   └── translation-request.entity.ts       # Entity chính với enums
├── dto/translation-request/
│   ├── create-translation-request.dto.ts   # DTO tạo mới
│   ├── update-translation-request.dto.ts   # DTO cập nhật
│   ├── review-translation-request.dto.ts   # DTO xem xét
│   └── translation-report.dto.ts           # DTO báo cáo
├── services/
│   └── translation-request.service.ts      # Business logic
├── controllers/
│   └── translation-request.controller.ts   # REST API endpoints
└── modules/
    └── translation-request.module.ts       # Module configuration
```

#### 🗃️ Database Schema:

- **Bảng chính**: `translation_requests`
- **Quan hệ**: Many-to-One với `users` (submittedBy, reviewedBy)
- **Enums**:
  - `TranslationStatus`: PENDING → UNDER_REVIEW → APPROVED/REJECTED/NEEDS_REVISION
  - `DocumentType`: 20+ loại tài liệu (học thuật, pháp lý, kinh doanh...)
  - `LanguagePair`: 16 cặp ngôn ngữ phổ biến

#### 🔗 API Endpoints:

```
GET    /translation-requests              # Danh sách (có phân trang & filter)
POST   /translation-requests              # Tạo mới
GET    /translation-requests/:id          # Chi tiết
PATCH  /translation-requests/:id          # Cập nhật
POST   /translation-requests/:id/start-review     # Bắt đầu xem xét
POST   /translation-requests/:id/approve          # Phê duyệt
POST   /translation-requests/:id/reject           # Từ chối
POST   /translation-requests/:id/request-revision # Yêu cầu chỉnh sửa
GET    /translation-requests/statistics   # Thống kê dashboard
POST   /translation-requests/reports/generate     # Tạo báo cáo
GET    /translation-requests/:id/download/original    # Tải tài liệu gốc
GET    /translation-requests/:id/download/translated  # Tải bản dịch
GET    /translation-requests/:id/download/confirmation # Tải giấy xác nhận
```

### Frontend (Next.js 14 + TypeScript + Tailwind + Shadcn/ui)

#### 📁 Cấu Trúc Files:

```
front-end/
├── lib/
│   ├── types/translation-request.ts        # TypeScript types & enums
│   └── api/translation-request.ts          # API client
├── components/translation-request/
│   ├── TranslationRequestForm.tsx          # Form tạo/sửa
│   ├── TranslationRequestList.tsx          # Danh sách + filter
│   └── TranslationRequestDetail.tsx        # Chi tiết + actions
└── app/translation-requests/
    ├── page.tsx                            # Trang chính
    ├── dashboard/page.tsx                  # Dashboard thống kê
    └── reports/page.tsx                    # Trang tạo báo cáo
```

#### 🎨 UI Components:

- **TranslationRequestForm**: Form tạo yêu cầu với validation
- **TranslationRequestList**: Bảng danh sách với bộ lọc & phân trang
- **TranslationRequestDetail**: Xem chi tiết + các action admin
- **Dashboard**: Thống kê tổng quan với cards
- **Reports**: Form tạo báo cáo với nhiều tùy chọn

## 📊 Quy Trình Nghiệp Vụ

### 1. Quy Trình Cơ Bản:

```
1. User tạo yêu cầu → PENDING
2. KHCN&ĐN bắt đầu xem xét → UNDER_REVIEW
3. KHCN&ĐN ra quyết định:
   - Duyệt → APPROVED (tạo giấy xác nhận)
   - Từ chối → REJECTED (với lý do)
   - Yêu cầu sửa → NEEDS_REVISION (với ghi chú)
4. Nếu NEEDS_REVISION: User sửa → quay lại PENDING
```

### 2. Phân Quyền:

- **User**: Chỉ xem/sửa yêu cầu của đơn vị mình
- **KHCN&ĐN**: Xem tất cả, có quyền duyệt/từ chối

### 3. Tự Động Hóa:

- Tạo mã yêu cầu tự động (TR2024001, TR2024002...)
- Tracking số lần chỉnh sửa
- Tạo giấy xác nhận tự động khi duyệt
- Xuất báo cáo Excel/PDF với template

## 🚀 Tính Năng Nổi Bật

### 1. **Workflow Engine**:

- State machine cho trạng thái yêu cầu
- Business rules cho transitions
- Audit trail đầy đủ

### 2. **File Management**:

- Upload multiple file types (PDF, Office, images)
- File validation & size limits
- Secure download với permission check

### 3. **Reporting System**:

- Excel export với formatting
- PDF reports với template
- Flexible filtering (năm, khoảng thời gian, đơn vị...)
- Statistics dashboard

### 4. **User Experience**:

- Responsive design
- Real-time status updates
- Intuitive form validation
- Comprehensive error handling

## 🔧 Cấu Hình & Triển Khai

### Backend Dependencies:

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.0",
  "pg": "^8.8.0",
  "class-validator": "^0.14.0",
  "exceljs": "^4.3.0",
  "pdfkit": "^0.13.0"
}
```

### Frontend Dependencies:

```json
{
  "next": "14.0.0",
  "@types/react": "^18.0.0",
  "tailwindcss": "^3.3.0",
  "@radix-ui/react-*": "^1.0.0",
  "lucide-react": "^0.263.0"
}
```

### Environment Variables:

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/pbl6_ql_htqt
UPLOAD_PATH=./uploads

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📈 Mở Rộng Tương Lai

### 1. **Tích Hợp**:

- Email notifications
- SMS alerts
- Integration với hệ thống quản lý tài liệu
- SSO authentication

### 2. **Tính Năng Mới**:

- Multi-language support
- Advanced analytics
- Bulk operations
- API webhooks
- Mobile app

### 3. **Tối Ưu**:

- Redis caching
- File storage optimization
- Search indexing
- Performance monitoring

---

## ✅ Trạng Thái Hoàn Thành

- ✅ **Backend**: Entity, DTOs, Service, Controller, Module
- ✅ **Frontend**: Types, API Client, Components, Pages
- ✅ **Database**: Schema design với enums
- ✅ **API**: RESTful endpoints đầy đủ
- ✅ **UI/UX**: Responsive components với Shadcn/ui
- ✅ **Business Logic**: Workflow engine hoàn chỉnh
- ✅ **File Handling**: Upload/download functionality
- ✅ **Reporting**: Excel/PDF export
- ✅ **Security**: Role-based access control

**Module đã sẵn sàng để tích hợp vào hệ thống và triển khai production!** 🎉
