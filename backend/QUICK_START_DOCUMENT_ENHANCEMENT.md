# Document Service Enhancement - Quick Start

## 🚀 What Was Done

This update significantly enhances the Document (MOU) Management system with:

1. **Auto-Generated Proposal Codes** (e.g., MOU-2025-001)
2. **Template Management System** for document templates
3. **Extended MOU Lifecycle Tracking** (renewals, extensions, expirations)
4. **Enhanced Statistics & Reporting**
5. **New RBAC Actions & Permissions**

---

## 📦 Installation & Setup

### Step 1: Database Migration

The migration has already been applied. Verify it's working:

```bash
cd backend
npx prisma migrate status
```

If migration is not applied:

```bash
npx prisma migrate deploy
npx prisma generate
```

### Step 2: Seed RBAC Data

Update the database with new actions and permissions:

```bash
npx ts-node prisma/seed-rbac.ts
```

### Step 3: Verify Uploads Directory

Ensure the uploads directory exists:

```bash
# Already created at: backend/uploads/templates/
```

### Step 4: Restart Development Server

```bash
npm run start:dev
```

---

## 🧪 Quick Test

### Test 1: Create MOU Proposal

```bash
# Login first to get token
POST http://localhost:3000/api/v1/auth/login
{
  "email": "staff@dut.udn.vn",
  "password": "Staff@123"
}

# Then create proposal
POST http://localhost:3000/api/v1/documents/proposal
Authorization: Bearer {your_token}
{
  "title": "Test MOU",
  "partnerName": "Test University",
  "partnerCountry": "Vietnam",
  "description": "Test MOU proposal",
  "contactPerson": "John Doe",
  "contactEmail": "john@example.com"
}

# Response should include auto-generated proposalCode: "MOU-2025-001"
```

### Test 2: Upload Template

```bash
POST http://localhost:3000/api/v1/templates/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

name: Test Template
category: Tờ trình
file: [your .docx or .pdf file]
```

### Test 3: Get MOU Statistics

```bash
GET http://localhost:3000/api/v1/documents/stats/mou
Authorization: Bearer {token}
```

### Test 4: Get Expiring MOUs

```bash
GET http://localhost:3000/api/v1/documents/expiring?days=90
Authorization: Bearer {token}
```

---

## 📚 Documentation

- **Full API Guide**: [DOCUMENT_SERVICE_ENHANCED_GUIDE.md](./DOCUMENT_SERVICE_ENHANCED_GUIDE.md)
- **Implementation Summary**: [DOCUMENT_SERVICE_IMPLEMENTATION_SUMMARY.md](./DOCUMENT_SERVICE_IMPLEMENTATION_SUMMARY.md)
- **API Reference**: [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md)

---

## 🔑 Test Accounts

```
Admin:              admin@dut.udn.vn / Admin@123
Department Officer: officer@dut.udn.vn / Officer@123
Leadership:         leader@dut.udn.vn / Leader@123
Faculty Staff:      staff@dut.udn.vn / Staff@123
Student:            student@dut.udn.vn / Student@123
```

---

## 📋 New API Endpoints

### Document Management

- `POST /api/v1/documents/proposal` - Create MOU proposal
- `PATCH /api/v1/documents/:id/approve-proposal` - Approve proposal
- `PATCH /api/v1/documents/:id/mark-signed` - Mark as signed
- `PATCH /api/v1/documents/:id/mark-active` - Activate MOU
- `PATCH /api/v1/documents/:id/expire-extend` - Expire or extend MOU
- `GET /api/v1/documents/expiring` - Get expiring MOUs
- `GET /api/v1/documents/stats/mou` - Get MOU statistics

### Template Management

- `POST /api/v1/templates/upload` - Upload template
- `GET /api/v1/templates` - Get all templates
- `GET /api/v1/templates/category/:category` - Get templates by category
- `GET /api/v1/templates/mandatory` - Get mandatory templates
- `GET /api/v1/templates/:id` - Get template by ID
- `PATCH /api/v1/templates/:id` - Update template
- `PATCH /api/v1/templates/:id/active` - Toggle active status
- `DELETE /api/v1/templates/:id` - Delete template

---

## 🔧 Troubleshooting

### TypeScript Errors After Update

If you see TypeScript errors about missing properties:

1. Restart TypeScript server in VS Code:
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

2. Or run:

```bash
npx prisma generate
```

3. Restart VS Code if needed

### Migration Issues

If migration fails:

```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Then seed again
npx ts-node prisma/seed-rbac.ts
```

### Template Upload Fails

- Check file size (max 10MB)
- Check file type (PDF, DOC, DOCX, XLS, XLSX only)
- Verify `uploads/templates` directory exists with write permissions

---

## 🎯 Next Steps

1. **Frontend Integration**
   - Implement MOU proposal form with auto-code display
   - Create template library UI
   - Add MOU statistics dashboard
   - Implement status workflow UI

2. **Testing**
   - Test all new endpoints
   - Verify RBAC permissions work correctly
   - Test file uploads with different file types
   - Test MOU workflow from creation to expiration

3. **Production Deployment**
   - Configure cloud file storage (AWS S3, Azure Blob)
   - Set up email notifications
   - Configure backup strategy
   - Set up monitoring and logging

---

## ✅ Checklist

- [x] Database schema updated
- [x] Migration created and applied
- [x] Prisma client regenerated
- [x] RBAC actions and permissions added
- [x] Template service created
- [x] Template controller created
- [x] Document service enhanced
- [x] Document controller enhanced
- [x] Template module integrated
- [x] Uploads directory created
- [x] Documentation created
- [ ] Seed RBAC data (run manually)
- [ ] Test all endpoints
- [ ] Frontend integration
- [ ] Production deployment

---

## 📞 Support

For questions or issues:

- Check documentation in `/backend/*.md` files
- Review Prisma schema in `/backend/prisma/schema.prisma`
- Check seed data in `/backend/prisma/seed-rbac.ts`

---

**Last Updated**: January 11, 2025  
**Version**: 2.0.0  
**Status**: ✅ Ready for Testing
