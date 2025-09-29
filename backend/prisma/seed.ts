import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RBAC seed data...');

  // 1. Create System Actions
  console.log('Creating system actions...');
  const actions = await Promise.all([
    // User Management Actions
    prisma.action.upsert({
      where: { code: 'USER_CREATE' },
      update: {},
      create: {
        name: 'Tạo người dùng',
        code: 'USER_CREATE',
        description: 'Quyền tạo người dùng mới',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_READ' },
      update: {},
      create: {
        name: 'Xem người dùng',
        code: 'USER_READ',
        description: 'Quyền xem thông tin người dùng',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật người dùng',
        code: 'USER_UPDATE',
        description: 'Quyền cập nhật thông tin người dùng',
      },
    }),
    prisma.action.upsert({
      where: { code: 'USER_DELETE' },
      update: {},
      create: {
        name: 'Xóa người dùng',
        code: 'USER_DELETE',
        description: 'Quyền xóa người dùng',
      },
    }),

    // Role Management Actions
    prisma.action.upsert({
      where: { code: 'ROLE_CREATE' },
      update: {},
      create: {
        name: 'Tạo vai trò',
        code: 'ROLE_CREATE',
        description: 'Quyền tạo vai trò mới',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ROLE_READ' },
      update: {},
      create: {
        name: 'Xem vai trò',
        code: 'ROLE_READ',
        description: 'Quyền xem thông tin vai trò',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ROLE_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật vai trò',
        code: 'ROLE_UPDATE',
        description: 'Quyền cập nhật vai trò',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ROLE_DELETE' },
      update: {},
      create: {
        name: 'Xóa vai trò',
        code: 'ROLE_DELETE',
        description: 'Quyền xóa vai trò',
      },
    }),

    // Permission Management Actions
    prisma.action.upsert({
      where: { code: 'PERMISSION_CREATE' },
      update: {},
      create: {
        name: 'Tạo quyền',
        code: 'PERMISSION_CREATE',
        description: 'Quyền tạo quyền hạn mới',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PERMISSION_READ' },
      update: {},
      create: {
        name: 'Xem quyền',
        code: 'PERMISSION_READ',
        description: 'Quyền xem thông tin quyền hạn',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PERMISSION_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật quyền',
        code: 'PERMISSION_UPDATE',
        description: 'Quyền cập nhật quyền hạn',
      },
    }),
    prisma.action.upsert({
      where: { code: 'PERMISSION_DELETE' },
      update: {},
      create: {
        name: 'Xóa quyền',
        code: 'PERMISSION_DELETE',
        description: 'Quyền xóa quyền hạn',
      },
    }),

    // Action Management Actions
    prisma.action.upsert({
      where: { code: 'ACTION_CREATE' },
      update: {},
      create: {
        name: 'Tạo hành động',
        code: 'ACTION_CREATE',
        description: 'Quyền tạo hành động mới',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ACTION_READ' },
      update: {},
      create: {
        name: 'Xem hành động',
        code: 'ACTION_READ',
        description: 'Quyền xem thông tin hành động',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ACTION_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật hành động',
        code: 'ACTION_UPDATE',
        description: 'Quyền cập nhật hành động',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ACTION_DELETE' },
      update: {},
      create: {
        name: 'Xóa hành động',
        code: 'ACTION_DELETE',
        description: 'Quyền xóa hành động',
      },
    }),

    // Document Management Actions
    prisma.action.upsert({
      where: { code: 'DOCUMENT_CREATE' },
      update: {},
      create: {
        name: 'Tạo tài liệu',
        code: 'DOCUMENT_CREATE',
        description: 'Quyền tạo tài liệu MOU/Agreement',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_READ' },
      update: {},
      create: {
        name: 'Xem tài liệu',
        code: 'DOCUMENT_READ',
        description: 'Quyền xem tài liệu MOU/Agreement',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật tài liệu',
        code: 'DOCUMENT_UPDATE',
        description: 'Quyền cập nhật tài liệu MOU/Agreement',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_DELETE' },
      update: {},
      create: {
        name: 'Xóa tài liệu',
        code: 'DOCUMENT_DELETE',
        description: 'Quyền xóa tài liệu MOU/Agreement',
      },
    }),
    prisma.action.upsert({
      where: { code: 'DOCUMENT_APPROVE' },
      update: {},
      create: {
        name: 'Phê duyệt tài liệu',
        code: 'DOCUMENT_APPROVE',
        description: 'Quyền phê duyệt tài liệu MOU/Agreement',
      },
    }),

    // Visa Management Actions
    prisma.action.upsert({
      where: { code: 'VISA_CREATE' },
      update: {},
      create: {
        name: 'Tạo hồ sơ visa',
        code: 'VISA_CREATE',
        description: 'Quyền tạo hồ sơ visa',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_READ' },
      update: {},
      create: {
        name: 'Xem hồ sơ visa',
        code: 'VISA_READ',
        description: 'Quyền xem hồ sơ visa',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật hồ sơ visa',
        code: 'VISA_UPDATE',
        description: 'Quyền cập nhật hồ sơ visa',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_DELETE' },
      update: {},
      create: {
        name: 'Xóa hồ sơ visa',
        code: 'VISA_DELETE',
        description: 'Quyền xóa hồ sơ visa',
      },
    }),
    prisma.action.upsert({
      where: { code: 'VISA_APPROVE' },
      update: {},
      create: {
        name: 'Phê duyệt visa',
        code: 'VISA_APPROVE',
        description: 'Quyền phê duyệt hồ sơ visa',
      },
    }),

    // Guest Management Actions
    prisma.action.upsert({
      where: { code: 'GUEST_CREATE' },
      update: {},
      create: {
        name: 'Tạo đơn đăng ký khách',
        code: 'GUEST_CREATE',
        description: 'Quyền tạo đơn đăng ký khách quốc tế',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_READ' },
      update: {},
      create: {
        name: 'Xem đơn đăng ký khách',
        code: 'GUEST_READ',
        description: 'Quyền xem đơn đăng ký khách quốc tế',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật đơn đăng ký khách',
        code: 'GUEST_UPDATE',
        description: 'Quyền cập nhật đơn đăng ký khách quốc tế',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_DELETE' },
      update: {},
      create: {
        name: 'Xóa đơn đăng ký khách',
        code: 'GUEST_DELETE',
        description: 'Quyền xóa đơn đăng ký khách quốc tế',
      },
    }),
    prisma.action.upsert({
      where: { code: 'GUEST_APPROVE' },
      update: {},
      create: {
        name: 'Phê duyệt đăng ký khách',
        code: 'GUEST_APPROVE',
        description: 'Quyền phê duyệt đăng ký khách quốc tế',
      },
    }),

    // Translation Management Actions
    prisma.action.upsert({
      where: { code: 'TRANSLATION_CREATE' },
      update: {},
      create: {
        name: 'Tạo yêu cầu dịch thuật',
        code: 'TRANSLATION_CREATE',
        description: 'Quyền tạo yêu cầu dịch thuật và chứng nhận',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_READ' },
      update: {},
      create: {
        name: 'Xem yêu cầu dịch thuật',
        code: 'TRANSLATION_READ',
        description: 'Quyền xem yêu cầu dịch thuật và chứng nhận',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật yêu cầu dịch thuật',
        code: 'TRANSLATION_UPDATE',
        description: 'Quyền cập nhật yêu cầu dịch thuật và chứng nhận',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_DELETE' },
      update: {},
      create: {
        name: 'Xóa yêu cầu dịch thuật',
        code: 'TRANSLATION_DELETE',
        description: 'Quyền xóa yêu cầu dịch thuật và chứng nhận',
      },
    }),
    prisma.action.upsert({
      where: { code: 'TRANSLATION_APPROVE' },
      update: {},
      create: {
        name: 'Phê duyệt yêu cầu dịch thuật',
        code: 'TRANSLATION_APPROVE',
        description: 'Quyền phê duyệt yêu cầu dịch thuật và chứng nhận',
      },
    }),

    // System Actions
    prisma.action.upsert({
      where: { code: 'SYSTEM_CONFIG_READ' },
      update: {},
      create: {
        name: 'Xem cấu hình hệ thống',
        code: 'SYSTEM_CONFIG_READ',
        description: 'Quyền xem cấu hình hệ thống',
      },
    }),
    prisma.action.upsert({
      where: { code: 'SYSTEM_CONFIG_UPDATE' },
      update: {},
      create: {
        name: 'Cập nhật cấu hình hệ thống',
        code: 'SYSTEM_CONFIG_UPDATE',
        description: 'Quyền cập nhật cấu hình hệ thống',
      },
    }),
    prisma.action.upsert({
      where: { code: 'REPORT_GENERATE' },
      update: {},
      create: {
        name: 'Tạo báo cáo',
        code: 'REPORT_GENERATE',
        description: 'Quyền tạo và xuất báo cáo',
      },
    }),
    prisma.action.upsert({
      where: { code: 'ANALYTICS_VIEW' },
      update: {},
      create: {
        name: 'Xem phân tích',
        code: 'ANALYTICS_VIEW',
        description: 'Quyền xem dashboard và phân tích dữ liệu',
      },
    }),
  ]);

  console.log(`✅ Created ${actions.length} actions`);

  // 2. Create System Permissions
  console.log('Creating system permissions...');
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { code: 'USER_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý người dùng',
        code: 'USER_MANAGEMENT',
        description: 'Quyền quản lý người dùng hệ thống',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'RBAC_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý phân quyền',
        code: 'RBAC_MANAGEMENT',
        description: 'Quyền quản lý vai trò, quyền hạn và phân quyền',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'DOCUMENT_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý tài liệu MOU',
        code: 'DOCUMENT_MANAGEMENT',
        description: 'Quyền quản lý tài liệu MOU/Agreement',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'VISA_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý visa',
        code: 'VISA_MANAGEMENT',
        description: 'Quyền quản lý hồ sơ visa và gia hạn',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'GUEST_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý khách quốc tế',
        code: 'GUEST_MANAGEMENT',
        description: 'Quyền quản lý đăng ký khách quốc tế',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'TRANSLATION_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý dịch thuật',
        code: 'TRANSLATION_MANAGEMENT',
        description: 'Quyền quản lý yêu cầu dịch thuật và chứng nhận',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'SYSTEM_MANAGEMENT' },
      update: {},
      create: {
        name: 'Quản lý hệ thống',
        code: 'SYSTEM_MANAGEMENT',
        description: 'Quyền quản lý cấu hình và vận hành hệ thống',
      },
    }),
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // 3. Create System Roles
  console.log('Creating system roles...');
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { code: 'SYSTEM_ADMIN' },
      update: {},
      create: {
        name: 'Quản trị hệ thống',
        code: 'SYSTEM_ADMIN',
        description: 'Quyền cao nhất trong hệ thống, quản lý toàn bộ',
      },
    }),
    prisma.role.upsert({
      where: { code: 'ADMIN' },
      update: {},
      create: {
        name: 'Quản trị viên',
        code: 'ADMIN',
        description: 'Quản trị viên phòng Hợp tác quốc tế',
      },
    }),
    prisma.role.upsert({
      where: { code: 'MANAGER' },
      update: {},
      create: {
        name: 'Quản lý',
        code: 'MANAGER',
        description: 'Trưởng/Phó phòng Hợp tác quốc tế',
      },
    }),
    prisma.role.upsert({
      where: { code: 'SPECIALIST' },
      update: {},
      create: {
        name: 'Chuyên viên',
        code: 'SPECIALIST',
        description: 'Chuyên viên phòng Hợp tác quốc tế',
      },
    }),
    prisma.role.upsert({
      where: { code: 'STAFF' },
      update: {},
      create: {
        name: 'Nhân viên',
        code: 'STAFF',
        description: 'Nhân viên phòng Hợp tác quốc tế',
      },
    }),
    prisma.role.upsert({
      where: { code: 'STUDENT' },
      update: {},
      create: {
        name: 'Sinh viên',
        code: 'STUDENT',
        description: 'Sinh viên có thể xem một số thông tin và tạo yêu cầu',
      },
    }),
    prisma.role.upsert({
      where: { code: 'VIEWER' },
      update: {},
      create: {
        name: 'Người xem',
        code: 'VIEWER',
        description: 'Chỉ có quyền xem thông tin cơ bản',
      },
    }),
  ]);

  console.log(`✅ Created ${roles.length} roles`);

  // 4. Assign Actions to Permissions
  console.log('Assigning actions to permissions...');
  
  // Get permission and action IDs
  const userMgmtPerm = await prisma.permission.findUnique({ where: { code: 'USER_MANAGEMENT' } });
  const rbacMgmtPerm = await prisma.permission.findUnique({ where: { code: 'RBAC_MANAGEMENT' } });
  const docMgmtPerm = await prisma.permission.findUnique({ where: { code: 'DOCUMENT_MANAGEMENT' } });
  const visaMgmtPerm = await prisma.permission.findUnique({ where: { code: 'VISA_MANAGEMENT' } });
  const guestMgmtPerm = await prisma.permission.findUnique({ where: { code: 'GUEST_MANAGEMENT' } });
  const translationMgmtPerm = await prisma.permission.findUnique({ where: { code: 'TRANSLATION_MANAGEMENT' } });
  const systemMgmtPerm = await prisma.permission.findUnique({ where: { code: 'SYSTEM_MANAGEMENT' } });

  // Assign user management actions
  const userActions = ['USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE'];
  for (const actionCode of userActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && userMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: userMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: userMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  // Assign RBAC management actions
  const rbacActions = [
    'ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE',
    'PERMISSION_CREATE', 'PERMISSION_READ', 'PERMISSION_UPDATE', 'PERMISSION_DELETE',
    'ACTION_CREATE', 'ACTION_READ', 'ACTION_UPDATE', 'ACTION_DELETE'
  ];
  for (const actionCode of rbacActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && rbacMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: rbacMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: rbacMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  // Assign document management actions
  const docActions = ['DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE', 'DOCUMENT_APPROVE'];
  for (const actionCode of docActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && docMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: docMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: docMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  // Assign visa management actions
  const visaActions = ['VISA_CREATE', 'VISA_READ', 'VISA_UPDATE', 'VISA_DELETE', 'VISA_APPROVE'];
  for (const actionCode of visaActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && visaMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: visaMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: visaMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  // Assign guest management actions
  const guestActions = ['GUEST_CREATE', 'GUEST_READ', 'GUEST_UPDATE', 'GUEST_DELETE', 'GUEST_APPROVE'];
  for (const actionCode of guestActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && guestMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: guestMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: guestMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  // Assign translation management actions
  const translationActions = ['TRANSLATION_CREATE', 'TRANSLATION_READ', 'TRANSLATION_UPDATE', 'TRANSLATION_DELETE', 'TRANSLATION_APPROVE'];
  for (const actionCode of translationActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && translationMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: translationMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: translationMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  // Assign system management actions
  const systemActions = ['SYSTEM_CONFIG_READ', 'SYSTEM_CONFIG_UPDATE', 'REPORT_GENERATE', 'ANALYTICS_VIEW'];
  for (const actionCode of systemActions) {
    const action = await prisma.action.findUnique({ where: { code: actionCode } });
    if (action && systemMgmtPerm) {
      await prisma.permissionAction.upsert({
        where: {
          permissionId_actionId: {
            permissionId: systemMgmtPerm.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          permissionId: systemMgmtPerm.id,
          actionId: action.id,
        },
      });
    }
  }

  console.log('✅ Assigned actions to permissions');

  // 5. Assign Permissions to Roles
  console.log('Assigning permissions to roles...');

  // SYSTEM_ADMIN - All permissions
  const systemAdminRole = await prisma.role.findUnique({ where: { code: 'SYSTEM_ADMIN' } });
  if (systemAdminRole) {
    for (const permission of permissions) {
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
  }

  // ADMIN - All except RBAC_MANAGEMENT and SYSTEM_MANAGEMENT
  const adminRole = await prisma.role.findUnique({ where: { code: 'ADMIN' } });
  if (adminRole) {
    const adminPermissions = [
      'USER_MANAGEMENT',
      'DOCUMENT_MANAGEMENT',
      'VISA_MANAGEMENT', 
      'GUEST_MANAGEMENT',
      'TRANSLATION_MANAGEMENT'
    ];
    for (const permCode of adminPermissions) {
      const permission = await prisma.permission.findUnique({ where: { code: permCode } });
      if (permission) {
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
    }
  }

  // MANAGER - All business permissions
  const managerRole = await prisma.role.findUnique({ where: { code: 'MANAGER' } });
  if (managerRole) {
    const managerPermissions = [
      'DOCUMENT_MANAGEMENT',
      'VISA_MANAGEMENT',
      'GUEST_MANAGEMENT',
      'TRANSLATION_MANAGEMENT'
    ];
    for (const permCode of managerPermissions) {
      const permission = await prisma.permission.findUnique({ where: { code: permCode } });
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: managerRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: managerRole.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  // SPECIALIST - Document, Visa, Guest management
  const specialistRole = await prisma.role.findUnique({ where: { code: 'SPECIALIST' } });
  if (specialistRole) {
    const specialistPermissions = [
      'DOCUMENT_MANAGEMENT',
      'VISA_MANAGEMENT',
      'GUEST_MANAGEMENT'
    ];
    for (const permCode of specialistPermissions) {
      const permission = await prisma.permission.findUnique({ where: { code: permCode } });
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: specialistRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: specialistRole.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  // STAFF - Limited permissions (Read + Create only)
  const staffRole = await prisma.role.findUnique({ where: { code: 'STAFF' } });
  if (staffRole) {
    const staffPermissions = ['TRANSLATION_MANAGEMENT'];
    for (const permCode of staffPermissions) {
      const permission = await prisma.permission.findUnique({ where: { code: permCode } });
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: staffRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: staffRole.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  console.log('✅ Assigned permissions to roles');

  // 6. Create Default Unit
  console.log('Creating default unit...');
  const defaultUnit = await prisma.unit.upsert({
    where: { code: 'HTQT' },
    update: {},
    create: {
      name: 'Phòng Hợp tác Quốc tế',
      code: 'HTQT',
      level: 0,
    },
  });

  // 7. Create System Admin User
  console.log('Creating system admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const systemAdmin = await prisma.user.upsert({
    where: { email: 'admin@dntu.edu.vn' },
    update: {},
    create: {
      email: 'admin@dntu.edu.vn',
      password: hashedPassword,
      fullName: 'System Administrator',
      unitId: defaultUnit.id,
      isActive: true,
      isVerified: true,
    },
  });

  // Assign SYSTEM_ADMIN role to admin user
  if (systemAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: systemAdmin.id,
          roleId: systemAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: systemAdmin.id,
        roleId: systemAdminRole.id,
      },
    });
  }

  console.log('✅ Created system admin user');

  // 8. Create Sample Users with Different Roles
  console.log('Creating sample users...');
  
  const sampleUsers = [
    {
      email: 'manager@dntu.edu.vn',
      password: 'manager123',
      fullName: 'Trưởng phòng HTQT',
      roleCode: 'MANAGER',
    },
    {
      email: 'specialist@dntu.edu.vn', 
      password: 'specialist123',
      fullName: 'Chuyên viên HTQT',
      roleCode: 'SPECIALIST',
    },
    {
      email: 'staff@dntu.edu.vn',
      password: 'staff123', 
      fullName: 'Nhân viên HTQT',
      roleCode: 'STAFF',
    },
    {
      email: 'student@dntu.edu.vn',
      password: 'student123',
      fullName: 'Sinh viên',
      roleCode: 'STUDENT',
    },
  ];

  for (const userData of sampleUsers) {
    const hashedPwd = await bcrypt.hash(userData.password, 12);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPwd,
        fullName: userData.fullName,
        unitId: defaultUnit.id,
        isActive: true,
        isVerified: true,
      },
    });

    const role = await prisma.role.findUnique({ where: { code: userData.roleCode } });
    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
  }

  console.log('✅ Created sample users');

  console.log('🎉 RBAC seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });