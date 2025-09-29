import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  CreateActionDto,
  UpdateActionDto,
  AssignRoleToUserDto,
  AssignMultipleRolesDto,
  AssignPermissionToRoleDto,
  AssignMultiplePermissionsDto,
  AssignActionToPermissionDto,
  AssignMultipleActionsDto,
} from './dto';
import { Role, Permission, Action, UserRole, RolePermission, PermissionAction, User, Prisma } from '@prisma/client';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== ROLE MANAGEMENT ====================

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data: {
          name: createRoleDto.name,
          code: createRoleDto.code,
          description: createRoleDto.description,
          isActive: createRoleDto.isActive ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Role name or code already exists');
        }
      }
      throw error;
    }
  }

  async getRoles(includeInactive: boolean = false) {
    const where: Prisma.RoleWhereInput = includeInactive ? {} : { isActive: true };

    return this.prisma.role.findMany({
      where,
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                actions: {
                  include: { action: true },
                },
              },
            },
          },
        },
        users: {
          include: {
            user: { select: { id: true, email: true, fullName: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                actions: { include: { action: true } },
              },
            },
          },
        },
        users: {
          include: {
            user: { select: { id: true, email: true, fullName: true } },
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.getRoleById(id);

    try {
      return await this.prisma.role.update({
        where: { id },
        data: updateRoleDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Role name or code already exists');
        }
      }
      throw error;
    }
  }

  async deleteRole(id: string): Promise<Role> {
    await this.getRoleById(id);
    return this.prisma.role.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== PERMISSION MANAGEMENT ====================

  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      return await this.prisma.permission.create({
        data: {
          name: createPermissionDto.name,
          code: createPermissionDto.code,
          description: createPermissionDto.description,
          isActive: createPermissionDto.isActive ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Permission name or code already exists');
        }
      }
      throw error;
    }
  }

  async getPermissions(includeInactive: boolean = false) {
    const where: Prisma.PermissionWhereInput = includeInactive ? {} : { isActive: true };

    return this.prisma.permission.findMany({
      where,
      include: {
        actions: { include: { action: true } },
        roles: { include: { role: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getPermissionById(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        actions: { include: { action: true } },
        roles: { include: { role: true } },
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    await this.getPermissionById(id);

    try {
      return await this.prisma.permission.update({
        where: { id },
        data: updatePermissionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Permission name or code already exists');
        }
      }
      throw error;
    }
  }

  async deletePermission(id: string): Promise<Permission> {
    await this.getPermissionById(id);
    return this.prisma.permission.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== ACTION MANAGEMENT ====================

  async createAction(createActionDto: CreateActionDto): Promise<Action> {
    try {
      return await this.prisma.action.create({
        data: {
          name: createActionDto.name,
          code: createActionDto.code,
          description: createActionDto.description,
          isActive: createActionDto.isActive ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Action code already exists');
        }
      }
      throw error;
    }
  }

  async getActions(includeInactive: boolean = false) {
    const where: Prisma.ActionWhereInput = includeInactive ? {} : { isActive: true };

    return this.prisma.action.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        category: true,
      },
      orderBy: [
        { category: 'asc' },
        { code: 'asc' },
      ],
    });
  }

  async getActionsGroupedByCategory(includeInactive: boolean = false) {
    const actions = await this.getActions(includeInactive);
    
    // Group actions by category
    const grouped = actions.reduce((acc, action) => {
      const category = action.category || 'UNCATEGORIZED';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(action);
      return acc;
    }, {} as Record<string, typeof actions>);

    // Convert to array format with category info
    return Object.entries(grouped).map(([category, actions]) => ({
      category,
      actions,
      count: actions.length,
    })).sort((a, b) => a.category.localeCompare(b.category));
  }

  async getActionById(id: string): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id },
    });

    if (!action) {
      throw new NotFoundException(`Action with ID ${id} not found`);
    }

    return action;
  }

  async updateAction(id: string, updateActionDto: UpdateActionDto): Promise<Action> {
    await this.getActionById(id);

    try {
      return await this.prisma.action.update({
        where: { id },
        data: updateActionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Action code already exists');
        }
      }
      throw error;
    }
  }

  async deleteAction(id: string): Promise<Action> {
    await this.getActionById(id);
    return this.prisma.action.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== ASSIGNMENT OPERATIONS ====================

  async assignRoleToUser(assignDto: AssignRoleToUserDto): Promise<UserRole> {
    const user = await this.prisma.user.findUnique({
      where: { id: assignDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${assignDto.userId} not found`);
    }

    await this.getRoleById(assignDto.roleId);

    const existingAssignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: assignDto.userId,
          roleId: assignDto.roleId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictException('User already has this role assigned');
    }

    return this.prisma.userRole.create({
      data: {
        userId: assignDto.userId,
        roleId: assignDto.roleId,
      },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const assignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Role assignment not found');
    }

    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  async assignMultipleRoles(assignDto: AssignMultipleRolesDto): Promise<UserRole[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: assignDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${assignDto.userId} not found`);
    }

    for (const roleId of assignDto.roleIds) {
      await this.getRoleById(roleId);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId: assignDto.userId },
      });

      const assignments = [];
      for (const roleId of assignDto.roleIds) {
        const assignment = await tx.userRole.create({
          data: {
            userId: assignDto.userId,
            roleId: roleId,
          },
        });
        assignments.push(assignment);
      }

      return assignments;
    });
  }

  async assignPermissionToRole(assignDto: AssignPermissionToRoleDto): Promise<RolePermission> {
    await this.getRoleById(assignDto.roleId);
    await this.getPermissionById(assignDto.permissionId);

    const existingAssignment = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: assignDto.roleId,
          permissionId: assignDto.permissionId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictException('Role already has this permission assigned');
    }

    return this.prisma.rolePermission.create({
      data: {
        roleId: assignDto.roleId,
        permissionId: assignDto.permissionId,
      },
    });
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const assignment = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Permission assignment not found');
    }

    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }

  async assignMultiplePermissions(assignDto: AssignMultiplePermissionsDto): Promise<RolePermission[]> {
    await this.getRoleById(assignDto.roleId);

    for (const permissionId of assignDto.permissionIds) {
      await this.getPermissionById(permissionId);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: { roleId: assignDto.roleId },
      });

      const assignments = [];
      for (const permissionId of assignDto.permissionIds) {
        const assignment = await tx.rolePermission.create({
          data: {
            roleId: assignDto.roleId,
            permissionId: permissionId,
          },
        });
        assignments.push(assignment);
      }

      return assignments;
    });
  }

  async assignActionToPermission(assignDto: AssignActionToPermissionDto): Promise<PermissionAction> {
    await this.getPermissionById(assignDto.permissionId);
    await this.getActionById(assignDto.actionId);

    const existingAssignment = await this.prisma.permissionAction.findUnique({
      where: {
        permissionId_actionId: {
          permissionId: assignDto.permissionId,
          actionId: assignDto.actionId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictException('Permission already has this action assigned');
    }

    return this.prisma.permissionAction.create({
      data: {
        permissionId: assignDto.permissionId,
        actionId: assignDto.actionId,
      },
    });
  }

  async assignMultipleActions(assignDto: AssignMultipleActionsDto): Promise<PermissionAction[]> {
    await this.getPermissionById(assignDto.permissionId);

    for (const actionId of assignDto.actionIds) {
      await this.getActionById(actionId);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.permissionAction.deleteMany({
        where: { permissionId: assignDto.permissionId },
      });

      const assignments = [];
      for (const actionId of assignDto.actionIds) {
        const assignment = await tx.permissionAction.create({
          data: {
            permissionId: assignDto.permissionId,
            actionId: actionId,
          },
        });
        assignments.push(assignment);
      }

      return assignments;
    });
  }

  // ==================== UTILITY METHODS ====================

  async getUserWithPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      include: {
                        actions: {
                          include: { action: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async checkUserPermission(userId: string, actionCode: string): Promise<boolean> {
    const user = await this.getUserWithPermissions(userId);

    for (const userRole of user.roles) {
      if (!userRole.role.isActive) continue;

      for (const rolePermission of userRole.role.permissions) {
        if (!rolePermission.permission.isActive) continue;

        for (const permissionAction of rolePermission.permission.actions) {
          if (permissionAction.action.code === actionCode && permissionAction.action.isActive) {
            return true;
          }
        }
      }
    }

    return false;
  }

  async getUserActionCodes(userId: string): Promise<string[]> {
    const user = await this.getUserWithPermissions(userId);
    const actionCodes = new Set<string>();

    for (const userRole of user.roles) {
      if (!userRole.role.isActive) continue;
      
      for (const rolePermission of userRole.role.permissions) {
        if (!rolePermission.permission.isActive) continue;
        
        for (const permissionAction of rolePermission.permission.actions) {
          if (permissionAction.action.isActive) {
            actionCodes.add(permissionAction.action.code);
          }
        }
      }
    }

    return Array.from(actionCodes);
  }

  async getRbacStatistics() {
    const [
      totalRoles,
      totalPermissions,
      totalActions,
      totalUsers,
      activeRoles,
      activePermissions,
      activeActions,
    ] = await Promise.all([
      this.prisma.role.count(),
      this.prisma.permission.count(),
      this.prisma.action.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.role.count({ where: { isActive: true } }),
      this.prisma.permission.count({ where: { isActive: true } }),
      this.prisma.action.count({ where: { isActive: true } }),
    ]);

    return {
      totalRoles,
      totalPermissions,
      totalActions,
      totalUsers,
      activeRoles,
      activePermissions,
      activeActions,
    };
  }
}