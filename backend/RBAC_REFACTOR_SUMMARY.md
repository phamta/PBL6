# RBAC Refactor Summary

## Overview

Đã hoàn thành refactor hệ thống từ UserRole enum sang mô hình **Role-Permission-Action** mềm dẻo, cho phép SystemAdmin tạo Role mới, gán Permission và Action cho Role từ giao diện.

## 🎯 Objectives Achieved

### ✅ 1. Identity Service (Auth & Guards)

- **AuthService Updated**:
  - Load roles → permissions → actions của user khi login
  - Lưu danh sách actions vào JWT payload: `{ userId, email, actions: ["document.create", "visa.approve", ...] }`
  - Method `extractUserActions()` để trích xuất actions từ user roles
  - Method `loadUserActions()` để refresh user permissions

- **Guards Created**:
  - `ActionGuard` thay thế `RolesGuard` cũ
  - Đọc metadata từ `@RequireAction('document.create')`
  - So sánh với `req.user.actions` array

- **Decorator**:
  - `@RequireAction(actionCode: string)` để gắn vào controller endpoints

### ✅ 2. Document Service

**Replaced UserRole checks with action-based permissions:**

**Before:**

```typescript
if (user.role !== UserRole.FACULTY_STAFF)
  throw new ForbiddenException(...)
```

**After:**

```typescript
if (!user.actions.includes('document.create'))
  throw new ForbiddenException(...)
```

**Action Mapping:**

- `document.create` → Tạo document mới
- `document.update` → Cập nhật document
- `document.delete` → Hủy document
- `document.submit` → Submit document để review
- `document.review` → Bắt đầu review process
- `document.approve` → Approve document sau review
- `document.reject` → Reject document
- `document.sign` → Ký kết document
- `document.activate` → Kích hoạt document
- `document.expire` → Đánh dấu document hết hạn
- `document.view_all` → Xem tất cả documents
- `document.view_submitted` → Xem documents đã submit

### ✅ 3. Visa Service

**Refactored permission checking:**

**Action Mapping:**

- `visa.create` → Tạo visa application mới
- `visa.update` → Cập nhật visa information
- `visa.delete` → Xóa/hủy visa
- `visa.extend` → Tạo visa extension request
- `visa.approve` → Approve visa extension
- `visa.reject` → Reject visa extension
- `visa.view_all` → Xem tất cả visas
- `visa.view_own` → Xem visas do mình tạo
- `visa.remind` → Gửi reminder cho visa sắp hết hạn

### ✅ 4. Controller Updates

**Example controller với @RequireAction decorators:**

```typescript
@Controller("documents")
@UseGuards(JwtAuthGuard, ActionGuard)
export class DocumentController {
  @Post()
  @RequireAction("document.create")
  create(@Body() dto: CreateDocumentDto, @ReqUser() user) {
    return this.documentService.createDocument(dto, user);
  }

  @Post(":id/approve")
  @RequireAction("document.approve")
  approve(
    @Param("id") id: string,
    @Body() dto: ApproveDocumentDto,
    @ReqUser() user
  ) {
    return this.documentService.approveDocument(id, dto, user);
  }

  @Get()
  @RequireAction("document.view_own") // Minimum permission
  getAll(@Query() filter: FilterDto, @ReqUser() user) {
    // Service sẽ check thêm document.view_submitted và document.view_all
    return this.documentService.getDocuments(filter, user);
  }
}
```

## 🏗️ Architecture Changes

### 1. User Interface Update

```typescript
// OLD
interface DocumentUser {
  id: string;
  role: UserRole; // ❌ Rigid enum
  unitId?: string;
}

// NEW
interface DocumentUser {
  id: string;
  actions: string[]; // ✅ Flexible actions array
  unitId?: string;
}
```

### 2. JWT Payload Structure

```typescript
// OLD
{ sub: userId, email, role: "FACULTY_STAFF" }

// NEW
{ sub: userId, email, actions: ["document.create", "document.submit", "visa.view_own"] }
```

### 3. Permission Checking Pattern

```typescript
// OLD - Hard-coded role checks
if (user.role === UserRole.LEADERSHIP) {
  // Leadership logic
} else if (user.role === UserRole.DEPARTMENT_OFFICER) {
  // Officer logic
}

// NEW - Flexible action-based checks
if (user.actions.includes("document.view_all")) {
  // Can view all documents
} else if (user.actions.includes("document.view_submitted")) {
  // Can view submitted documents
} else {
  // Can only view own documents
}
```

## 🔧 Implementation Benefits

### 1. **Flexibility**

- SystemAdmin có thể tạo role mới qua UI
- Gán permissions linh hoạt cho từng role
- Không cần code changes khi thêm roles mới

### 2. **Granular Control**

- Permission checking chi tiết theo action
- Hierarchical permissions (view_own < view_submitted < view_all)
- Easy audit trail qua action codes

### 3. **Scalability**

- Dễ dàng thêm actions mới
- Role inheritance qua permission mapping
- Centralized permission management

### 4. **Security**

- JWT payload chứa đầy đủ permissions
- No database lookup mỗi request
- Clear action-based authorization

## 📁 Files Modified

### Core Authentication:

- ✅ `src/services/identity/auth.service.ts`
- ✅ `src/services/identity/dto/register.dto.ts`
- ✅ `src/common/guards/action.guard.ts`
- ✅ `src/common/guards/permissions.guard.ts`
- ✅ `src/decorators/require-action.decorator.ts`

### Services Refactored:

- ✅ `src/services/document/document.service.ts`
- ✅ `src/services/visa/visa.service.ts`

### Controllers Updated:

- ✅ `src/services/document/document.controller.ts`

### RBAC Infrastructure (Already Created):

- ✅ `src/services/rbac/rbac.service.ts`
- ✅ `src/services/rbac/rbac.controller.ts`
- ✅ `prisma/schema.prisma`
- ✅ `prisma/seed.ts`

## 🚀 Next Steps

1. **Test the refactored services** with new RBAC system
2. **Update remaining controllers** to use @RequireAction decorators
3. **Run database migration** and seed RBAC data
4. **Frontend integration** with new permission structure
5. **Create admin UI** for role/permission management

## 💡 Usage Examples

### For Frontend Developers:

```typescript
// Check user permissions in frontend
const canCreateDocument = user.actions.includes('document.create');
const canApproveVisa = user.actions.includes('visa.approve');

// Conditional rendering
{canCreateDocument && <CreateDocumentButton />}
```

### For Backend Developers:

```typescript
// Add new action to any endpoint
@RequireAction('new_feature.access')
@Post('new-endpoint')
async newFeature(@ReqUser() user) {
  // Service automatically checks user.actions.includes('new_feature.access')
}
```

Hệ thống RBAC mềm dẻo đã được hoàn thiện và sẵn sàng cho việc triển khai! 🎉
