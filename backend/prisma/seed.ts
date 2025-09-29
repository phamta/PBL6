import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (in correct order to respect foreign key constraints)
  console.log('🗑️  Clearing existing data...');
  await prisma.reportLog.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.systemConfig.deleteMany();
  await prisma.userNotification.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.notificationTemplate.deleteMany();
  await prisma.translation.deleteMany();
  await prisma.guestMember.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.visaExtension.deleteMany();
  await prisma.visa.deleteMany();
  await prisma.document.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.permissionAction.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.action.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.unit.deleteMany();

  // Hash passwords
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const officerPassword = await bcrypt.hash('officer123', saltRounds);
  const staffPassword = await bcrypt.hash('staff123', saltRounds);

  // 1. Create Units
  console.log('🏢 Creating units...');
  const itUnit = await prisma.unit.create({
    data: {
      name: 'Information Technology Department',
      code: 'IT',
      level: 0,
      isActive: true,
    },
  });

  const hrUnit = await prisma.unit.create({
    data: {
      name: 'Human Resources Department',
      code: 'HR',
      level: 0,
      isActive: true,
    },
  });

  // 2. Create Actions
  console.log('⚡ Creating system actions...');
  const readAction = await prisma.action.create({
    data: {
      name: 'read',
      code: 'READ',
      description: 'Read access to resources',
      category: 'BASIC',
    },
  });

  const writeAction = await prisma.action.create({
    data: {
      name: 'write',
      code: 'WRITE',
      description: 'Write access to resources',
      category: 'BASIC',
    },
  });

  const deleteAction = await prisma.action.create({
    data: {
      name: 'delete',
      code: 'DELETE',
      description: 'Delete access to resources',
      category: 'BASIC',
    },
  });

  const manageAction = await prisma.action.create({
    data: {
      name: 'manage',
      code: 'MANAGE',
      description: 'Full management access to resources',
      category: 'BASIC',
    },
  });

  // 3. Create Permissions
  console.log('🔐 Creating permissions...');
  const userPermission = await prisma.permission.create({
    data: {
      name: 'user',
      code: 'USER_MANAGEMENT',
      description: 'User management permissions',
    },
  });

  const documentPermission = await prisma.permission.create({
    data: {
      name: 'document',
      code: 'DOCUMENT_MANAGEMENT',
      description: 'Document management permissions',
    },
  });

  const visaPermission = await prisma.permission.create({
    data: {
      name: 'visa',
      code: 'VISA_MANAGEMENT',
      description: 'Visa management permissions',
    },
  });

  const guestPermission = await prisma.permission.create({
    data: {
      name: 'guest',
      code: 'GUEST_MANAGEMENT',
      description: 'Guest management permissions',
    },
  });

  const translationPermission = await prisma.permission.create({
    data: {
      name: 'translation',
      code: 'TRANSLATION_MANAGEMENT',
      description: 'Translation request permissions',
    },
  });

  const reportPermission = await prisma.permission.create({
    data: {
      name: 'report',
      code: 'REPORT_MANAGEMENT',
      description: 'Report access permissions',
    },
  });

  const systemPermission = await prisma.permission.create({
    data: {
      name: 'system',
      code: 'SYSTEM_MANAGEMENT',
      description: 'System configuration permissions',
    },
  });

  // 4. Create Roles
  console.log('👑 Creating roles...');
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      code: 'ADMIN',
      description: 'System Administrator with full access',
    },
  });

  const officerRole = await prisma.role.create({
    data: {
      name: 'OFFICER',
      code: 'OFFICER',
      description: 'International Affairs Officer',
    },
  });

  const staffRole = await prisma.role.create({
    data: {
      name: 'STAFF',
      code: 'STAFF',
      description: 'Faculty Staff Member',
    },
  });

  // 5. Create Permission-Action relationships
  console.log('🔗 Creating permission-action relationships...');
  const permissionActions = [
    // Admin gets all permissions with manage action
    { permissionId: userPermission.id, actionId: manageAction.id },
    { permissionId: documentPermission.id, actionId: manageAction.id },
    { permissionId: visaPermission.id, actionId: manageAction.id },
    { permissionId: guestPermission.id, actionId: manageAction.id },
    { permissionId: translationPermission.id, actionId: manageAction.id },
    { permissionId: reportPermission.id, actionId: manageAction.id },
    { permissionId: systemPermission.id, actionId: manageAction.id },

    // Officer gets read/write for documents, visas, guests, translations
    { permissionId: documentPermission.id, actionId: readAction.id },
    { permissionId: documentPermission.id, actionId: writeAction.id },
    { permissionId: visaPermission.id, actionId: readAction.id },
    { permissionId: visaPermission.id, actionId: writeAction.id },
    { permissionId: guestPermission.id, actionId: readAction.id },
    { permissionId: guestPermission.id, actionId: writeAction.id },
    { permissionId: translationPermission.id, actionId: readAction.id },
    { permissionId: translationPermission.id, actionId: writeAction.id },
    { permissionId: reportPermission.id, actionId: readAction.id },

    // Additional permissions for staff
    { permissionId: reportPermission.id, actionId: writeAction.id },
  ];

  // Create unique permission-action relationships
  const uniquePermissionActions = Array.from(
    new Map(permissionActions.map(pa => [`${pa.permissionId}-${pa.actionId}`, pa])).values()
  );

  for (const pa of uniquePermissionActions) {
    await prisma.permissionAction.create({ data: pa });
  }

  // 6. Create Role-Permission relationships
  console.log('🎯 Creating role-permission relationships...');
  const rolePermissions = [
    // Admin gets all permissions
    { roleId: adminRole.id, permissionId: userPermission.id },
    { roleId: adminRole.id, permissionId: documentPermission.id },
    { roleId: adminRole.id, permissionId: visaPermission.id },
    { roleId: adminRole.id, permissionId: guestPermission.id },
    { roleId: adminRole.id, permissionId: translationPermission.id },
    { roleId: adminRole.id, permissionId: reportPermission.id },
    { roleId: adminRole.id, permissionId: systemPermission.id },

    // Officer gets operational permissions
    { roleId: officerRole.id, permissionId: documentPermission.id },
    { roleId: officerRole.id, permissionId: visaPermission.id },
    { roleId: officerRole.id, permissionId: guestPermission.id },
    { roleId: officerRole.id, permissionId: translationPermission.id },
    { roleId: officerRole.id, permissionId: reportPermission.id },

    // Staff gets read-only permissions
    { roleId: staffRole.id, permissionId: documentPermission.id },
    { roleId: staffRole.id, permissionId: translationPermission.id },
    { roleId: staffRole.id, permissionId: reportPermission.id },
  ];

  for (const rp of rolePermissions) {
    await prisma.rolePermission.create({ data: rp });
  }

  // 7. Create Users
  console.log('👥 Creating users...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@university.edu',
      fullName: 'System Administrator',
      password: adminPassword,
      isActive: true,
      isVerified: true,
      unitId: itUnit.id,
    },
  });

  const officerUser = await prisma.user.create({
    data: {
      email: 'officer@university.edu',
      fullName: 'International Affairs Officer',
      password: officerPassword,
      isActive: true,
      isVerified: true,
      unitId: hrUnit.id,
      phoneNumber: '+84901234567',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@university.edu',
      fullName: 'Faculty Staff Member',
      password: staffPassword,
      isActive: true,
      isVerified: true,
      unitId: hrUnit.id,
      phoneNumber: '+84907654321',
    },
  });

  // 8. Assign roles to users
  console.log('🔒 Assigning roles to users...');
  await prisma.userRole.create({
    data: { userId: adminUser.id, roleId: adminRole.id },
  });

  await prisma.userRole.create({
    data: { userId: officerUser.id, roleId: officerRole.id },
  });

  await prisma.userRole.create({
    data: { userId: staffUser.id, roleId: staffRole.id },
  });

  // 9. Create Documents
  console.log('📄 Creating documents...');
  const mouDocument = await prisma.document.create({
    data: {
      title: 'Memorandum of Understanding - Partner University ABC',
      type: 'MOU',
      status: 'ACTIVE',
      partnerName: 'Partner University ABC',
      partnerCountry: 'USA',
      signedDate: new Date('2024-01-15'),
      expirationDate: new Date('2026-01-15'),
      createdById: officerUser.id,
      description: 'Strategic partnership agreement for student exchange and research collaboration',
    },
  });

  const agreementDocument = await prisma.document.create({
    data: {
      title: 'Research Collaboration Agreement - Institute XYZ',
      type: 'AGREEMENT',
      status: 'ACTIVE',
      partnerName: 'Research Institute XYZ',
      partnerCountry: 'Singapore',
      signedDate: new Date('2023-03-20'),
      expirationDate: new Date('2025-03-20'),
      createdById: officerUser.id,
      description: 'Joint research project agreement in artificial intelligence field',
    },
  });

  // 10. Create Visas
  console.log('🛂 Creating visas...');
  const activeVisa = await prisma.visa.create({
    data: {
      visaNumber: 'VN2024001234',
      holderName: 'Dr. John Smith',
      holderCountry: 'USA',
      passportNumber: 'US123456789',
      purpose: 'Research collaboration and academic conference',
      sponsorUnit: 'Computer Science Department',
      status: 'ACTIVE',
      issueDate: new Date('2024-06-20'),
      expirationDate: new Date('2025-06-20'),
      createdById: officerUser.id,
    },
  });

  const expiredVisa = await prisma.visa.create({
    data: {
      visaNumber: 'VN2023005678',
      holderName: 'Prof. Maria Garcia',
      holderCountry: 'Spain',
      passportNumber: 'ES987654321',
      purpose: 'Guest lecture series and research supervision',
      sponsorUnit: 'International Affairs Office',
      status: 'EXPIRED',
      issueDate: new Date('2023-09-01'),
      expirationDate: new Date('2024-09-01'),
      createdById: officerUser.id,
    },
  });

  // 11. Create Guests
  console.log('👥 Creating guests...');
  const guestGroup = await prisma.guest.create({
    data: {
      groupName: 'Partner University ABC Delegation',
      purpose: 'Academic Partnership Discussion and Campus Tour',
      arrivalDate: new Date('2025-02-15'),
      departureDate: new Date('2025-02-20'),
      totalMembers: 3,
      status: 'REGISTERED',
      contactPerson: 'Dr. Robert Johnson',
      contactEmail: 'delegation@partneruniv.edu',
      contactPhone: '+1-555-0123',
      createdById: officerUser.id,
      notes: 'VIP delegation including university president and department heads',
    },
  });

  // 12. Create Guest Members
  console.log('👤 Creating guest members...');
  await prisma.guestMember.create({
    data: {
      guestId: guestGroup.id,
      fullName: 'Dr. Robert Johnson',
      nationality: 'USA',
      passportNumber: 'US123456789',
      position: 'University President',
      organization: 'Partner University ABC',
      email: 'president@partneruniv.edu',
      phoneNumber: '+1-555-0124',
    },
  });

  await prisma.guestMember.create({
    data: {
      guestId: guestGroup.id,
      fullName: 'Prof. Sarah Wilson',
      nationality: 'USA',
      passportNumber: 'US987654321',
      position: 'Head of International Affairs',
      organization: 'Partner University ABC',
      email: 'international@partneruniv.edu',
      phoneNumber: '+1-555-0125',
    },
  });

  await prisma.guestMember.create({
    data: {
      guestId: guestGroup.id,
      fullName: 'Dr. Michael Brown',
      nationality: 'USA',
      passportNumber: 'US456789123',
      position: 'Computer Science Department Head',
      organization: 'Partner University ABC',
      email: 'cs.head@partneruniv.edu',
      phoneNumber: '+1-555-0126',
    },
  });

  // 13. Create Translations
  console.log('🔤 Creating translation requests...');
  await prisma.translation.create({
    data: {
      applicantName: 'Faculty Staff Member',
      applicantEmail: 'staff@university.edu',
      applicantPhone: '+84907654321',
      documentTitle: 'Partnership Agreement Translation',
      sourceLanguage: 'English',
      targetLanguage: 'Vietnamese',
      documentType: 'AGREEMENT',
      purpose: 'Official translation required for legal purposes',
      urgentLevel: 'URGENT',
      status: 'PENDING',
      originalFile: '/uploads/translations/partnership_agreement_en.pdf',
      createdById: staffUser.id,
      notes: 'Certified translation with official stamp required',
    },
  });

  // 14. Create Notification Templates
  console.log('📧 Creating notification templates...');
  await prisma.notificationTemplate.create({
    data: {
      name: 'Document Expiring Soon',
      type: 'EMAIL',
      subject: 'Document Expiring Soon: {{documentTitle}}',
      content: `
Dear {{recipientName}},

This is a reminder that the following document will expire soon:

Document: {{documentTitle}}
Type: {{documentType}}
Partner: {{partnerName}}
Expiry Date: {{expiryDate}}

Please take necessary action to renew or update this document before it expires.

Best regards,
International Affairs Office
      `.trim(),
      variables: ['recipientName', 'documentTitle', 'documentType', 'partnerName', 'expiryDate'],
      isActive: true,
    },
  });

  // 15. Create System Config
  console.log('⚙️ Creating system configuration...');
  await prisma.systemConfig.create({
    data: {
      key: 'visa.reminderDays',
      value: '30',
      description: 'Number of days before visa expiry to send reminder notifications',
      dataType: 'NUMBER',
      category: 'VISA',
      isEditable: true,
      updatedById: adminUser.id,
    },
  });

  await prisma.systemConfig.create({
    data: {
      key: 'document.reminderDays',
      value: '60',
      description: 'Number of days before document expiry to send reminder notifications',
      dataType: 'NUMBER',
      category: 'DOCUMENT',
      isEditable: true,
      updatedById: adminUser.id,
    },
  });

  await prisma.systemConfig.create({
    data: {
      key: 'translation.maxFileSize',
      value: '10',
      description: 'Maximum file size for translation uploads in MB',
      dataType: 'NUMBER',
      category: 'TRANSLATION',
      isEditable: true,
      updatedById: adminUser.id,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📊 Created data summary:');
  console.log('  - Units: 2');
  console.log('  - Actions: 4');
  console.log('  - Permissions: 7');
  console.log('  - Roles: 3 (ADMIN, OFFICER, STAFF)');
  console.log('  - Users: 3 with bcrypt hashed passwords');
  console.log('  - Documents: 2 (1 MOU, 1 AGREEMENT)');
  console.log('  - Visas: 2 (1 ACTIVE, 1 EXPIRED)');
  console.log('  - Guests: 1 group with 3 members');
  console.log('  - Translations: 1 PENDING request');
  console.log('  - Notification Templates: 1');
  console.log('  - System Configs: 3');
  console.log('\n🔑 Login credentials:');
  console.log('  Admin: admin@university.edu / admin123');
  console.log('  Officer: officer@university.edu / officer123');
  console.log('  Staff: staff@university.edu / staff123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✨ Database connection closed');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });