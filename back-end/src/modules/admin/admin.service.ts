import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { UserRole } from '../user/entities/user-role.entity';
import { VisaApplication, VisaStatus } from '../visa/entities/visa-application.entity';
import { SystemLog } from './entities/system-log.entity';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(VisaApplication)
    private visaRepository: Repository<VisaApplication>,
    @InjectRepository(SystemLog)
    private systemLogRepository: Repository<SystemLog>,
  ) {}

  // Quản lý người dùng
  async getAllUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['userRoles', 'userRoles.role'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.getUserById(id);
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  // Phân quyền
  async getAllRoles() {
    return this.roleRepository.find({
      order: { id: 'ASC' },
    });
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    
    // Kiểm tra xem user và role có tồn tại không
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    
    if (!user || !role) {
      throw new Error('User hoặc Role không tồn tại');
    }

    // Kiểm tra xem đã assign chưa
    const existingUserRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });

    if (existingUserRole) {
      throw new Error('User đã có role này rồi');
    }

    const userRole = this.userRoleRepository.create({ userId, roleId });
    return this.userRoleRepository.save(userRole);
  }

  async revokeRole(userId: string, roleId: string) {
    const result = await this.userRoleRepository.delete({ userId, roleId });
    return result.affected > 0;
  }

  // Thống kê tổng quan
  async getDashboardStats() {
    const [totalUsers, totalVisaApplications, activeVisas] = await Promise.all([
      this.userRepository.count(),
      this.visaRepository.count(),
      this.visaRepository.count({
        where: { status: VisaStatus.APPROVED },
      }),
    ]);

    // Thống kê theo tháng
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const newUsersThisMonth = await this.userRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });

    const newVisasThisMonth = await this.visaRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });

    return {
      totalUsers,
      totalVisaApplications,
      activeVisas,
      newUsersThisMonth,
      newVisasThisMonth,
      systemUptime: '98.5%', // Mock data
    };
  }

  async getUserStats() {
    const usersByRole = await this.userRoleRepository
      .createQueryBuilder('ur')
      .leftJoinAndSelect('ur.role', 'role')
      .select('role.name', 'roleName')
      .addSelect('COUNT(ur.userId)', 'count')
      .groupBy('role.name')
      .getRawMany();

    return usersByRole;
  }

  async getVisaStats() {
    const visaByStatus = await this.visaRepository
      .createQueryBuilder('visa')
      .select('visa.status', 'status')
      .addSelect('COUNT(visa.id)', 'count')
      .groupBy('visa.status')
      .getRawMany();

    const visaByCountry = await this.visaRepository
      .createQueryBuilder('visa')
      .select('visa.country', 'country')
      .addSelect('COUNT(visa.id)', 'count')
      .groupBy('visa.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      byStatus: visaByStatus,
      byCountry: visaByCountry,
    };
  }

  // Nhật ký hệ thống
  async getSystemLogs(page: number = 1, limit: number = 20) {
    const [logs, total] = await this.systemLogRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
