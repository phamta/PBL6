# Backend API Reference

## Base URL

```
http://localhost:3001/api/v1
```

## API Documentation (Swagger)

```
http://localhost:3001/api/docs
```

---

## Authentication APIs

### 1. Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@dntu.edu.vn",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "user-id",
    "email": "user@dntu.edu.vn",
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0123456789",
    "isActive": true,
    "unitId": "unit-id",
    "unit": {
      "id": "unit-id",
      "name": "Khoa CNTT",
      "code": "CNTT"
    },
    "roles": [
      {
        "id": "user-role-id",
        "roleId": "role-id",
        "role": {
          "id": "role-id",
          "name": "Cán bộ phòng",
          "code": "DEPARTMENT_OFFICER"
        }
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**

- `401` - Email hoặc mật khẩu không chính xác
- `401` - User đã bị vô hiệu hóa

---

### 2. Register

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "newuser@dntu.edu.vn",
  "password": "password123",
  "fullName": "Nguyễn Văn B",
  "phoneNumber": "0987654321",
  "unitId": "unit-id"
}
```

**Response (201):**

```json
{
  "user": {
    /* Same as login response */
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

**Errors:**

- `409` - Email đã tồn tại
- `400` - Validation errors

---

### 3. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "user": {
    /* User object */
  },
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

**Errors:**

- `401` - Refresh token không hợp lệ hoặc hết hạn

---

### 4. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "message": "Đăng xuất thành công"
}
```

---

### 5. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "id": "user-id",
  "email": "user@dntu.edu.vn",
  "fullName": "Nguyễn Văn A"
  /* Full user object */
}
```

---

### 6. Update Profile

**Endpoint:** `PUT /auth/me`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "fullName": "Nguyễn Văn C",
  "phoneNumber": "0912345678"
}
```

**Response (200):**

```json
{
  /* Updated user object */
}
```

---

### 7. Change Password

**Endpoint:** `PUT /auth/change-password`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200):**

```json
{
  "message": "Đổi mật khẩu thành công"
}
```

**Errors:**

- `400` - Mật khẩu hiện tại không đúng
- `400` - Mật khẩu mới không khớp

---

## User Management APIs

### 1. Get Users List

**Endpoint:** `GET /users`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Query Parameters:**

```
page=1
limit=10
search=nguyen
unitId=unit-id
roleId=role-id
isActive=true
sortBy=createdAt
sortOrder=desc
```

**Response (200):**

```json
{
  "users": [
    {
      "id": "user-id",
      "email": "user@dntu.edu.vn",
      "fullName": "Nguyễn Văn A",
      "isActive": true,
      "unit": {
        /* Unit object */
      },
      "roles": [
        /* Role objects */
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Required Permission:** `user.view_all`

---

### 2. Get User Detail

**Endpoint:** `GET /users/:id`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "id": "user-id",
  "email": "user@dntu.edu.vn",
  "fullName": "Nguyễn Văn A"
  /* Full user details */
}
```

**Required Permission:** `user.view_detail`

---

### 3. Search Users

**Endpoint:** `GET /users/search`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Query Parameters:**

```
q=nguyen van
page=1
limit=10
```

**Response (200):**

```json
{
  "users": [
    /* Array of matching users */
  ],
  "pagination": {
    /* Pagination info */
  }
}
```

**Required Permission:** `user.search`

---

### 4. Get User Statistics

**Endpoint:** `GET /users/stats`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "totalUsers": 150,
  "activeUsers": 140,
  "inactiveUsers": 10,
  "roleDistribution": [
    {
      "role": "Quản trị hệ thống",
      "description": "System Administrator",
      "count": 5
    },
    {
      "role": "Cán bộ phòng",
      "description": "Department Officer",
      "count": 50
    }
  ]
}
```

**Required Permission:** `user.view_stats`

---

### 5. Toggle User Status

**Endpoint:** `PATCH /users/:id/toggle-status`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "message": "Người dùng đã được kích hoạt",
  "user": {
    "id": "user-id",
    "email": "user@dntu.edu.vn",
    "fullName": "Nguyễn Văn A",
    "isActive": true
  }
}
```

**Required Permission:** `user.manage_status`

---

### 6. Delete User

**Endpoint:** `DELETE /users/:id`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "message": "Đã xóa người dùng: Nguyễn Văn A"
}
```

**Required Permission:** `user.delete`

---

## Unit Management APIs

### 1. Get Units List

**Endpoint:** `GET /units`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Query Parameters:**

```
page=1
limit=10
search=khoa
parentId=parent-unit-id
level=1
isActive=true
sortBy=name
sortOrder=asc
includeChildren=true
includeUsers=false
```

**Response (200):**

```json
{
  "units": [
    {
      "id": "unit-id",
      "name": "Khoa Công nghệ Thông tin",
      "code": "CNTT",
      "level": 1,
      "parentId": null,
      "isActive": true,
      "children": [
        /* Child units if includeChildren=true */
      ],
      "_count": {
        "users": 50,
        "children": 3
      }
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### 2. Get Unit Detail

**Endpoint:** `GET /units/:id`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "id": "unit-id",
  "name": "Khoa Công nghệ Thông tin",
  "code": "CNTT",
  "level": 1,
  "parentId": null,
  "parent": null,
  "isActive": true,
  "children": [
    /* Child units */
  ],
  "_count": {
    "users": 50,
    "children": 3
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

### 3. Get Unit Hierarchy

**Endpoint:** `GET /units/hierarchy`

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response (200):**

```json
[
  {
    "id": "unit-1",
    "name": "Phòng KHCN&ĐN",
    "level": 0,
    "children": [
      {
        "id": "unit-1-1",
        "name": "Bộ phận Hợp tác Quốc tế",
        "level": 1,
        "children": []
      }
    ]
  },
  {
    "id": "unit-2",
    "name": "Khoa CNTT",
    "level": 0,
    "children": []
  }
]
```

---

## Error Responses

### 400 - Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 - Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 - Forbidden

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền thực hiện hành động này",
  "error": "Forbidden"
}
```

### 404 - Not Found

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy tài nguyên",
  "error": "Not Found"
}
```

### 409 - Conflict

```json
{
  "statusCode": 409,
  "message": "Email đã tồn tại",
  "error": "Conflict"
}
```

### 500 - Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## JWT Token Structure

### Access Token Payload

```json
{
  "sub": "user-id",
  "email": "user@dntu.edu.vn",
  "actions": [
    "user.view_all",
    "user.view_detail",
    "user.create",
    "unit.view_all"
  ],
  "iat": 1609459200,
  "exp": 1609462800
}
```

### Token Expiry

- **Access Token**: 1 giờ
- **Refresh Token**: 7 ngày

---

## RBAC Permissions

### System Admin Actions

- `user.*` - Tất cả quyền user
- `unit.*` - Tất cả quyền unit
- `document.*` - Tất cả quyền document
- `visa.*` - Tất cả quyền visa
- `guest.*` - Tất cả quyền guest
- `translation.*` - Tất cả quyền translation
- `report.*` - Tất cả quyền report
- `system.*` - Tất cả quyền system config

### Department Officer Actions

- `document.create`, `document.view_all`, `document.update`
- `visa.create`, `visa.view_all`, `visa.update`
- `guest.create`, `guest.view_all`, `guest.update`
- `translation.create`, `translation.view_all`
- `report.view_all`

### Leadership Actions

- `document.view_all`, `document.approve`
- `visa.view_all`, `visa.approve`
- `guest.view_all`
- `report.view_all`

### Faculty Staff Actions

- `document.view_own`, `document.create`
- `guest.view_own`

### Student Actions

- `translation.create`, `translation.view_own`

---

## Rate Limiting

- **Authentication endpoints**: 5 requests / 15 minutes
- **Other endpoints**: 100 requests / 15 minutes

---

## Testing with Swagger

Truy cập: `http://localhost:3001/api/docs`

1. Click **Authorize** button
2. Nhập token: `Bearer <your-access-token>`
3. Click **Authorize**
4. Test các endpoints

---

## Sample Test Account

```json
{
  "email": "admin@dntu.edu.vn",
  "password": "Admin@123"
}
```

⚠️ **Lưu ý**: Đổi mật khẩu sau khi đăng nhập lần đầu!
