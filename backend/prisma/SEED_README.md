# Database Seed Data

## Overview

This seed file creates comprehensive sample data for the International Cooperation Management System including:

- **RBAC System**: Users, Roles, Permissions, and Actions
- **Business Data**: Documents, Visas, Guests, Translations
- **System Configuration**: Notification templates and system settings

## Data Created

### 1. Units (2 units)

- **IT Department**: Information Technology Department
- **HR Department**: Human Resources Department

### 2. Actions (4 basic actions)

- **READ**: Read access to resources
- **WRITE**: Write access to resources
- **DELETE**: Delete access to resources
- **MANAGE**: Full management access to resources

### 3. Permissions (7 permissions)

- **USER_MANAGEMENT**: User management permissions
- **DOCUMENT_MANAGEMENT**: Document management permissions
- **VISA_MANAGEMENT**: Visa management permissions
- **GUEST_MANAGEMENT**: Guest management permissions
- **TRANSLATION_MANAGEMENT**: Translation request permissions
- **REPORT_MANAGEMENT**: Report access permissions
- **SYSTEM_MANAGEMENT**: System configuration permissions

### 4. Roles (3 roles)

- **ADMIN**: System Administrator with full access
- **OFFICER**: International Affairs Officer with operational permissions
- **STAFF**: Faculty Staff Member with limited read access

### 5. Users (3 users with bcrypt passwords)

| Role    | Email                  | Password   | Full Name                     |
| ------- | ---------------------- | ---------- | ----------------------------- |
| ADMIN   | admin@university.edu   | admin123   | System Administrator          |
| OFFICER | officer@university.edu | officer123 | International Affairs Officer |
| STAFF   | staff@university.edu   | staff123   | Faculty Staff Member          |

### 6. Documents (2 sample documents)

- **MOU**: Memorandum of Understanding with Partner University ABC
- **AGREEMENT**: Research Collaboration Agreement with Institute XYZ

### 7. Visas (2 sample visas)

- **ACTIVE**: Dr. John Smith from USA (expires 2025-06-20)
- **EXPIRED**: Prof. Maria Garcia from Spain (expired 2024-09-01)

### 8. Guests (1 group with 3 members)

- **Partner University ABC Delegation**: VIP delegation with university president and department heads

### 9. Translations (1 pending request)

- **Partnership Agreement Translation**: English to Vietnamese translation request

### 10. Notification Templates (1 template)

- **Document Expiring Soon**: Email template for document expiry notifications

### 11. System Configs (3 configurations)

- **visa.reminderDays**: 30 days reminder for visa expiry
- **document.reminderDays**: 60 days reminder for document expiry
- **translation.maxFileSize**: 10 MB maximum file size for translations

## Usage

### Run the seed

```bash
# Using npm
npm run seed

# Using the Prisma command
npm run prisma:seed

# Reset database and seed
npm run prisma:reset
```

### Login Credentials

Use these credentials to test the system:

**Admin Account** (Full Access):

- Email: `admin@university.edu`
- Password: `admin123`

**Officer Account** (Business Operations):

- Email: `officer@university.edu`
- Password: `officer123`

**Staff Account** (Limited Access):

- Email: `staff@university.edu`
- Password: `staff123`

## Features Tested

### RBAC (Role-Based Access Control)

- ✅ Actions, Permissions, Roles hierarchy
- ✅ User-Role assignments
- ✅ Permission-Action mappings
- ✅ Role-Permission assignments

### Business Data

- ✅ Document management (MOU/Agreements)
- ✅ Visa management (Active/Expired statuses)
- ✅ Guest management (Groups and members)
- ✅ Translation requests
- ✅ Notification templates
- ✅ System configurations

### Data Relationships

- ✅ Users belong to Units
- ✅ Documents created by Users
- ✅ Visas created by Users
- ✅ Guests have multiple members
- ✅ Translations requested by Users
- ✅ System configs updated by Users

## Notes

- All passwords are hashed using bcrypt with 10 salt rounds
- Foreign key relationships are properly maintained
- Data is cleared before seeding to avoid conflicts
- Console logging provides detailed feedback during seeding
- Sample data includes realistic business scenarios

## Development

To modify the seed data:

1. Edit `prisma/seed.ts`
2. Update the data objects as needed
3. Run `npm run seed` to apply changes
4. Test with the provided login credentials

## Troubleshooting

If seed fails:

1. Check database connection
2. Ensure Prisma schema is up to date: `npx prisma generate`
3. Reset database: `npm run prisma:reset`
4. Check for unique constraint violations in the data
