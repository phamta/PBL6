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
    ['VISA_CREATE', 'VISA_READ', 'VISA_UPDATE', 'VISA_DELETE', 'VISA_APPROVE', 'VISA_REJECT']
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
    ['DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE', 'DOCUMENT_PROPOSE', 'DOCUMENT_APPROVE', 'DOCUMENT_SIGN', 'DOCUMENT_ACTIVATE', 'DOCUMENT_VIEW', 'DOCUMENT_FEEDBACK']
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
    ['TRANSLATION_CREATE', 'TRANSLATION_READ', 'TRANSLATION_UPDATE', 'TRANSLATION_DELETE', 'TRANSLATION_APPROVE', 'TRANSLATION_COMPLETE']
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
    ['GUEST_CREATE', 'GUEST_READ', 'GUEST_UPDATE', 'GUEST_DELETE', 'GUEST_APPROVE']
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