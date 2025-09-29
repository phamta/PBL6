import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException,
  ForbiddenException 
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/change-password.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { User } from '@prisma/client';

/**
 * User Service - Xử lý CRUD operations cho users
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tạo user mới (cho admin) với RBAC
   */
  async createUser(createUserDto: CreateUserDto, currentUser: any) {
    // Kiểm tra quyền tạo user thông qua actions
    if (!currentUser.actions || !currentUser.actions.includes('user.create')) {
      throw new ForbiddenException('Không có quyền tạo user');
    }

    const { email, fullName, roleIds, unitId, isActive } = createUserDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Kiểm tra unit có tồn tại
    if (unitId) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: unitId },
      });
      if (!unit) {
        throw new BadRequestException('Unit không tồn tại');
      }
    }

    // Kiểm tra các roles có tồn tại
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } }
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('Một hoặc nhiều role không tồn tại');
    }

    // Tạo password mặc định
    const defaultPassword = this.generateDefaultPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    // Tạo user với roles
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        unitId,
        isActive: isActive ?? true,
        roles: {
          create: roleIds.map(roleId => ({
            roleId: roleId
          }))
        }
      },
      include: {
        unit: true,
        roles: {
          include: {
            role: {
              select: { id: true, name: true, description: true }
            }
          }
        }
      },
    });

    // Loại bỏ password khỏi response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      defaultPassword, // Trả về password mặc định để thông báo cho user
    };
  }

  /**
   * Lấy danh sách users với pagination và filter (RBAC)
   */
  async findUsers(queryDto: QueryUsersDto, currentUser: any) {
    const {
      page,
      limit,
      search,
      roleName,
      unitId,
      isActive,
      sortBy,
      sortOrder,
    } = queryDto;

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};

    // Search trong fullName và email
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter theo role name
    if (roleName) {
      where.roles = {
        some: {
          role: {
            name: { contains: roleName, mode: 'insensitive' }
          }
        }
      };
    }

    // Filter theo unitId
    if (unitId) {
      where.unitId = unitId;
    }

    // Filter theo isActive
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    // Phân quyền: kiểm tra permission để xem users
    if (!currentUser.actions || !currentUser.actions.includes('user.view_all')) {
      // Nếu không có quyền view all, chỉ xem được user của unit mình
      if (currentUser.actions && currentUser.actions.includes('user.view_unit')) {
        where.unitId = currentUser.unitId;
      } else {
        throw new ForbiddenException('Không có quyền xem danh sách user');
      }
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          unit: {
            select: { id: true, name: true, code: true },
          },
          roles: {
            include: {
              role: {
                select: { id: true, name: true, description: true }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Loại bỏ password khỏi response
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return {
      data: usersWithoutPassword,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy user theo ID
   */
  async findUserById(id: string, currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        unit: true,
        refreshTokens: {
          select: { id: true, createdAt: true, expiresAt: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Phân quyền RBAC: kiểm tra action permissions
    const canViewAll = currentUser.actions && currentUser.actions.includes('user.view_all');
    const canViewSelf = currentUser.actions && currentUser.actions.includes('user.view_self') && currentUser.id === id;
    const canViewUnit = currentUser.actions && currentUser.actions.includes('user.view_unit') && 
                        currentUser.id !== id && user.unitId === currentUser.unitId;

    if (!canViewAll && !canViewSelf && !canViewUnit) {
      throw new ForbiddenException('Không có quyền xem thông tin user này');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Cập nhật user (RBAC)
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Phân quyền cập nhật
    if (!this.canUpdateUser(currentUser, user)) {
      throw new ForbiddenException('Không có quyền cập nhật user này');
    }

    const { email, unitId, roleIds, ...otherFields } = updateUserDto;

    // Kiểm tra email mới có trùng không
    if (email && email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    // Kiểm tra unit có tồn tại
    if (unitId) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: unitId },
      });
      if (!unit) {
        throw new BadRequestException('Unit không tồn tại');
      }
    }

    // Kiểm tra quyền thay đổi roles
    if (roleIds && roleIds.length > 0) {
      if (!this.canChangeRoles(currentUser, roleIds)) {
        throw new ForbiddenException('Không có quyền thay đổi roles này');
      }
    }

    // Transaction để cập nhật user và roles
    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // Cập nhật thông tin user
      const updated = await tx.user.update({
        where: { id },
        data: {
          email,
          unitId,
          ...otherFields,
        },
        include: {
          unit: true,
        },
      });

      // Cập nhật roles nếu có
      if (roleIds && roleIds.length > 0) {
        // Xóa roles cũ
        await tx.userRole.deleteMany({
          where: { userId: id }
        });

        // Thêm roles mới
        await tx.userRole.createMany({
          data: roleIds.map(roleId => ({
            userId: id,
            roleId
          }))
        });
      }

      return updated;
    });

    // Trả về user với roles mới
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id },
      include: {
        unit: {
          select: { id: true, name: true, code: true },
        },
        roles: {
          include: {
            role: {
              select: { id: true, name: true, description: true }
            }
          }
        }
      }
    });

    const { password, ...userWithoutPassword } = userWithRoles;
    return userWithoutPassword;
  }

  /**
   * Xóa user (soft delete)
   */
  async deleteUser(id: string, currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Kiểm tra quyền xóa user
    if (!currentUser.actions || !currentUser.actions.includes('user.delete')) {
      throw new ForbiddenException('Không có quyền xóa user');
    }

    // Không cho phép xóa chính mình
    if (currentUser.id === id) {
      throw new BadRequestException('Không thể xóa chính mình');
    }

    // Soft delete: vô hiệu hóa user
    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Xóa tất cả refresh tokens của user
    await this.prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    return { message: 'Xóa user thành công' };
  }

  /**
   * Thay đổi mật khẩu (user tự thay đổi)
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
    currentUser: any,
  ) {
    // Chỉ cho phép user thay đổi mật khẩu của chính mình
    if (currentUser.id !== id) {
      throw new ForbiddenException('Không thể thay đổi mật khẩu của user khác');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    const { currentPassword, newPassword } = changePasswordDto;

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    // Xóa tất cả refresh tokens để buộc user đăng nhập lại
    await this.prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    return { message: 'Thay đổi mật khẩu thành công' };
  }

  /**
   * Reset mật khẩu (cho admin)
   */
  async resetPassword(
    id: string,
    resetPasswordDto: ResetPasswordDto,
    currentUser: any,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Kiểm tra quyền reset password
    const canResetAll = currentUser.actions && currentUser.actions.includes('user.reset_password_all');
    const canResetUnit = currentUser.actions && currentUser.actions.includes('user.reset_password_unit') && 
                         user.unitId === currentUser.unitId;

    if (!canResetAll && !canResetUnit) {
      throw new ForbiddenException('Không có quyền reset mật khẩu user này');
    }

    const { newPassword, forceChangeOnNextLogin } = resetPasswordDto;

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    // Xóa tất cả refresh tokens
    await this.prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    return { message: 'Reset mật khẩu thành công' };
  }

  /**
   * Kiểm tra quyền cập nhật user (RBAC)
   */
  private canUpdateUser(currentUser: any, targetUser: any): boolean {
    // Kiểm tra permission user.update_all
    if (currentUser.actions && currentUser.actions.includes('user.update_all')) {
      return true;
    }

    // User có thể cập nhật thông tin của chính mình
    if (currentUser.id === targetUser.id) {
      return currentUser.actions && currentUser.actions.includes('user.update_self');
    }

    // Kiểm tra permission cập nhật user trong unit
    if (
      currentUser.actions && 
      currentUser.actions.includes('user.update_unit') &&
      targetUser.unitId === currentUser.unitId
    ) {
      return true;
    }

    return false;
  }

  /**
   * Kiểm tra quyền thay đổi roles (RBAC)
   */
  private canChangeRoles(
    currentUser: any,
    roleIds: string[],
  ): boolean {
    // Kiểm tra permission user.assign_roles
    if (!currentUser.actions || !currentUser.actions.includes('user.assign_roles')) {
      return false;
    }

    // Có thể thêm logic kiểm tra specific roles nếu cần
    // VD: chỉ cho phép assign những roles không cao hơn role của mình

    return true;
  }

  /**
   * Tạo password mặc định
   */
  private generateDefaultPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}