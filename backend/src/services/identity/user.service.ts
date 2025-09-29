import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * User Service - Xử lý quản lý người dùng
 * Bao gồm CRUD user, phân quyền, quản lý đơn vị
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lấy danh sách tất cả người dùng (có phân trang)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { 
          unit: true,
          roles: {
            include: {
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPasswords,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy thông tin một người dùng
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { unit: true },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Kích hoạt/vô hiệu hóa người dùng
   */
  async toggleUserStatus(id: string) {
    const user = await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
      },
    });

    return {
      message: `Người dùng đã được ${updatedUser.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
      user: updatedUser,
    };
  }

  /**
   * Xóa người dùng
   */
  async remove(id: string) {
    const user = await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: `Đã xóa người dùng: ${user.fullName}`,
    };
  }

  /**
   * Lấy thống kê người dùng
   */
  async getUserStats() {
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: { isActive: true },
    });

    // Thống kê theo roles (RBAC)
    const roleStats = await this.prisma.role.findMany({
      include: {
        users: {
          select: {
            userId: true
          }
        }
      }
    });

    const roleDistribution = roleStats.map(role => ({
      role: role.name,
      description: role.description,
      count: role.users.length,
    }));

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleDistribution,
    };
  }

  /**
   * Tìm kiếm người dùng
   */
  async searchUsers(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { email: { contains: query, mode: 'insensitive' as const } },
        { fullName: { contains: query, mode: 'insensitive' as const } },
        { phoneNumber: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { unit: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPasswords,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query,
      },
    };
  }
}