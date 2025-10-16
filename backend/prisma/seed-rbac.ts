import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RBAC seed data...');

  // Create Actions first
  console.log('Creating actions...');
  const actions = await Promise.all([
    // User Management Actions
    prisma.action.upsert({
      where: { code: 'USER_CREATE' },
      update: {},
      create: {
        code: 'USER_CREATE',
        name: 'Create User',
        description: 'Can create new users',
        category: 'USER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_READ' },
      update: {},
      create: {
        code: 'USER_READ',
        name: 'Read User',
        description: 'Can view user information',
        category: 'USER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_UPDATE' },
      update: {},
      create: {
        code: 'USER_UPDATE',
        name: 'Update User',
        description: 'Can modify user information',
        category: 'USER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_DELETE' },
      update: {},
      create: {
        code: 'USER_DELETE',
        name: 'Delete User',
        description: 'Can delete users',
        category: 'USER_MANAGEMENT',
      },
    }),

    // Role Management Actions
    prisma.action.upsert({
      where: { code: 'ROLE_CREATE' },
      update: {},
      create: {
        code: 'ROLE_CREATE',
        name: 'Create Role',
        description: 'Can create new roles',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ROLE_READ' },
      update: {},
      create: {
        code: 'ROLE_READ',
        name: 'Read Role',
        description: 'Can view role information',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ROLE_UPDATE' },
      update: {},
      create: {
        code: 'ROLE_UPDATE',
        name: 'Update Role',
        description: 'Can modify role information',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ROLE_DELETE' },
      update: {},
      create: {
        code: 'ROLE_DELETE',
        name: 'Delete Role',
        description: 'Can delete roles',
        category: 'RBAC_MANAGEMENT',
      },
    }),

    // Permission Management Actions
    prisma.action.upsert({
      where: { code: 'PERMISSION_CREATE' },
      update: {},
      create: {
        code: 'PERMISSION_CREATE',
        name: 'Create Permission',
        description: 'Can create new permissions',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PERMISSION_READ' },
      update: {},
      create: {
        code: 'PERMISSION_READ',
        name: 'Read Permission',
        description: 'Can view permission information',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PERMISSION_UPDATE' },
      update: {},
      create: {
        code: 'PERMISSION_UPDATE',
        name: 'Update Permission',
        description: 'Can modify permission information',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PERMISSION_DELETE' },
      update: {},
      create: {
        code: 'PERMISSION_DELETE',
        name: 'Delete Permission',
        description: 'Can delete permissions',
        category: 'RBAC_MANAGEMENT',
      },
    }),

    // Action Management Actions
    prisma.action.upsert({
      where: { code: 'ACTION_CREATE' },
      update: {},
      create: {
        code: 'ACTION_CREATE',
        name: 'Create Action',
        description: 'Can create new actions',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ACTION_READ' },
      update: {},
      create: {
        code: 'ACTION_READ',
        name: 'Read Action',
        description: 'Can view action information',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ACTION_UPDATE' },
      update: {},
      create: {
        code: 'ACTION_UPDATE',
        name: 'Update Action',
        description: 'Can modify action information',
        category: 'RBAC_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ACTION_DELETE' },
      update: {},
      create: {
        code: 'ACTION_DELETE',
        name: 'Delete Action',
        description: 'Can delete actions',
        category: 'RBAC_MANAGEMENT',
      },
    }),

    // User Role Assignment Actions
    prisma.action.upsert({
      where: { code: 'USER_ROLE_ASSIGN' },
      update: {},
      create: {
        code: 'USER_ROLE_ASSIGN',
        name: 'Assign User Role',
        description: 'Can assign roles to users',
        category: 'USER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_ROLE_REMOVE' },
      update: {},
      create: {
        code: 'USER_ROLE_REMOVE',
        name: 'Remove User Role',
        description: 'Can remove roles from users',
        category: 'USER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_ROLE_READ' },
      update: {},
      create: {
        code: 'USER_ROLE_READ',
        name: 'Read User Role',
        description: 'Can view user role assignments',
        category: 'USER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_PERMISSION_READ' },
      update: {},
      create: {
        code: 'USER_PERMISSION_READ',
        name: 'Read User Permission',
        description: 'Can view user permissions',
        category: 'USER_MANAGEMENT',
      },
    }),

    // Visa Management Actions
    prisma.action.upsert({
      where: { code: 'VISA_CREATE' },
      update: {},
      create: {
        code: 'VISA_CREATE',
        name: 'Create Visa',
        description: 'Can create visa applications',
        category: 'VISA_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_READ' },
      update: {},
      create: {
        code: 'VISA_READ',
        name: 'Read Visa',
        description: 'Can view visa applications',
        category: 'VISA_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_UPDATE' },
      update: {},
      create: {
        code: 'VISA_UPDATE',
        name: 'Update Visa',
        description: 'Can modify visa applications',
        category: 'VISA_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_DELETE' },
      update: {},
      create: {
        code: 'VISA_DELETE',
        name: 'Delete Visa',
        description: 'Can delete visa applications',
        category: 'VISA_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_APPROVE' },
      update: {},
      create: {
        code: 'VISA_APPROVE',
        name: 'Approve Visa',
        description: 'Can approve visa applications',
        category: 'VISA_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_REJECT' },
      update: {},
      create: {
        code: 'VISA_REJECT',
        name: 'Reject Visa',
        description: 'Can reject visa applications',
        category: 'VISA_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_EXTEND' },
      update: {},
      create: {
        code: 'VISA_EXTEND',
        name: 'Extend Visa',
        description: 'Can extend visa duration',
        category: 'VISA_MANAGEMENT',
      },
    }),

    // Document Management Actions
    prisma.action.upsert({
      where: { code: 'DOCUMENT_CREATE' },
      update: {},
      create: {
        code: 'DOCUMENT_CREATE',
        name: 'Create Document',
        description: 'Can create new documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_READ' },
      update: {},
      create: {
        code: 'DOCUMENT_READ',
        name: 'Read Document',
        description: 'Can view document information',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_UPDATE' },
      update: {},
      create: {
        code: 'DOCUMENT_UPDATE',
        name: 'Update Document',
        description: 'Can modify document information',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_DELETE' },
      update: {},
      create: {
        code: 'DOCUMENT_DELETE',
        name: 'Delete Document',
        description: 'Can delete documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_PROPOSE' },
      update: {},
      create: {
        code: 'DOCUMENT_PROPOSE',
        name: 'Propose Document',
        description: 'Can propose new MOU/documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_APPROVE' },
      update: {},
      create: {
        code: 'DOCUMENT_APPROVE',
        name: 'Approve Document',
        description: 'Can approve documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_SIGN' },
      update: {},
      create: {
        code: 'DOCUMENT_SIGN',
        name: 'Sign Document',
        description: 'Can sign documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_ACTIVATE' },
      update: {},
      create: {
        code: 'DOCUMENT_ACTIVATE',
        name: 'Activate Document',
        description: 'Can activate documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_VIEW' },
      update: {},
      create: {
        code: 'DOCUMENT_VIEW',
        name: 'View Document',
        description: 'Can view documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),

    prisma.action.upsert({
      where: { code: 'DOCUMENT_FEEDBACK' },
      update: {},
      create: {
        code: 'DOCUMENT_FEEDBACK',
        name: 'Feedback on Document',
        description: 'Can provide feedback/comments on documents',
        category: 'DOCUMENT_MANAGEMENT',
      },
    }),
    // Template Management Actions
    prisma.action.upsert({
      where: { code: 'TEMPLATE_UPLOAD' },
      update: {},
      create: {
        code: 'TEMPLATE_UPLOAD',
        name: 'Upload Template',
        description: 'Can upload document templates',
        category: 'TEMPLATE_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TEMPLATE_MANAGE' },
      update: {},
      create: {
        code: 'TEMPLATE_MANAGE',
        name: 'Manage Templates',
        description: 'Can manage document templates (create, update, delete)',
        category: 'TEMPLATE_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TEMPLATE_VIEW' },
      update: {},
      create: {
        code: 'TEMPLATE_VIEW',
        name: 'View Templates',
        description: 'Can view and download templates',
        category: 'TEMPLATE_MANAGEMENT',
      },
    }),

    // Translation Management Actions
    prisma.action.upsert({
      where: { code: 'TRANSLATION_CREATE' },
      update: {},
      create: {
        code: 'TRANSLATION_CREATE',
        name: 'Create Translation',
        description: 'Can create translation requests',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_READ' },
      update: {},
      create: {
        code: 'TRANSLATION_READ',
        name: 'Read Translation',
        description: 'Can view translation requests',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_UPDATE' },
      update: {},
      create: {
        code: 'TRANSLATION_UPDATE',
        name: 'Update Translation',
        description: 'Can modify translation requests',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_DELETE' },
      update: {},
      create: {
        code: 'TRANSLATION_DELETE',
        name: 'Delete Translation',
        description: 'Can delete translation requests',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_APPROVE' },
      update: {},
      create: {
        code: 'TRANSLATION_APPROVE',
        name: 'Approve Translation',
        description: 'Can approve translation requests',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_REJECT' },
      update: {},
      create: {
        code: 'TRANSLATION_REJECT',
        name: 'Reject Translation',
        description: 'Can reject translation requests',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_COMPLETE' },
      update: {},
      create: {
        code: 'TRANSLATION_COMPLETE',
        name: 'Complete Translation',
        description: 'Can mark translations as completed',
        category: 'TRANSLATION_MANAGEMENT',
      },
    }),

    // Guest Management Actions
    prisma.action.upsert({
      where: { code: 'GUEST_CREATE' },
      update: {},
      create: {
        code: 'GUEST_CREATE',
        name: 'Create Guest',
        description: 'Can create guest registrations',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_READ' },
      update: {},
      create: {
        code: 'GUEST_READ',
        name: 'Read Guest',
        description: 'Can view guest information',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_UPDATE' },
      update: {},
      create: {
        code: 'GUEST_UPDATE',
        name: 'Update Guest',
        description: 'Can modify guest information',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_DELETE' },
      update: {},
      create: {
        code: 'GUEST_DELETE',
        name: 'Delete Guest',
        description: 'Can delete guest registrations',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_APPROVE' },
      update: {},
      create: {
        code: 'GUEST_APPROVE',
        name: 'Approve Guest',
        description: 'Can approve guest registrations',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_REJECT' },
      update: {},
      create: {
        code: 'GUEST_REJECT',
        name: 'Reject Guest',
        description: 'Reject guest registration',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_CHECKIN' },
      update: {},
      create: {
        code: 'GUEST_CHECKIN',
        name: 'Check-in Guest',
        description: 'Check-in khi guest đến',
        category: 'GUEST_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_CHECKOUT' },
      update: {},
      create: {
        code: 'GUEST_CHECKOUT',
        name: 'Check-out Guest',
        description: 'Check-out khi guest rời đi',
        category: 'GUEST_MANAGEMENT',
      },
    }),

    // Partner Management Actions
    prisma.action.upsert({
      where: { code: 'PARTNER_READ' },
      update: {},
      create: {
        code: 'PARTNER_READ',
        name: 'Read Partner',
        description: 'Can view partner information',
        category: 'PARTNER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PARTNER_CREATE' },
      update: {},
      create: {
        code: 'PARTNER_CREATE',
        name: 'Create Partner',
        description: 'Can create new partners',
        category: 'PARTNER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PARTNER_UPDATE' },
      update: {},
      create: {
        code: 'PARTNER_UPDATE',
        name: 'Update Partner',
        description: 'Can modify partner information',
        category: 'PARTNER_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PARTNER_DELETE' },
      update: {},
      create: {
        code: 'PARTNER_DELETE',
        name: 'Delete Partner',
        description: 'Can delete partners',
        category: 'PARTNER_MANAGEMENT',
      },
    }),

    // Report Management Actions
    prisma.action.upsert({
      where: { code: 'REPORT_GENERATE' },
      update: {},
      create: {
        code: 'REPORT_GENERATE',
        name: 'Generate Report',
        description: 'Can generate various types of reports',
        category: 'REPORT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'REPORT_VIEW' },
      update: {},
      create: {
        code: 'REPORT_VIEW',
        name: 'View Report',
        description: 'Can view generated reports',
        category: 'REPORT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'REPORT_DOWNLOAD' },
      update: {},
      create: {
        code: 'REPORT_DOWNLOAD',
        name: 'Download Report',
        description: 'Can download report files',
        category: 'REPORT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'REPORT_DELETE' },
      update: {},
      create: {
        code: 'REPORT_DELETE',
        name: 'Delete Report',
        description: 'Can delete generated reports',
        category: 'REPORT_MANAGEMENT',
      },
    }),

    // Unit Management Actions
    prisma.action.upsert({
      where: { code: 'UNIT_CREATE' },
      update: {},
      create: {
        code: 'UNIT_CREATE',
        name: 'Create Unit',
        description: 'Can create organizational units',
        category: 'UNIT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'UNIT_READ' },
      update: {},
      create: {
        code: 'UNIT_READ',
        name: 'Read Unit',
        description: 'Can view unit information',
        category: 'UNIT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'UNIT_UPDATE' },
      update: {},
      create: {
        code: 'UNIT_UPDATE',
        name: 'Update Unit',
        description: 'Can modify unit information',
        category: 'UNIT_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'UNIT_DELETE' },
      update: {},
      create: {
        code: 'UNIT_DELETE',
        name: 'Delete Unit',
        description: 'Can delete organizational units',
        category: 'UNIT_MANAGEMENT',
      },
    }),

    // Notification Management Actions
    prisma.action.upsert({
      where: { code: 'NOTIFICATION_SEND' },
      update: {},
      create: {
        code: 'NOTIFICATION_SEND',
        name: 'Send Notification',
        description: 'Can send notifications to users',
        category: 'NOTIFICATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'NOTIFICATION_READ' },
      update: {},
      create: {
        code: 'NOTIFICATION_READ',
        name: 'Read Notification',
        description: 'Can view notification logs',
        category: 'NOTIFICATION_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'NOTIFICATION_TEMPLATE_MANAGE' },
      update: {},
      create: {
        code: 'NOTIFICATION_TEMPLATE_MANAGE',
        name: 'Manage Notification Templates',
        description: 'Can create and modify notification templates',
        category: 'NOTIFICATION_MANAGEMENT',
      },
    }),

    // System Configuration Actions
    prisma.action.upsert({
      where: { code: 'CONFIG_READ' },
      update: {},
      create: {
        code: 'CONFIG_READ',
        name: 'Read Configuration',
        description: 'Can view system configuration',
        category: 'SYSTEM_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'CONFIG_UPDATE' },
      update: {},
      create: {
        code: 'CONFIG_UPDATE',
        name: 'Update Configuration',
        description: 'Can modify system configuration',
        category: 'SYSTEM_MANAGEMENT',
      },
    }),

    // Statistics Actions
    prisma.action.upsert({
      where: { code: 'RBAC_STATISTICS' },
      update: {},
      create: {
        code: 'RBAC_STATISTICS',
        name: 'View RBAC Statistics',
        description: 'Can view RBAC system statistics',
        category: 'SYSTEM_MANAGEMENT',
      },
    }),
    prisma.action.upsert({
      where: { code: 'SYSTEM_LOGS' },
      update: {},
      create: {
        code: 'SYSTEM_LOGS',
        name: 'View System Logs',
        description: 'Can view system logs',
        category: 'SYSTEM_MANAGEMENT',
      },
    }),
  ]);

  console.log(`✅ Created ${actions.length} actions`);

  // Create Permissions
  console.log('Creating permissions...');
  const userManagementPermission = await prisma.permission.upsert({
    where: { code: 'USER_MANAGEMENT' },
    update: {},
    create: {
      code: 'USER_MANAGEMENT',
      name: 'User Management',
      description: 'Full access to user management operations',
    },
  });

  const rbacManagementPermission = await prisma.permission.upsert({
    where: { code: 'RBAC_MANAGEMENT' },
    update: {},
    create: {
      code: 'RBAC_MANAGEMENT',
      name: 'RBAC Management',
      description: 'Full access to role-based access control management',
    },
  });

  const visaManagementPermission = await prisma.permission.upsert({
    where: { code: 'VISA_MANAGEMENT' },
    update: {},
    create: {
      code: 'VISA_MANAGEMENT',
      name: 'Visa Management',
      description: 'Full access to visa management operations',
    },
  });

  const visaViewPermission = await prisma.permission.upsert({
    where: { code: 'VISA_VIEW' },
    update: {},
    create: {
      code: 'VISA_VIEW',
      name: 'Visa View',
      description: 'View-only access to visa information',
    },
  });

  const systemMonitoringPermission = await prisma.permission.upsert({
    where: { code: 'SYSTEM_MONITORING' },
    update: {},
    create: {
      code: 'SYSTEM_MONITORING',
      name: 'System Monitoring',
      description: 'Access to system monitoring and statistics',
    },
  });

  console.log('✅ Created permissions');

  // Assign Actions to Permissions
  console.log('Assigning actions to permissions...');

  // User Management Permission Actions
  const userManagementActions = actions.filter(action => 
    ['USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE', 'USER_ROLE_ASSIGN', 'USER_ROLE_REMOVE', 'USER_ROLE_READ', 'USER_PERMISSION_READ']
    .includes(action.code)
  );
  
  for (const action of userManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: userManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: userManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // RBAC Management Permission Actions
  const rbacManagementActions = actions.filter(action => 
    ['ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE', 'PERMISSION_CREATE', 'PERMISSION_READ', 'PERMISSION_UPDATE', 'PERMISSION_DELETE', 'ACTION_CREATE', 'ACTION_READ', 'ACTION_UPDATE', 'ACTION_DELETE', 'RBAC_STATISTICS']
    .includes(action.code)
  );
  
  for (const action of rbacManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: rbacManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: rbacManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Visa Management Permission Actions (Full CRUD + Approval)
  const visaManagementActions = actions.filter(action => 
    ['VISA_CREATE', 'VISA_READ', 'VISA_UPDATE', 'VISA_DELETE', 'VISA_APPROVE', 'VISA_REJECT', 'VISA_EXTEND']
    .includes(action.code)
  );
  
  for (const action of visaManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: visaManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: visaManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Visa View Permission Actions (Read only)
  const visaViewActions = actions.filter(action => 
    ['VISA_READ'].includes(action.code)
  );
  
  for (const action of visaViewActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: visaViewPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: visaViewPermission.id,
        actionId: action.id,
      },
    });
  }

  // System Monitoring Permission Actions
  const systemMonitoringActions = actions.filter(action => 
    ['RBAC_STATISTICS', 'SYSTEM_LOGS'].includes(action.code)
  );
  
  for (const action of systemMonitoringActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: systemMonitoringPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: systemMonitoringPermission.id,
        actionId: action.id,
      },
    });
  }

  console.log('✅ Assigned actions to permissions');


  // Create additional permissions for all modules
  console.log('Creating additional permissions...');
  
  const documentManagementPermission = await prisma.permission.upsert({
    where: { code: 'DOCUMENT_MANAGEMENT' },
    update: {},
    create: {
      code: 'DOCUMENT_MANAGEMENT',
      name: 'Document Management',
      description: 'Full access to document management operations',
    },
  });

  const translationManagementPermission = await prisma.permission.upsert({
    where: { code: 'TRANSLATION_MANAGEMENT' },
    update: {},
    create: {
      code: 'TRANSLATION_MANAGEMENT',
      name: 'Translation Management',
      description: 'Full access to translation management operations',
    },
  });

  const guestManagementPermission = await prisma.permission.upsert({
    where: { code: 'GUEST_MANAGEMENT' },
    update: {},
    create: {
      code: 'GUEST_MANAGEMENT',
      name: 'Guest Management',
      description: 'Full access to guest management operations',
    },
  });

  const partnerManagementPermission = await prisma.permission.upsert({
    where: { code: 'PARTNER_MANAGEMENT' },
    update: {},
    create: {
      code: 'PARTNER_MANAGEMENT',
      name: 'Partner Management',
      description: 'Full access to partner management operations',
    },
  });

  const reportManagementPermission = await prisma.permission.upsert({
    where: { code: 'REPORT_MANAGEMENT' },
    update: {},
    create: {
      code: 'REPORT_MANAGEMENT',
      name: 'Report Management',
      description: 'Full access to report operations',
    },
  });

  const unitManagementPermission = await prisma.permission.upsert({
    where: { code: 'UNIT_MANAGEMENT' },
    update: {},
    create: {
      code: 'UNIT_MANAGEMENT',
      name: 'Unit Management',
      description: 'Full access to organizational unit management',
    },
  });

  const notificationManagementPermission = await prisma.permission.upsert({
    where: { code: 'NOTIFICATION_MANAGEMENT' },
    update: {},
    create: {
      code: 'NOTIFICATION_MANAGEMENT',
      name: 'Notification Management',
      description: 'Full access to notification operations',
    },
  });

  const systemManagementPermission = await prisma.permission.upsert({
    where: { code: 'SYSTEM_MANAGEMENT' },
    update: {},
    create: {
      code: 'SYSTEM_MANAGEMENT',
      name: 'System Management',
      description: 'Full access to system configuration and monitoring',
    },
  });

  const templateManagementPermission = await prisma.permission.upsert({
    where: { code: 'TEMPLATE_MANAGEMENT' },
    update: {},
    create: {
      code: 'TEMPLATE_MANAGEMENT',
      name: 'Template Management',
      description: 'Full access to template operations',
    },
  });

  console.log('✅ Created additional permissions');

  // Assign actions to new permissions
  console.log('Assigning actions to new permissions...');

  // Document Management Permission Actions
  const documentManagementActions = actions.filter(action => 
    ['DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE', 'DOCUMENT_PROPOSE', 'DOCUMENT_APPROVE', 'DOCUMENT_SIGN', 'DOCUMENT_ACTIVATE', 'DOCUMENT_VIEW',, 'DOCUMENT_FEEDBACK']
    .includes(action.code)
  );
  
  for (const action of documentManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: documentManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: documentManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Translation Management Permission Actions
  const translationManagementActions = actions.filter(action => 
    ['TRANSLATION_CREATE', 'TRANSLATION_READ', 'TRANSLATION_UPDATE', 'TRANSLATION_DELETE', 'TRANSLATION_APPROVE', 'TRANSLATION_REJECT', 'TRANSLATION_COMPLETE']
    .includes(action.code)
  );
  
  for (const action of translationManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: translationManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: translationManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Guest Management Permission Actions
  const guestManagementActions = actions.filter(action => 
    ['GUEST_CREATE', 'GUEST_READ', 'GUEST_UPDATE', 'GUEST_DELETE', 'GUEST_APPROVE','GUEST_REJECT', 'GUEST_CHECKIN', 'GUEST_CHECKOUT']
    .includes(action.code)
  );
  
  for (const action of guestManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: guestManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: guestManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Partner Management Permission Actions
  const partnerManagementActions = actions.filter(action =>
    ['PARTNER_READ', 'PARTNER_CREATE', 'PARTNER_UPDATE', 'PARTNER_DELETE']
    .includes(action.code)
  );

  for (const action of partnerManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: partnerManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: partnerManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Report Management Permission Actions
  const reportManagementActions = actions.filter(action => 
    ['REPORT_GENERATE', 'REPORT_VIEW', 'REPORT_DOWNLOAD', 'REPORT_DELETE']
    .includes(action.code)
  );
  
  for (const action of reportManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: reportManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: reportManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Unit Management Permission Actions
  const unitManagementActions = actions.filter(action => 
    ['UNIT_CREATE', 'UNIT_READ', 'UNIT_UPDATE', 'UNIT_DELETE']
    .includes(action.code)
  );
  
  for (const action of unitManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: unitManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: unitManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Notification Management Permission Actions
  const notificationManagementActions = actions.filter(action => 
    ['NOTIFICATION_SEND', 'NOTIFICATION_READ', 'NOTIFICATION_TEMPLATE_MANAGE']
    .includes(action.code)
  );
  
  for (const action of notificationManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: notificationManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: notificationManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // System Management Permission Actions
  const systemManagementActions = actions.filter(action => 
    ['CONFIG_READ', 'CONFIG_UPDATE', 'RBAC_STATISTICS', 'SYSTEM_LOGS']
    .includes(action.code)
  );
  
  for (const action of systemManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: systemManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: systemManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  // Template Management Permission Actions
  const templateManagementActions = actions.filter(action => 
    ['TEMPLATE_UPLOAD', 'TEMPLATE_MANAGE', 'TEMPLATE_VIEW']
    .includes(action.code)
  );
  
  for (const action of templateManagementActions) {
    await prisma.permissionAction.upsert({
      where: {
        permissionId_actionId: {
          permissionId: templateManagementPermission.id,
          actionId: action.id,
        },
      },
      update: {},
      create: {
        permissionId: templateManagementPermission.id,
        actionId: action.id,
      },
    });
  }

  console.log('✅ Assigned actions to new permissions');

  // Create Roles (using lowercase with underscore to match frontend)
  console.log('Creating roles...');
  const systemAdminRole = await prisma.role.upsert({
    where: { code: 'system_admin' },
    update: {},
    create: {
      code: 'system_admin',
      name: 'Quản trị hệ thống',
      description: 'Full system access with all permissions',
    },
  });

  const departmentOfficerRole = await prisma.role.upsert({
    where: { code: 'department_officer' },
    update: {},
    create: {
      code: 'department_officer',
      name: 'Cán bộ phòng',
      description: 'Department officer with management permissions',
    },
  });

  const leadershipRole = await prisma.role.upsert({
    where: { code: 'leadership' },
    update: {},
    create: {
      code: 'leadership',
      name: 'Lãnh đạo',
      description: 'Leadership with approval and monitoring permissions',
    },
  });

  const facultyStaffRole = await prisma.role.upsert({
    where: { code: 'faculty_staff' },
    update: {},
    create: {
      code: 'faculty_staff',
      name: 'Cán bộ khoa/viện',
      description: 'Faculty staff with operational permissions',
    },
  });

  const studentRole = await prisma.role.upsert({
    where: { code: 'student' },
    update: {},
    create: {
      code: 'student',
      name: 'Sinh viên',
      description: 'Student with limited view permissions',
    },
  });

  console.log('✅ Created roles');

  // Assign Permissions to Roles
  console.log('Assigning permissions to roles...');

  // System Admin - All permissions
  const allPermissions = [
    userManagementPermission, 
    rbacManagementPermission, 
    visaManagementPermission, 
    documentManagementPermission,
    translationManagementPermission,
    guestManagementPermission,
    partnerManagementPermission,
    reportManagementPermission,
    unitManagementPermission,
    notificationManagementPermission,
    systemManagementPermission,
    templateManagementPermission,
  ];
  
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: systemAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: systemAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Department Officer - Most management permissions
  const departmentOfficerPermissions = [
    userManagementPermission,
    visaManagementPermission, 
    documentManagementPermission,
    translationManagementPermission,
    guestManagementPermission,
    partnerManagementPermission,
    reportManagementPermission,
    unitManagementPermission,
    notificationManagementPermission,
    templateManagementPermission,
  ];
  
  for (const permission of departmentOfficerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: departmentOfficerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: departmentOfficerRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Leadership - Approval and monitoring permissions
  const leadershipPermissions = [
    visaManagementPermission,
    documentManagementPermission,
    translationManagementPermission,
    guestManagementPermission,
    reportManagementPermission,
  ];
  
  for (const permission of leadershipPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: leadershipRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: leadershipRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Faculty Staff - Operational permissions
  const facultyStaffPermissions = [
    visaManagementPermission,
    documentManagementPermission,
    translationManagementPermission,
    guestManagementPermission,
  ];
  
  for (const permission of facultyStaffPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: facultyStaffRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: facultyStaffRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Student - View only permission
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: studentRole.id,
        permissionId: visaViewPermission.id,
      },
    },
    update: {},
    create: {
      roleId: studentRole.id,
      permissionId: visaViewPermission.id,
    },
  });

  console.log('✅ Assigned permissions to roles');

  // Create Sample Units
  console.log('Creating sample units...');
  
  const universityUnit = await prisma.unit.upsert({
    where: { name: 'Đại học Bách Khoa - ĐHĐN' },
    update: {},
    create: {
      name: 'Đại học Bách Khoa - ĐHĐN',
      code: 'DUT',
      level: 0,
      isActive: true,
    },
  });

  const internationalRelationsUnit = await prisma.unit.upsert({
    where: { name: 'Phòng Hợp tác Quốc tế' },
    update: {},
    create: {
      name: 'Phòng Hợp tác Quốc tế',
      code: 'HTQT',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  const itFacultyUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Công nghệ Thông tin' },
    update: {},
    create: {
      name: 'Khoa Công nghệ Thông tin',
      code: 'CNTT',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  const engineeringFacultyUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Kỹ thuật Cơ khí' },
    update: {},
    create: {
      name: 'Khoa Kỹ thuật Cơ khí',
      code: 'CK',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  console.log('✅ Created sample units');

  // Create Sample Users with hashed passwords
  console.log('Creating sample users...');
  const bcrypt = require('bcrypt');
  
  // Admin user: admin@dut.udn.vn / Admin@123
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dut.udn.vn' },
    update: {},
    create: {
      email: 'admin@dut.udn.vn',
      password: await bcrypt.hash('Admin@123', 12),
      fullName: 'Quản trị viên hệ thống',
      unitId: internationalRelationsUnit.id,
      isActive: true,
    },
  });

  // Assign system_admin role to admin
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: systemAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: systemAdminRole.id,
    },
  });

  // Department Officer: officer@dut.udn.vn / Officer@123
  const officerUser = await prisma.user.upsert({
    where: { email: 'officer@dut.udn.vn' },
    update: {},
    create: {
      email: 'officer@dut.udn.vn',
      password: await bcrypt.hash('Officer@123', 12),
      fullName: 'Nguyễn Văn A',
      unitId: internationalRelationsUnit.id,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: officerUser.id,
        roleId: departmentOfficerRole.id,
      },
    },
    update: {},
    create: {
      userId: officerUser.id,
      roleId: departmentOfficerRole.id,
    },
  });

  // Leadership: leader@dut.udn.vn / Leader@123
  const leaderUser = await prisma.user.upsert({
    where: { email: 'leader@dut.udn.vn' },
    update: {},
    create: {
      email: 'leader@dut.udn.vn',
      password: await bcrypt.hash('Leader@123', 12),
      fullName: 'Trần Thị B',
      unitId: universityUnit.id,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: leaderUser.id,
        roleId: leadershipRole.id,
      },
    },
    update: {},
    create: {
      userId: leaderUser.id,
      roleId: leadershipRole.id,
    },
  });

  // Faculty Staff: staff@dut.udn.vn / Staff@123
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@dut.udn.vn' },
    update: {},
    create: {
      email: 'staff@dut.udn.vn',
      password: await bcrypt.hash('Staff@123', 12),
      fullName: 'Lê Văn C',
      unitId: itFacultyUnit.id,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: staffUser.id,
        roleId: facultyStaffRole.id,
      },
    },
    update: {},
    create: {
      userId: staffUser.id,
      roleId: facultyStaffRole.id,
    },
  });

  // Student: student@dut.udn.vn / Student@123
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@dut.udn.vn' },
    update: {},
    create: {
      email: 'student@dut.udn.vn',
      password: await bcrypt.hash('Student@123', 12),
      fullName: 'Phạm Thị D',
      unitId: itFacultyUnit.id,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: studentUser.id,
        roleId: studentRole.id,
      },
    },
    update: {},
    create: {
      userId: studentUser.id,
      roleId: studentRole.id,
    },
  });

  console.log('✅ Created sample users');

  // Create sample documents
  console.log('Creating sample documents...');

  // Documents: use findFirst + create because title is not a unique field in the schema
  let sampleDocument1 = await prisma.document.findFirst({ where: { title: 'Biên bản ghi nhớ - Hợp tác CNTT' } });
  if (!sampleDocument1) {
    sampleDocument1 = await prisma.document.create({
      data: {
        title: 'Biên bản ghi nhớ - Hợp tác CNTT',
        type: 'MOU',
        partnerName: 'Đối tác A',
        partnerCountry: 'Việt Nam',
        description: 'Biên bản ghi nhớ hợp tác trong đào tạo và nghiên cứu',
        content: 'Nội dung mẫu của biên bản ghi nhớ...',
        signedDate: new Date(),
        effectiveDate: new Date(),
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
        status: 'APPROVED',
        attachments: [{ path: '/files/mou-cntt.pdf' }],
        proposingUnit: 'Khoa Công nghệ Thông tin',
        signingLevel: 'Faculty',
        signedBy: 'Trưởng khoa CNTT',
        isHighLevelDelegation: false,
        createdById: staffUser.id,
        approvedById: leaderUser.id,
        approvedAt: new Date(),
        unitId: itFacultyUnit.id,
      },
    });
  }

  let sampleDocument2 = await prisma.document.findFirst({ where: { title: 'Hợp tác quốc tế - Đào tạo học viên' } });
  if (!sampleDocument2) {
    sampleDocument2 = await prisma.document.create({
      data: {
        title: 'Hợp tác quốc tế - Đào tạo học viên',
        type: 'AGREEMENT',
        partnerName: 'University B',
        partnerCountry: 'Japan',
        description: 'Thỏa thuận hợp tác trao đổi sinh viên',
        content: 'Nội dung thỏa thuận mẫu...',
        signedDate: new Date(),
        effectiveDate: new Date(),
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        status: 'SIGNED',
        attachments: [{ path: '/files/agreement-ub.pdf' }],
        proposingUnit: 'Phòng Hợp tác Quốc tế',
        signingLevel: 'University',
        signedBy: 'Hiệu trưởng',
        isHighLevelDelegation: true,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date(),
        unitId: internationalRelationsUnit.id,
      },
    });
  }

  let sampleDocument3 = await prisma.document.findFirst({ where: { title: 'Hợp đồng nghiên cứu - Cơ khí' } });
  if (!sampleDocument3) {
    sampleDocument3 = await prisma.document.create({
      data: {
        title: 'Hợp đồng nghiên cứu - Cơ khí',
        type: 'CONTRACT',
        partnerName: 'Công ty C',
        partnerCountry: 'Vietnam',
        description: 'Hợp đồng nghiên cứu ứng dụng với công ty C',
        content: 'Nội dung hợp đồng mẫu...',
        signedDate: new Date(),
        effectiveDate: new Date(),
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'ACTIVE',
        attachments: [{ path: '/files/contract-c.pdf' }],
        proposingUnit: 'Khoa Kỹ thuật Cơ khí',
        signingLevel: 'Faculty',
        signedBy: 'Trưởng khoa CK',
        isHighLevelDelegation: false,
        createdById: adminUser.id,
        approvedById: leaderUser.id,
        approvedAt: new Date(),
        unitId: engineeringFacultyUnit.id,
      },
    });
  }

  console.log('✅ Created sample documents');

  // Create additional units for foreign students
  console.log('Creating additional units...');
  const computerScienceUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Công nghệ Thông tin' },
    update: {},
    create: {
      name: 'Khoa Công nghệ Thông tin',
      code: 'CNTT',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  const mechanicalEngineeringUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Cơ khí' },
    update: {},
    create: {
      name: 'Khoa Cơ khí',
      code: 'CKH',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  const environmentalScienceUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Môi trường' },
    update: {},
    create: {
      name: 'Khoa Môi trường',
      code: 'MT',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  const businessAdminUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Quản trị Kinh doanh' },
    update: {},
    create: {
      name: 'Khoa Quản trị Kinh doanh',
      code: 'QTKD',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  const businessFacultyUnit = await prisma.unit.upsert({
    where: { name: 'Khoa Kinh tế' },
    update: {},
    create: {
      name: 'Khoa Kinh tế',
      code: 'KT',
      parentId: universityUnit.id,
      level: 1,
      isActive: true,
    },
  });

  console.log('✅ Created additional units');

  // Create Partners
  console.log('Creating partners...');
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'University of Tokyo',
        country: 'Japan',
        address: '7-3-1 Hongo, Bunkyo City, Tokyo 113-8654, Japan',
        establishedYear: 1877,
        field: 'Education, Research',
        contactPerson: 'Prof. Hiroshi Tanaka',
        contactEmail: 'international@utokyo.ac.jp',
        contactPhone: '+81-3-5841-0000',
        website: 'https://www.u-tokyo.ac.jp/en/',
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Harvard University',
        country: 'United States',
        address: 'Cambridge, Massachusetts 02138, USA',
        establishedYear: 1636,
        field: 'Education, Research',
        contactPerson: 'Dr. Sarah Johnson',
        contactEmail: 'international@harvard.edu',
        contactPhone: '+1-617-495-1000',
        website: 'https://www.harvard.edu/',
      },
    }),
    prisma.partner.create({
      data: {
        name: 'University of Cambridge',
        country: 'United Kingdom',
        address: 'The Old Schools, Trinity Lane, Cambridge CB2 1TN, UK',
        establishedYear: 1209,
        field: 'Education, Research',
        contactPerson: 'Prof. Michael Thompson',
        contactEmail: 'international@cam.ac.uk',
        contactPhone: '+44-1223-337733',
        website: 'https://www.cam.ac.uk/',
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Technical University Munich',
        country: 'Germany',
        address: 'Arcisstraße 21, 80333 München, Germany',
        establishedYear: 1868,
        field: 'Engineering, Technology',
        contactPerson: 'Dr. Anna Schmidt',
        contactEmail: 'international@tum.de',
        contactPhone: '+49-89-289-01',
        website: 'https://www.tum.de/en/',
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Samsung Electronics',
        country: 'South Korea',
        address: '129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, South Korea',
        establishedYear: 1969,
        field: 'Technology, Electronics',
        contactPerson: 'Mr. Kim Jong-un',
        contactEmail: 'partnership@samsung.com',
        contactPhone: '+82-31-200-1114',
        website: 'https://www.samsung.com/',
      },
    }),
  ]);

  console.log(`✅ Created ${partners.length} partners`);

  // Create Guests
  console.log('Creating guests...');
  const guests = await Promise.all([
    prisma.guest.create({
      data: {
        groupName: 'Japanese Academic Delegation',
        purpose: 'Academic exchange and research collaboration',
        arrivalDate: new Date('2025-11-15'),
        departureDate: new Date('2025-11-20'),
        contactPerson: 'Prof. Hiroshi Tanaka',
        contactEmail: 'delegation1@university.edu',
        contactPhone: '+81-90-1234-5678',
        totalMembers: 5,
        status: 'APPROVED',
        visitPurpose: 'Research collaboration in AI and robotics',
        hostDepartment: 'Faculty of Engineering',
        invitationLetterNo: 'INV-2025-001',
        immigrationDocNA2: '/files/na2-001.pdf',
        visaRequestDocNA5: '/files/na5-001.pdf',
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date(),
        partnerId: partners[0].id, // University of Tokyo
        unitId: engineeringFacultyUnit.id,
      },
    }),
    prisma.guest.create({
      data: {
        groupName: 'Harvard Business School Visit',
        purpose: 'Business education and entrepreneurship workshop',
        arrivalDate: new Date('2025-12-01'),
        departureDate: new Date('2025-12-05'),
        contactPerson: 'Dr. Sarah Johnson',
        contactEmail: 'delegation2@harvard.edu',
        contactPhone: '+1-617-555-0123',
        totalMembers: 3,
        status: 'REGISTERED',
        visitPurpose: 'Entrepreneurship workshop and business case studies',
        hostDepartment: 'Faculty of Business Administration',
        invitationLetterNo: 'INV-2025-002',
        createdById: staffUser.id,
        partnerId: partners[1].id, // Harvard University
        unitId: businessFacultyUnit.id,
      },
    }),
    prisma.guest.create({
      data: {
        groupName: 'Cambridge Research Team',
        purpose: 'Joint research in environmental science',
        arrivalDate: new Date('2026-01-10'),
        departureDate: new Date('2026-01-15'),
        contactPerson: 'Prof. Michael Thompson',
        contactEmail: 'delegation3@cambridge.ac.uk',
        contactPhone: '+44-1223-765432',
        totalMembers: 4,
        status: 'ARRIVED',
        visitPurpose: 'Environmental research collaboration',
        hostDepartment: 'Faculty of Environmental Science',
        invitationLetterNo: 'INV-2025-003',
        immigrationDocNA2: '/files/na2-003.pdf',
        visaRequestDocNA5: '/files/na5-003.pdf',
        reportFile: '/files/visit-report-003.pdf',
        createdById: officerUser.id,
        approvedById: leaderUser.id,
        approvedAt: new Date(),
        partnerId: partners[2].id, // University of Cambridge
        unitId: environmentalScienceUnit.id,
      },
    }),
  ]);

  console.log(`✅ Created ${guests.length} guests`);

  // Create Guest Members
  console.log('Creating guest members...');
  const guestMembers = await Promise.all([
    // Members for Japanese delegation
    prisma.guestMember.create({
      data: {
        guestId: guests[0].id,
        fullName: 'Prof. Hiroshi Tanaka',
        nationality: 'Japan',
        passportNumber: 'JP123456789',
        position: 'Professor',
        organization: 'University of Tokyo',
        email: 'tanaka@utokyo.ac.jp',
        phoneNumber: '+81-90-1234-5678',
        dateOfBirth: new Date('1970-05-15'),
        title: 'PhD',
        gender: 'Male',
        affiliation: 'Department of Robotics',
      },
    }),
    prisma.guestMember.create({
      data: {
        guestId: guests[0].id,
        fullName: 'Dr. Yuki Sato',
        nationality: 'Japan',
        passportNumber: 'JP987654321',
        position: 'Researcher',
        organization: 'University of Tokyo',
        email: 'sato@utokyo.ac.jp',
        phoneNumber: '+81-90-9876-5432',
        dateOfBirth: new Date('1985-03-22'),
        title: 'PhD',
        gender: 'Female',
        affiliation: 'AI Research Center',
      },
    }),
    // Members for Harvard delegation
    prisma.guestMember.create({
      data: {
        guestId: guests[1].id,
        fullName: 'Dr. Sarah Johnson',
        nationality: 'United States',
        passportNumber: 'US123456789',
        position: 'Associate Professor',
        organization: 'Harvard Business School',
        email: 'sjohnson@hbs.edu',
        phoneNumber: '+1-617-555-0123',
        dateOfBirth: new Date('1978-11-08'),
        title: 'PhD',
        gender: 'Female',
        affiliation: 'Entrepreneurship Division',
      },
    }),
    // Members for Cambridge delegation
    prisma.guestMember.create({
      data: {
        guestId: guests[2].id,
        fullName: 'Prof. Michael Thompson',
        nationality: 'United Kingdom',
        passportNumber: 'UK123456789',
        position: 'Professor',
        organization: 'University of Cambridge',
        email: 'mthompson@cam.ac.uk',
        phoneNumber: '+44-1223-765432',
        dateOfBirth: new Date('1965-09-12'),
        title: 'PhD',
        gender: 'Male',
        affiliation: 'Department of Environmental Science',
      },
    }),
    prisma.guestMember.create({
      data: {
        guestId: guests[2].id,
        fullName: 'Dr. Emma Wilson',
        nationality: 'United Kingdom',
        passportNumber: 'UK987654321',
        position: 'Research Fellow',
        organization: 'University of Cambridge',
        email: 'ewilson@cam.ac.uk',
        phoneNumber: '+44-1223-345678',
        dateOfBirth: new Date('1982-07-25'),
        title: 'PhD',
        gender: 'Female',
        affiliation: 'Climate Research Institute',
      },
    }),
  ]);

  console.log(`✅ Created ${guestMembers.length} guest members`);

  // Create Foreign Students
  console.log('Creating foreign students...');
  const foreignStudents = await Promise.all([
    prisma.foreignStudent.create({
      data: {
        fullName: 'Maria Garcia Rodriguez',
        birthDate: new Date('1998-06-15'),
        nationality: 'Spain',
        passportNumber: 'ES123456789',
        program: "Master's in Computer Science",
        departmentId: computerScienceUnit.id,
        supervisor: 'Prof. Nguyen Van A',
        startDate: new Date('2024-09-01'),
        expectedEndDate: new Date('2026-06-30'),
        scholarshipType: 'Government Scholarship',
        email: 'maria.garcia@student.dut.edu.vn',
        phone: '+84-123-456-789',
        status: 'ACTIVE',
      },
    }),
    prisma.foreignStudent.create({
      data: {
        fullName: 'Chen Wei',
        birthDate: new Date('1997-03-20'),
        nationality: 'China',
        passportNumber: 'CN987654321',
        program: 'PhD in Artificial Intelligence',
        departmentId: computerScienceUnit.id,
        supervisor: 'Dr. Tran Thi B',
        startDate: new Date('2023-09-01'),
        expectedEndDate: new Date('2027-06-30'),
        scholarshipType: 'CSC Scholarship',
        email: 'chen.wei@student.dut.edu.vn',
        phone: '+84-987-654-321',
        status: 'ACTIVE',
      },
    }),
    prisma.foreignStudent.create({
      data: {
        fullName: 'Ahmed Hassan',
        birthDate: new Date('1999-12-10'),
        nationality: 'Egypt',
        passportNumber: 'IN123789456',
        program: 'Bachelor in Mechanical Engineering',
        departmentId: mechanicalEngineeringUnit.id,
        supervisor: 'Prof. Le Van C',
        startDate: new Date('2024-10-15'),
        expectedEndDate: new Date('2028-06-30'),
        scholarshipType: 'Self-funded',
        email: 'ahmed.hassan@student.dut.edu.vn',
        phone: '+84-555-123-456',
        status: 'ACTIVE',
      },
    }),
    prisma.foreignStudent.create({
      data: {
        fullName: 'Pierre Dubois',
        birthDate: new Date('1996-08-25'),
        nationality: 'France',
        passportNumber: 'FR456789123',
        program: 'Research Internship - Environmental Science',
        departmentId: environmentalScienceUnit.id,
        supervisor: 'Dr. Pham Thi D',
        startDate: new Date('2025-01-15'),
        expectedEndDate: new Date('2025-06-15'),
        scholarshipType: 'Campus France',
        email: 'pierre.dubois@student.dut.edu.vn',
        phone: '+84-777-888-999',
        status: 'ACTIVE',
      },
    }),
    prisma.foreignStudent.create({
      data: {
        fullName: 'Kim Ji-hoon',
        birthDate: new Date('1995-11-30'),
        nationality: 'South Korea',
        passportNumber: 'KR789123456',
        program: 'Exchange Student - Business Administration',
        departmentId: businessAdminUnit.id,
        supervisor: 'Prof. Hoang Van E',
        startDate: new Date('2024-09-01'),
        expectedEndDate: new Date('2025-06-30'),
        scholarshipType: 'Exchange Program',
        email: 'kim.jihoon@student.dut.edu.vn',
        phone: '+84-333-444-555',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`✅ Created ${foreignStudents.length} foreign students`);

  // Create Visas for foreign students
  console.log('Creating visas...');
  const visas = await Promise.all([
    prisma.visa.create({
      data: {
        holderName: 'Maria Garcia Rodriguez',
        holderCountry: 'Spain',
        passportNumber: 'ES123456789',
        visaNumber: 'VN-2024-001',
        issueDate: new Date('2024-08-15'),
        expirationDate: new Date('2026-06-15'),
        purpose: 'Study',
        sponsorUnit: 'Khoa Công nghệ Thông tin',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-es123456789.pdf' }],
        dateOfBirth: new Date('1998-06-15'),
        visaType: 'Student Visa',
        entryDate: new Date('2024-09-01'),
        program: "Master's in Computer Science",
        department: 'Khoa Công nghệ Thông tin',
        supervisorName: 'Prof. Nguyen Van A',
        email: 'maria.garcia@student.dut.edu.vn',
        phone: '+84-123-456-789',
        na5Request: false,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2024-08-10'),
        unitId: computerScienceUnit.id,
      },
    }),
    prisma.visa.create({
      data: {
        holderName: 'Chen Wei',
        holderCountry: 'China',
        passportNumber: 'CN987654321',
        visaNumber: 'VN-2023-045',
        issueDate: new Date('2023-08-01'),
        expirationDate: new Date('2027-06-01'),
        purpose: 'Study',
        sponsorUnit: 'Khoa Công nghệ Thông tin',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-cn987654321.pdf' }],
        dateOfBirth: new Date('1997-03-20'),
        visaType: 'Student Visa',
        entryDate: new Date('2023-09-01'),
        program: 'PhD in Artificial Intelligence',
        department: 'Khoa Công nghệ Thông tin',
        supervisorName: 'Dr. Tran Thi B',
        email: 'chen.wei@student.dut.edu.vn',
        phone: '+84-987-654-321',
        na5Request: false,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2023-07-25'),
        unitId: computerScienceUnit.id,
      },
    }),
    prisma.visa.create({
      data: {
        holderName: 'Ahmed Hassan',
        holderCountry: 'Egypt',
        passportNumber: 'IN123789456',
        visaNumber: 'VN-2024-089',
        issueDate: new Date('2024-09-20'),
        expirationDate: new Date('2028-06-20'),
        purpose: 'Study',
        sponsorUnit: 'Khoa Cơ khí',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-in123789456.pdf' }],
        dateOfBirth: new Date('1999-12-10'),
        visaType: 'Student Visa',
        entryDate: new Date('2024-10-15'),
        program: 'Bachelor in Mechanical Engineering',
        department: 'Khoa Cơ khí',
        supervisorName: 'Prof. Le Van C',
        email: 'ahmed.hassan@student.dut.edu.vn',
        phone: '+84-555-123-456',
        na5Request: false,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2024-09-15'),
        unitId: mechanicalEngineeringUnit.id,
      },
    }),
    prisma.visa.create({
      data: {
        holderName: 'Pierre Dubois',
        holderCountry: 'France',
        passportNumber: 'FR456789123',
        visaNumber: 'VN-2024-156',
        issueDate: new Date('2024-12-01'),
        expirationDate: new Date('2025-06-01'),
        purpose: 'Research',
        sponsorUnit: 'Khoa Môi trường',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-fr456789123.pdf' }],
        dateOfBirth: new Date('1996-08-25'),
        visaType: 'Research Visa',
        entryDate: new Date('2025-01-15'),
        program: 'Research Internship - Environmental Science',
        department: 'Khoa Môi trường',
        supervisorName: 'Dr. Pham Thi D',
        email: 'pierre.dubois@student.dut.edu.vn',
        phone: '+84-777-888-999',
        na5Request: true,
        extensionRequestDate: new Date('2025-04-15'),
        extensionReason: 'Extend research internship for additional 6 months',
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2024-11-25'),
        unitId: environmentalScienceUnit.id,
      },
    }),
    prisma.visa.create({
      data: {
        holderName: 'Kim Ji-hoon',
        holderCountry: 'South Korea',
        passportNumber: 'KR789123456',
        visaNumber: 'VN-2024-203',
        issueDate: new Date('2024-08-10'),
        expirationDate: new Date('2025-06-10'),
        purpose: 'Study',
        sponsorUnit: 'Khoa Quản trị Kinh doanh',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-kr789123456.pdf' }],
        dateOfBirth: new Date('1995-11-30'),
        visaType: 'Exchange Student Visa',
        entryDate: new Date('2024-09-01'),
        program: 'Exchange Student - Business Administration',
        department: 'Khoa Quản trị Kinh doanh',
        supervisorName: 'Prof. Hoang Van E',
        email: 'kim.jihoon@student.dut.edu.vn',
        phone: '+84-333-444-555',
        na5Request: false,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2024-08-05'),
        unitId: businessAdminUnit.id,
      },
    }),
    // Additional visas for guest members
    prisma.visa.create({
      data: {
        holderName: 'Prof. Hiroshi Tanaka',
        holderCountry: 'Japan',
        passportNumber: 'JP123456789',
        visaNumber: 'VN-2025-301',
        issueDate: new Date('2025-10-15'),
        expirationDate: new Date('2025-11-25'),
        purpose: 'Academic Exchange',
        sponsorUnit: 'Phòng Hợp tác Quốc tế',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-jp123456789.pdf' }],
        dateOfBirth: new Date('1970-05-15'),
        visaType: 'Business Visa',
        entryDate: new Date('2025-11-15'),
        program: 'Academic Delegation Visit',
        department: 'International Relations',
        supervisorName: 'Dr. Nguyen Thi F',
        email: 'tanaka@utokyo.ac.jp',
        phone: '+81-90-1234-5678',
        na5Request: false,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2025-10-10'),
        partnerId: partners[0].id, // University of Tokyo
        unitId: internationalRelationsUnit.id,
      },
    }),
    prisma.visa.create({
      data: {
        holderName: 'Dr. Yuki Sato',
        holderCountry: 'Japan',
        passportNumber: 'JP987654321',
        visaNumber: 'VN-2025-302',
        issueDate: new Date('2025-10-15'),
        expirationDate: new Date('2025-11-25'),
        purpose: 'Academic Exchange',
        sponsorUnit: 'Phòng Hợp tác Quốc tế',
        status: 'ACTIVE',
        attachments: [{ path: '/files/visa-jp987654321.pdf' }],
        dateOfBirth: new Date('1985-03-22'),
        visaType: 'Business Visa',
        entryDate: new Date('2025-11-15'),
        program: 'Academic Delegation Visit',
        department: 'International Relations',
        supervisorName: 'Dr. Nguyen Thi F',
        email: 'sato@utokyo.ac.jp',
        phone: '+81-90-9876-5432',
        na5Request: false,
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2025-10-10'),
        partnerId: partners[0].id, // University of Tokyo
        unitId: internationalRelationsUnit.id,
      },
    }),
  ]);

  console.log(`✅ Created ${visas.length} visas`);

  // Update foreign students with visa IDs
  console.log('Updating foreign students with visa references...');
  await Promise.all([
    prisma.foreignStudent.update({
      where: { id: foreignStudents[0].id },
      data: { visaId: visas[0].id },
    }),
    prisma.foreignStudent.update({
      where: { id: foreignStudents[1].id },
      data: { visaId: visas[1].id },
    }),
    prisma.foreignStudent.update({
      where: { id: foreignStudents[2].id },
      data: { visaId: visas[2].id },
    }),
    prisma.foreignStudent.update({
      where: { id: foreignStudents[3].id },
      data: { visaId: visas[3].id },
    }),
    prisma.foreignStudent.update({
      where: { id: foreignStudents[4].id },
      data: { visaId: visas[4].id },
    }),
  ]);

  console.log('✅ Updated foreign students with visa references');

  // Create Visa Extensions for some visas
  console.log('Creating visa extensions...');
  const visaExtensions = await Promise.all([
    prisma.visaExtension.create({
      data: {
        visaId: visas[3].id, // Pierre Dubois - Research internship
        newExpirationDate: new Date('2025-12-15'),
        reason: 'Extension of research internship for completion of environmental study project',
        status: 'PENDING',
        officialLetter: '/files/extension-na5-fr456789123.pdf',
        createdAt: new Date('2025-04-15'),
      },
    }),
    prisma.visaExtension.create({
      data: {
        visaId: visas[1].id, // Chen Wei - PhD student
        newExpirationDate: new Date('2028-06-01'),
        reason: 'Extension for PhD program completion',
        status: 'APPROVED',
        officialLetter: '/files/extension-na5-cn987654321.pdf',
        createdAt: new Date('2026-10-15'),
      },
    }),
  ]);

  console.log(`✅ Created ${visaExtensions.length} visa extensions`);

  // Create Translation Records
  console.log('Creating translation records...');
  const translations = await Promise.all([
    prisma.translation.create({
      data: {
        applicantName: 'Maria Garcia Rodriguez',
        applicantEmail: 'maria.garcia@student.dut.edu.vn',
        applicantPhone: '+84-123-456-789',
        documentTitle: 'Academic Transcript',
        sourceLanguage: 'Spanish',
        targetLanguage: 'Vietnamese',
        documentType: 'Academic Document',
        purpose: 'University admission verification',
        urgentLevel: 'NORMAL',
        status: 'COMPLETED',
        originalFile: '/files/transcript-maria-spanish.pdf',
        translatedFile: '/files/transcript-maria-vietnamese.pdf',
        certificationFile: '/files/certification-maria.pdf',
        attachments: [{ path: '/files/transcript-maria-additional.pdf' }],
        notes: 'Official academic transcript translation for university admission',
        unitName: 'Khoa Công nghệ Thông tin',
        translatorName: 'Nguyen Thi Translator',
        reason: 'Required for university enrollment',
        verificationFile: '/files/verification-maria.pdf',
        languagePair: 'Spanish-Vietnamese',
        createdById: officerUser.id,
        approvedById: leaderUser.id,
        approvedAt: new Date('2024-08-15'),
        completedAt: new Date('2024-08-20'),
        unitId: computerScienceUnit.id,
      },
    }),
    prisma.translation.create({
      data: {
        applicantName: 'Chen Wei',
        applicantEmail: 'chen.wei@student.dut.edu.vn',
        applicantPhone: '+84-987-654-321',
        documentTitle: 'PhD Thesis Abstract',
        sourceLanguage: 'Chinese',
        targetLanguage: 'English',
        documentType: 'Research Document',
        purpose: 'International publication',
        urgentLevel: 'URGENT',
        status: 'APPROVED',
        originalFile: '/files/thesis-chen-chinese.pdf',
        attachments: [{ path: '/files/thesis-chen-references.pdf' }],
        notes: 'Urgent translation needed for journal submission deadline',
        unitName: 'Khoa Công nghệ Thông tin',
        translatorName: 'Tran Van Translator',
        reason: 'Publication in international journal',
        languagePair: 'Chinese-English',
        createdById: staffUser.id,
        approvedById: officerUser.id,
        approvedAt: new Date('2024-09-01'),
        unitId: computerScienceUnit.id,
      },
    }),
    prisma.translation.create({
      data: {
        applicantName: 'Ahmed Hassan',
        applicantEmail: 'ahmed.hassan@student.dut.edu.vn',
        applicantPhone: '+84-555-123-456',
        documentTitle: 'Bachelor Degree Certificate',
        sourceLanguage: 'Arabic',
        targetLanguage: 'Vietnamese',
        documentType: 'Academic Certificate',
        purpose: 'Degree recognition',
        urgentLevel: 'NORMAL',
        status: 'PENDING',
        originalFile: '/files/degree-ahmed-arabic.pdf',
        notes: 'Degree certificate translation for recognition by Vietnamese authorities',
        unitName: 'Khoa Cơ khí',
        reason: 'Required for degree equivalency evaluation',
        languagePair: 'Arabic-Vietnamese',
        createdById: studentUser.id,
        unitId: mechanicalEngineeringUnit.id,
      },
    }),
    prisma.translation.create({
      data: {
        applicantName: 'Pierre Dubois',
        applicantEmail: 'pierre.dubois@student.dut.edu.vn',
        applicantPhone: '+84-777-888-999',
        documentTitle: 'Research Proposal',
        sourceLanguage: 'French',
        targetLanguage: 'English',
        documentType: 'Research Document',
        purpose: 'International collaboration',
        urgentLevel: 'VERY_URGENT',
        status: 'APPROVED',
        originalFile: '/files/proposal-pierre-french.pdf',
        attachments: [
          { path: '/files/proposal-pierre-appendix1.pdf' },
          { path: '/files/proposal-pierre-appendix2.pdf' }
        ],
        notes: 'Very urgent translation for international research funding application',
        unitName: 'Khoa Môi trường',
        translatorName: 'Pham Thi Translator',
        reason: 'EU research funding application deadline approaching',
        languagePair: 'French-English',
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2024-10-01'),
        unitId: environmentalScienceUnit.id,
      },
    }),
    prisma.translation.create({
      data: {
        applicantName: 'Kim Ji-hoon',
        applicantEmail: 'kim.jihoon@student.dut.edu.vn',
        applicantPhone: '+84-333-444-555',
        documentTitle: 'Business Plan',
        sourceLanguage: 'Korean',
        targetLanguage: 'Vietnamese',
        documentType: 'Business Document',
        purpose: 'Investment partnership',
        urgentLevel: 'NORMAL',
        status: 'COMPLETED',
        originalFile: '/files/businessplan-kim-korean.pdf',
        translatedFile: '/files/businessplan-kim-vietnamese.pdf',
        certificationFile: '/files/certification-kim.pdf',
        notes: 'Business plan translation for Vietnamese-Korean joint venture',
        unitName: 'Khoa Quản trị Kinh doanh',
        translatorName: 'Hoang Van Translator',
        reason: 'Required for business partnership establishment',
        verificationFile: '/files/verification-kim.pdf',
        languagePair: 'Korean-Vietnamese',
        createdById: staffUser.id,
        approvedById: leaderUser.id,
        approvedAt: new Date('2024-09-15'),
        completedAt: new Date('2024-09-25'),
        partnerId: partners[4].id, // Samsung Electronics
        unitId: businessAdminUnit.id,
      },
    }),
    prisma.translation.create({
      data: {
        applicantName: 'Prof. Hiroshi Tanaka',
        applicantEmail: 'delegation1@university.edu',
        applicantPhone: '+81-90-1234-5678',
        documentTitle: 'Memorandum of Understanding',
        sourceLanguage: 'Japanese',
        targetLanguage: 'Vietnamese',
        documentType: 'Legal Document',
        purpose: 'International agreement',
        urgentLevel: 'URGENT',
        status: 'APPROVED',
        originalFile: '/files/mou-hiroshi-japanese.pdf',
        attachments: [{ path: '/files/mou-hiroshi-annex.pdf' }],
        notes: 'Official MOU translation for university partnership',
        unitName: 'Phòng Hợp tác Quốc tế',
        translatorName: 'Le Thi Translator',
        reason: 'Required for official signing ceremony',
        languagePair: 'Japanese-Vietnamese',
        createdById: officerUser.id,
        approvedById: adminUser.id,
        approvedAt: new Date('2024-10-05'),
        partnerId: partners[0].id, // University of Tokyo
        unitId: internationalRelationsUnit.id,
      },
    }),
  ]);

  console.log(`✅ Created ${translations.length} translation records`);

  console.log('🎉 RBAC seed data completed successfully!');

  // Display summary
  const summary = await Promise.all([
    prisma.action.count(),
    prisma.permission.count(),
    prisma.role.count(),
    prisma.permissionAction.count(),
    prisma.rolePermission.count(),
    prisma.document.count(),
    prisma.unit.count(),
    prisma.user.count(),
    prisma.userRole.count(),
    prisma.partner.count(),
    prisma.guest.count(),
    prisma.guestMember.count(),
    prisma.foreignStudent.count(),
    prisma.visa.count(),
    prisma.visaExtension.count(),
    prisma.translation.count(),
  ]);

  console.log('\n📊 RBAC System Summary:');
  console.log(`Actions: ${summary[0]}`);
  console.log(`Permissions: ${summary[1]}`);
  console.log(`Roles: ${summary[2]}`);
  console.log(`Permission-Action Mappings: ${summary[3]}`);
  console.log(`Role-Permission Mappings: ${summary[4]}`);
  console.log(`Documents: ${summary[5]}`);
  console.log(`Units: ${summary[6]}`);
  console.log(`Users: ${summary[7]}`);
  console.log(`User-Role Assignments: ${summary[8]}`);
  console.log(`Partners: ${summary[9]}`);
  console.log(`Guests: ${summary[10]}`);
  console.log(`Guest Members: ${summary[11]}`);
  console.log(`Foreign Students: ${summary[12]}`);
  console.log(`Visas: ${summary[13]}`);
  console.log(`Visa Extensions: ${summary[14]}`);
  console.log(`Translations: ${summary[15]}`);
  
  console.log('\n👥 Sample User Accounts:');
  console.log('1. System Admin: admin@dut.udn.vn / Admin@123');
  console.log('2. Department Officer: officer@dut.udn.vn / Officer@123');
  console.log('3. Leadership: leader@dut.udn.vn / Leader@123');
  console.log('4. Faculty Staff: staff@dut.udn.vn / Staff@123');
  console.log('5. Student: student@dut.udn.vn / Student@123');
}

main()
  .catch((e) => {
    console.error('❌ Error during RBAC seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });