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

  // Create Roles
  console.log('Creating roles...');
  const systemAdminRole = await prisma.role.upsert({
    where: { code: 'SYSTEM_ADMIN' },
    update: {},
    create: {
      code: 'SYSTEM_ADMIN',
      name: 'System Administrator',
      description: 'Full system access with all permissions',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      code: 'ADMIN',
      name: 'Administrator',
      description: 'Administrative access to most system functions',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { code: 'MANAGER' },
    update: {},
    create: {
      code: 'MANAGER',
      name: 'Manager',
      description: 'Management level access with approval permissions',
    },
  });

  const specialistRole = await prisma.role.upsert({
    where: { code: 'SPECIALIST' },
    update: {},
    create: {
      code: 'SPECIALIST',
      name: 'Specialist',
      description: 'Specialized access for specific domain operations',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { code: 'STAFF' },
    update: {},
    create: {
      code: 'STAFF',
      name: 'Staff',
      description: 'Standard staff access for daily operations',
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { code: 'VIEWER' },
    update: {},
    create: {
      code: 'VIEWER',
      name: 'Viewer',
      description: 'Read-only access to system information',
    },
  });

  console.log('✅ Created roles');

  // Assign Permissions to Roles
  console.log('Assigning permissions to roles...');

  // System Admin - All permissions
  const allPermissions = [userManagementPermission, rbacManagementPermission, visaManagementPermission, systemMonitoringPermission];
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

  // Admin - User Management + Visa Management + System Monitoring
  const adminPermissions = [userManagementPermission, visaManagementPermission, systemMonitoringPermission];
  for (const permission of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Manager - Visa Management
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: managerRole.id,
        permissionId: visaManagementPermission.id,
      },
    },
    update: {},
    create: {
      roleId: managerRole.id,
      permissionId: visaManagementPermission.id,
    },
  });

  // Specialist - Visa Management
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: specialistRole.id,
        permissionId: visaManagementPermission.id,
      },
    },
    update: {},
    create: {
      roleId: specialistRole.id,
      permissionId: visaManagementPermission.id,
    },
  });

  // Staff - Visa Management (limited)
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: staffRole.id,
        permissionId: visaManagementPermission.id,
      },
    },
    update: {},
    create: {
      roleId: staffRole.id,
      permissionId: visaManagementPermission.id,
    },
  });

  // Viewer - Visa View only
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: viewerRole.id,
        permissionId: visaViewPermission.id,
      },
    },
    update: {},
    create: {
      roleId: viewerRole.id,
      permissionId: visaViewPermission.id,
    },
  });

  console.log('✅ Assigned permissions to roles');

  console.log('🎉 RBAC seed data completed successfully!');

  // Display summary
  const summary = await Promise.all([
    prisma.action.count(),
    prisma.permission.count(),
    prisma.role.count(),
    prisma.permissionAction.count(),
    prisma.rolePermission.count(),
  ]);

  console.log('\n📊 RBAC System Summary:');
  console.log(`Actions: ${summary[0]}`);
  console.log(`Permissions: ${summary[1]}`);
  console.log(`Roles: ${summary[2]}`);
  console.log(`Permission-Action Mappings: ${summary[3]}`);
  console.log(`Role-Permission Mappings: ${summary[4]}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during RBAC seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });