# Document (MOU) Service - Enhanced Features Guide

## Overview

This guide documents the enhanced MOU (Memorandum of Understanding) management system with full lifecycle support, including proposal submission, approval workflow, document template management, and post-signature tracking.

---

## 🎯 Key Features

### 1. **Auto-Generated Proposal Codes**

- Format: `MOU-{YEAR}-{SEQUENCE}`
- Example: `MOU-2025-001`, `MOU-2025-002`
- Automatically increments based on existing documents

### 2. **Enhanced Document Fields**

New fields added to support full MOU lifecycle:

- `proposalCode`: Auto-generated unique identifier
- `contactPerson`: Contact person of proposing unit
- `contactEmail`: Contact email for correspondence
- `isExtended`: Whether MOU has been renewed/extended
- `renewalDate`: Date of renewal (if extended)
- `terminationDate`: Early termination date (if applicable)
- `relatedFiles`: JSON array of related documents (draft MOU, letters, reports, etc.)

### 3. **Template Management System**

New `/api/v1/templates` endpoints for managing document templates:

- Upload templates (DOCX, PDF, XLS, XLSX)
- Categorize templates (Tờ trình, Dự thảo MOU, Thư mời, Báo cáo)
- Mark templates as mandatory or optional
- Enable/disable templates

---

## 📋 Database Schema Updates

### Template Model

```prisma
model Template {
  id           String   @id @default(cuid())
  name         String
  category     String   // "Tờ trình", "Dự thảo MOU", "Thư mời", "Báo cáo"
  filePath     String   // Path to uploaded file
  fileType     String?  // "DOCX", "PDF"
  isMandatory  Boolean  @default(false)
  isActive     Boolean  @default(true)
  description  String?
  uploadedById String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  uploadedBy User? @relation("TemplateUploadedBy", fields: [uploadedById], references: [id])
}
```

### Updated Document Model

```prisma
model Document {
  // ... existing fields ...

  // New fields for enhanced MOU management
  proposalCode     String?   // e.g., "MOU-2025-001"
  contactPerson    String?   // Contact person of proposing unit
  contactEmail     String?   // Contact email
  isExtended       Boolean   @default(false)
  renewalDate      DateTime? // Date of renewal/extension
  terminationDate  DateTime? // Early termination date
  relatedFiles     Json?     // Array of related documents
}
```

---

## 🔐 New RBAC Actions

### Document Actions

- `DOCUMENT_PROPOSE` - Create MOU proposals
- `DOCUMENT_APPROVE` - Approve MOU proposals
- `DOCUMENT_SIGN` - Sign documents
- `DOCUMENT_VIEW` - View documents
- `DOCUMENT_ACTIVATE` - Activate signed documents

### Template Actions

- `TEMPLATE_UPLOAD` - Upload new templates
- `TEMPLATE_MANAGE` - Manage templates (create, update, delete)
- `TEMPLATE_VIEW` - View and download templates

---

## 🚀 API Endpoints

### Document Management

#### 1. Create MOU Proposal

```http
POST /api/v1/documents/proposal
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "MOU with University of Tokyo",
  "type": "MOU",
  "partnerName": "University of Tokyo",
  "partnerCountry": "Japan",
  "description": "Academic cooperation agreement",
  "proposingUnit": "Faculty of IT",
  "contactPerson": "Dr. Nguyen Van A",
  "contactEmail": "nvana@university.edu.vn",
  "cooperationField": "Student Exchange, Research",
  "proposalReason": "Strengthen international collaboration"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "MOU proposal created successfully",
  "data": {
    "id": "cm5abc123",
    "proposalCode": "MOU-2025-001",
    "title": "MOU with University of Tokyo",
    "status": "DRAFT",
    "createdAt": "2025-01-11T10:00:00.000Z",
    ...
  }
}
```

#### 2. Approve MOU Proposal

```http
PATCH /api/v1/documents/{id}/approve-proposal
Authorization: Bearer {token}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "MOU proposal approved successfully",
  "data": {
    "id": "cm5abc123",
    "status": "APPROVED",
    "approvedById": "user123",
    "approvedAt": "2025-01-11T11:00:00.000Z",
    ...
  }
}
```

#### 3. Mark Document as Signed

```http
PATCH /api/v1/documents/{id}/mark-signed
Authorization: Bearer {token}
Content-Type: application/json

{
  "signedBy": "President Dr. Nguyen Van B"
}
```

#### 4. Mark Document as Active

```http
PATCH /api/v1/documents/{id}/mark-active
Authorization: Bearer {token}
```

#### 5. Extend or Mark as Expired

```http
PATCH /api/v1/documents/{id}/expire-extend
Authorization: Bearer {token}
Content-Type: application/json

{
  "isExtended": true,
  "renewalDate": "2026-12-31T00:00:00.000Z"
}
```

#### 6. Get Expiring MOUs

```http
GET /api/v1/documents/expiring?days=90
Authorization: Bearer {token}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Expiring MOUs retrieved successfully",
  "data": [
    {
      "id": "cm5xyz789",
      "proposalCode": "MOU-2024-015",
      "title": "MOU with Partner University",
      "expirationDate": "2025-03-15T00:00:00.000Z",
      "status": "ACTIVE",
      ...
    }
  ],
  "count": 5
}
```

#### 7. Get MOU Statistics

```http
GET /api/v1/documents/stats/mou
Authorization: Bearer {token}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "MOU statistics retrieved successfully",
  "data": {
    "totalSigned": 45,
    "totalExtended": 8,
    "totalExpired": 12,
    "byYear": {
      "2023": 15,
      "2024": 20,
      "2025": 10
    },
    "byField": {
      "Student Exchange": 20,
      "Joint Research": 15,
      "Faculty Development": 10
    },
    "byPartner": {
      "University of Tokyo": 5,
      "MIT": 3,
      "Oxford University": 4
    },
    "byUnit": {
      "Faculty of IT": 12,
      "Faculty of Engineering": 8,
      "International Relations Office": 25
    }
  }
}
```

### Template Management

#### 1. Upload Template

```http
POST /api/v1/templates/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

form-data:
  name: "Tờ trình ký kết MOU"
  category: "Tờ trình"
  fileType: "DOCX"
  isMandatory: true
  description: "Biểu mẫu tờ trình đề xuất ký kết MOU"
  file: [binary file]
```

**Response:**

```json
{
  "message": "Template uploaded successfully",
  "data": {
    "id": "template123",
    "name": "Tờ trình ký kết MOU",
    "category": "Tờ trình",
    "filePath": "/uploads/templates/template-1673456789-123456789.docx",
    "fileType": "DOCX",
    "isMandatory": true,
    "isActive": true,
    "createdAt": "2025-01-11T10:00:00.000Z"
  }
}
```

#### 2. Get All Templates

```http
GET /api/v1/templates?activeOnly=true&category=Tờ trình
Authorization: Bearer {token}
```

#### 3. Get Templates by Category

```http
GET /api/v1/templates/category/Tờ trình
Authorization: Bearer {token}
```

#### 4. Get Mandatory Templates

```http
GET /api/v1/templates/mandatory?category=Dự thảo MOU
Authorization: Bearer {token}
```

#### 5. Get Template by ID

```http
GET /api/v1/templates/{id}
Authorization: Bearer {token}
```

#### 6. Update Template

```http
PATCH /api/v1/templates/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Template Name",
  "description": "Updated description",
  "isMandatory": false
}
```

#### 7. Toggle Template Active Status

```http
PATCH /api/v1/templates/{id}/active
Authorization: Bearer {token}
Content-Type: application/json

{
  "isActive": false
}
```

#### 8. Delete Template

```http
DELETE /api/v1/templates/{id}
Authorization: Bearer {token}
```

---

## 📊 MOU Workflow

```
DRAFT → SUBMITTED → REVIEWING → APPROVED → SIGNED → ACTIVE
                                                         ↓
                                                    EXPIRED
                                                    (or Extended)
```

### Workflow Details:

1. **DRAFT** (Faculty Staff creates proposal)
   - Auto-generate `proposalCode`
   - Fill in all required information
   - Can be edited/updated

2. **SUBMITTED** (Faculty Staff submits for review)
   - Locked for editing
   - Awaiting review by Department Officer

3. **REVIEWING** (Department Officer reviews)
   - Can approve or reject
   - Add comments and recommendations

4. **APPROVED** (Leadership approves)
   - Ready for signing
   - Official approval recorded

5. **SIGNED** (Document is signed)
   - Physical/digital signature obtained
   - Set `signedBy` and `signedDate`

6. **ACTIVE** (MOU is in effect)
   - Set `effectiveDate`
   - Monitor for expiration

7. **EXPIRED** or **Extended**
   - Automatic expiration check (cron job)
   - Option to extend with new `renewalDate`
   - Or mark as `terminationDate` if terminated early

---

## 🔧 Setup Instructions

### 1. Run Database Migration

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 2. Seed RBAC Data

```bash
npx ts-node prisma/seed-rbac.ts
```

### 3. Create Uploads Directory

```bash
mkdir -p uploads/templates
```

### 4. Configure Environment Variables

Add to `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pbl6_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

### 5. Start the Server

```bash
npm run start:dev
```

---

## 👥 Role Permissions

### System Admin

- All permissions including template management

### Department Officer

- Create, review, approve MOUs
- Upload and manage templates
- View statistics

### Leadership

- Approve MOUs
- Sign documents
- View all MOUs and statistics

### Faculty Staff

- Create MOU proposals
- View templates
- Download templates
- View own proposals

---

## 📝 Template Categories

1. **Tờ trình** - Proposal documents
2. **Dự thảo MOU** - MOU drafts
3. **Thư mời** - Invitation letters
4. **Báo cáo** - Reports
5. **Khác** - Other documents

---

## 🔔 Event Emissions

The service emits the following events for notification integration:

- `document.proposal.created` - New MOU proposal created
- `document.approved` - MOU approved
- `document.signed` - MOU signed
- `document.activated` - MOU activated
- `document.extended` - MOU extended
- `document.expired` - MOU expired
- `document.expiring` - MOU expiring soon (cron job)

---

## 🧪 Testing

### Sample Test Users (from seed):

- **Admin**: admin@dut.udn.vn / Admin@123
- **Officer**: officer@dut.udn.vn / Officer@123
- **Leader**: leader@dut.udn.vn / Leader@123
- **Staff**: staff@dut.udn.vn / Staff@123

### Test Scenarios:

1. **Create MOU Proposal**
   - Login as Faculty Staff
   - POST to `/api/v1/documents/proposal`
   - Verify `proposalCode` is auto-generated

2. **Approve MOU**
   - Login as Department Officer
   - PATCH to `/api/v1/documents/{id}/approve-proposal`
   - Verify status changes to APPROVED

3. **Upload Template**
   - Login as Department Officer
   - POST to `/api/v1/templates/upload` with file
   - Verify file is stored in `/uploads/templates/`

4. **View Expiring MOUs**
   - GET `/api/v1/documents/expiring`
   - Verify only active MOUs within 90 days are returned

---

## 📚 Additional Resources

- [Backend API Reference](../BACKEND_API_REFERENCE.md)
- [RBAC System Documentation](../RBAC_REFACTOR_SUMMARY.md)
- [Prisma Schema](../prisma/schema.prisma)
- [Seed Data](../prisma/seed-rbac.ts)

---

## 🐛 Troubleshooting

### Issue: Prisma client not updated

**Solution:**

```bash
npx prisma generate
```

### Issue: Migration fails

**Solution:**

```bash
npx prisma migrate reset
npx prisma migrate deploy
npx ts-node prisma/seed-rbac.ts
```

### Issue: Upload directory not found

**Solution:**

```bash
mkdir -p uploads/templates
chmod 755 uploads/templates
```

### Issue: Template file upload fails

**Solution:**

- Check file size (max 10MB)
- Check file type (only PDF, DOC, DOCX, XLS, XLSX allowed)
- Ensure uploads directory has write permissions

---

## 📞 Support

For questions or issues, please contact:

- Development Team: dev@university.edu.vn
- Documentation: https://github.com/your-repo/wiki

---

**Last Updated**: January 11, 2025  
**Version**: 2.0.0
