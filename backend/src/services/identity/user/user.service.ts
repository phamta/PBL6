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
import { User, UserRole } from '@prisma/client';

/**
 * User Service - Xử lý CRUD operations cho users
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tạo user mới (cho admin)
   */
  async createUser(createUserDto: CreateUserDto, currentUser: any) {
    // Chỉ SYSTEM_ADMIN và DEPARTMENT_OFFICER có thể tạo user
    if (!['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(currentUser.role)) {
      throw new ForbiddenException('Không có quyền tạo user');
    }

    const { email, fullName, role, unitId, isActive } = createUserDto;

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

    // DEPARTMENT_OFFICER chỉ có thể tạo user có role thấp hơn
    if (currentUser.role === 'DEPARTMENT_OFFICER' && ['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(role)) {
      throw new ForbiddenException('Không có quyền tạo user với role này');
    }

    // Tạo password mặc định
    const defaultPassword = this.generateDefaultPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        unitId,
        isActive: isActive ?? true,
      },
      include: {
        unit: true,
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
   * Lấy danh sách users với pagination và filter
   */
  async findUsers(queryDto: QueryUsersDto, currentUser: any) {
    const {
      page,
      limit,
      search,
      role,
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

    // Filter theo role
    if (role) {
      where.role = role;
    }

    // Filter theo unitId
    if (unitId) {
      where.unitId = unitId;
    }

    // Filter theo isActive
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    // Phân quyền: DEPARTMENT_OFFICER chỉ xem được user trong unit của mình
    if (currentUser.role === 'DEPARTMENT_OFFICER') {
      where.unitId = currentUser.unitId;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          unit: {
            select: { id: true, name: true, code: true },
          },
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

    // Phân quyền: chỉ system_admin/department_officer hoặc chính user đó mới xem được
    if (
      !['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(currentUser.role) &&
      currentUser.id !== id
    ) {
      throw new ForbiddenException('Không có quyền xem thông tin user này');
    }

    // DEPARTMENT_OFFICER chỉ xem được user trong unit của mình
    if (
      currentUser.role === 'DEPARTMENT_OFFICER' &&
      currentUser.id !== id &&
      user.unitId !== currentUser.unitId
    ) {
      throw new ForbiddenException('Không có quyền xem thông tin user này');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Cập nhật user
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Phân quyền cập nhật
    if (!this.canUpdateUser(currentUser, user)) {
      throw new ForbiddenException('Không có quyền cập nhật user này');
    }

    const { email, unitId, role, ...otherFields } = updateUserDto;

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

    // Kiểm tra quyền thay đổi role
    if (role && role !== user.role) {
      if (!this.canChangeRole(currentUser, user.role, role)) {
        throw new ForbiddenException('Không có quyền thay đổi role này');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email,
        unitId,
        role,
        ...otherFields,
      },
      include: {
        unit: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
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

    // Chỉ SYSTEM_ADMIN có thể xóa user
    if (currentUser.role !== 'SYSTEM_ADMIN') {
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
    // Chỉ SYSTEM_ADMIN và DEPARTMENT_OFFICER có thể reset password
    if (!['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(currentUser.role)) {
      throw new ForbiddenException('Không có quyền reset mật khẩu');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // DEPARTMENT_OFFICER chỉ có thể reset password user trong unit của mình
    if (
      currentUser.role === 'DEPARTMENT_OFFICER' &&
      user.unitId !== currentUser.unitId
    ) {
      throw new ForbiddenException(
        'Không có quyền reset mật khẩu user ngoài unit',
      );
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
   * Kiểm tra quyền cập nhật user
   */
  private canUpdateUser(currentUser: any, targetUser: User): boolean {
    // SYSTEM_ADMIN có thể cập nhật tất cả
    if (currentUser.role === 'SYSTEM_ADMIN') return true;

    // User có thể cập nhật thông tin của chính mình (trừ role)
    if (currentUser.id === targetUser.id) return true;

    // DEPARTMENT_OFFICER có thể cập nhật user trong unit của mình
    if (
      currentUser.role === 'DEPARTMENT_OFFICER' &&
      targetUser.unitId === currentUser.unitId
    ) {
      return true;
    }

    return false;
  }

  /**
   * Kiểm tra quyền thay đổi role
   */
  private canChangeRole(
    currentUser: any,
    oldRole: UserRole,
    newRole: UserRole,
  ): boolean {
    // Chỉ SYSTEM_ADMIN có thể thay đổi role
    if (currentUser.role !== 'SYSTEM_ADMIN') return false;

    // Không cho phép tự thay đổi role của mình
    if (currentUser.role === oldRole) return false;

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