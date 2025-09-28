import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { UserRole } from '../user/entities/user-role.entity';
import { VisaApplication, VisaStatus } from '../visa/entities/visa-application.entity';
import { SystemLog } from './entities/system-log.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { LoggingService } from './services/logging.service';
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
    @InjectRepository(SystemSettings)
    private systemSettingsRepository: Repository<SystemSettings>,
    private loggingService: LoggingService,
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
  async getSystemLogs(page: number = 1, limit: number = 20, filters?: any) {
    const queryBuilder = this.systemLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (filters?.level) {
      queryBuilder.andWhere('log.level = :level', { level: filters.level });
    }

    if (filters?.action) {
      queryBuilder.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters?.userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId: filters.userId });
    }

    queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [logs, total] = await queryBuilder.getManyAndCount();

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Quản lý Roles
  async createRole(createRoleDto: { roleName: string }) {
    // Kiểm tra role đã tồn tại chưa
    const existingRole = await this.roleRepository.findOne({
      where: { roleName: createRoleDto.roleName },
    });
    
    if (existingRole) {
      throw new Error('Role already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async updateRole(id: string, updateRoleDto: { roleName: string }) {
    // Kiểm tra role có tồn tại không
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('Role not found');
    }

    // Kiểm tra tên role mới có bị trùng không
    const existingRole = await this.roleRepository.findOne({
      where: { roleName: updateRoleDto.roleName },
    });
    
    if (existingRole && existingRole.id !== id) {
      throw new Error('Role name already exists');
    }

    await this.roleRepository.update(id, updateRoleDto);
    return this.roleRepository.findOne({ where: { id } });
  }

  async deleteRole(id: string) {
    // Kiểm tra xem role có đang được sử dụng không
    const userRoleCount = await this.userRoleRepository.count({ where: { roleId: id } });
    if (userRoleCount > 0) {
      throw new Error('Không thể xóa role đang được sử dụng');
    }

    const result = await this.roleRepository.delete(id);
    return result.affected > 0;
  }

  // Quản lý tất cả applications
  async getAllVisaApplications(page: number = 1, limit: number = 10, filters?: any) {
    const queryBuilder = this.visaRepository
      .createQueryBuilder('visa')
      .leftJoinAndSelect('visa.user', 'user');

    if (filters?.status) {
      queryBuilder.andWhere('visa.status = :status', { status: filters.status });
    }

    if (filters?.userId) {
      queryBuilder.andWhere('visa.userId = :userId', { userId: filters.userId });
    }

    queryBuilder
      .orderBy('visa.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [applications, total] = await queryBuilder.getManyAndCount();

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllMouApplications(page: number = 1, limit: number = 10, filters?: any) {
    // Mock implementation - cần import MOU entity
    return {
      applications: [],
      total: 0,
      page,
      totalPages: 0,
      message: 'MOU applications management - coming soon',
    };
  }

  async getAllVisitorApplications(page: number = 1, limit: number = 10, filters?: any) {
    // Mock implementation - cần import Visitor entity
    return {
      applications: [],
      total: 0,
      page,
      totalPages: 0,
      message: 'Visitor applications management - coming soon',
    };
  }

  async getAllTranslationRequests(page: number = 1, limit: number = 10, filters?: any) {
    // Mock implementation - cần import Translation entity
    return {
      applications: [],
      total: 0,
      page,
      totalPages: 0,
      message: 'Translation requests management - coming soon',
    };
  }

  // Thống kê nâng cao
  async getAdvancedStats() {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsersLastMonth,
      newUsersLastWeek,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: 'active' } }),
      this.userRepository.count({ where: { createdAt: Between(lastMonth, currentDate) } }),
      this.userRepository.count({ where: { createdAt: Between(lastWeek, currentDate) } }),
      this.visaRepository.count(),
      this.visaRepository.count({ where: { status: VisaStatus.PENDING } }),
      this.visaRepository.count({ where: { status: VisaStatus.APPROVED } }),
      this.visaRepository.count({ where: { status: VisaStatus.REJECTED } }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newLastMonth: newUsersLastMonth,
        newLastWeek: newUsersLastWeek,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
      },
      systemHealth: {
        uptime: '99.8%',
        responseTime: '150ms',
        errorRate: '0.2%',
      },
    };
  }

  async getActivitySummary(period: string = '7d') {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      const [newUsers, newApplications] = await Promise.all([
        this.userRepository.count({
          where: { createdAt: Between(date, nextDate) },
        }),
        this.visaRepository.count({
          where: { createdAt: Between(date, nextDate) },
        }),
      ]);

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        newUsers,
        newApplications,
      });
    }

    return { period, dailyStats };
  }

  // Cấu hình hệ thống
  async getSystemSettings() {
    const settings = await this.systemSettingsRepository.find({
      order: { key: 'ASC' },
    });

    // Nếu chưa có settings nào, tạo mặc định
    if (settings.length === 0) {
      await this.initializeDefaultSettings();
      return this.getSystemSettings();
    }

    // Group settings by category
    const groupedSettings = {};
    settings.forEach(setting => {
      const [category, key] = setting.key.split('.');
      if (!groupedSettings[category]) {
        groupedSettings[category] = {};
      }
      
      let value: any = setting.value;
      if (setting.type === 'number') {
        value = parseFloat(value);
      } else if (setting.type === 'boolean') {
        value = value === 'true';
      } else if (setting.type === 'json') {
        value = JSON.parse(value);
      }
      
      groupedSettings[category][key] = value;
    });

    return groupedSettings;
  }

  async updateSystemSettings(settings: any) {
    const updatePromises = [];

    for (const [category, categorySettings] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(categorySettings as any)) {
        const settingKey = `${category}.${key}`;
        const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        
        updatePromises.push(
          this.systemSettingsRepository.upsert(
            {
              key: settingKey,
              value: settingValue,
              type: typeof value,
            },
            ['key']
          )
        );
      }
    }

    await Promise.all(updatePromises);

    return {
      success: true,
      message: 'Settings updated successfully',
      updatedAt: new Date().toISOString(),
    };
  }

  private async initializeDefaultSettings() {
    const defaultSettings = [
      // General settings
      { key: 'general.siteName', value: 'PBL6 Admin System', type: 'string', description: 'Site name' },
      { key: 'general.siteUrl', value: 'https://pbl6.admin.com', type: 'string', description: 'Site URL' },
      { key: 'general.maintenanceMode', value: 'false', type: 'boolean', description: 'Maintenance mode' },
      { key: 'general.registrationEnabled', value: 'true', type: 'boolean', description: 'Allow user registration' },
      
      // Email settings
      { key: 'email.smtpHost', value: 'smtp.gmail.com', type: 'string', description: 'SMTP host' },
      { key: 'email.smtpPort', value: '587', type: 'number', description: 'SMTP port' },
      { key: 'email.fromEmail', value: 'admin@pbl6.com', type: 'string', description: 'From email address' },
      { key: 'email.fromName', value: 'PBL6 Admin', type: 'string', description: 'From name' },
      
      // Security settings
      { key: 'security.passwordMinLength', value: '8', type: 'number', description: 'Minimum password length' },
      { key: 'security.sessionTimeout', value: '24', type: 'number', description: 'Session timeout (hours)' },
      { key: 'security.maxLoginAttempts', value: '5', type: 'number', description: 'Max login attempts' },
      
      // Feature settings
      { key: 'features.enableNotifications', value: 'true', type: 'boolean', description: 'Enable notifications' },
      { key: 'features.enableFileUploads', value: 'true', type: 'boolean', description: 'Enable file uploads' },
      { key: 'features.maxFileSize', value: '10', type: 'number', description: 'Max file size (MB)' },
    ];

    const settingsToCreate = defaultSettings.map(setting => 
      this.systemSettingsRepository.create({
        ...setting,
        isEditable: true,
      })
    );

    await this.systemSettingsRepository.save(settingsToCreate);
  }

  // Export data
  async exportUsers(format: string = 'csv') {
    const users = await this.userRepository.find({
      relations: ['userRoles', 'userRoles.role'],
    });

    if (format === 'csv') {
      // Mock CSV data
      const csvData = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        createdAt: user.createdAt,
        roles: user.userRoles?.map(ur => ur.role?.roleName).join(', ') || '',
      }));

      return {
        format: 'csv',
        data: csvData,
        filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`,
      };
    }

    return { format, data: users };
  }

  async exportApplications(type: string, format: string = 'csv') {
    let applications = [];

    switch (type) {
      case 'visa':
        applications = await this.visaRepository.find({
          relations: ['user'],
        });
        break;
      default:
        throw new Error('Unsupported application type');
    }

    return {
      format,
      type,
      data: applications,
      filename: `${type}_applications_export_${new Date().toISOString().split('T')[0]}.${format}`,
    };
  }

  // Batch operations
  async batchDeleteUsers(userIds: string[]) {
    const result = await this.userRepository.delete(userIds);
    return {
      deletedCount: result.affected || 0,
      message: `Successfully deleted ${result.affected || 0} users`,
    };
  }

  async batchUpdateUserStatus(userIds: string[], status: string) {
    const result = await this.userRepository.update(userIds, { status });
    return {
      updatedCount: result.affected || 0,
      message: `Successfully updated status for ${result.affected || 0} users`,
    };
  }

  // Backup và maintenance
  async createBackup() {
    // Mock implementation - cần implement real backup logic
    const backupId = `backup_${Date.now()}`;
    return {
      backupId,
      status: 'created',
      createdAt: new Date().toISOString(),
      size: '25.6 MB',
      message: 'Backup created successfully',
    };
  }

  async listBackups() {
    // Mock implementation
    return [
      {
        id: 'backup_1694937600000',
        createdAt: '2024-09-17T00:00:00.000Z',
        size: '25.6 MB',
        type: 'full',
        status: 'completed',
      },
      {
        id: 'backup_1694851200000',
        createdAt: '2024-09-16T00:00:00.000Z',
        size: '24.2 MB',
        type: 'incremental',
        status: 'completed',
      },
    ];
  }

  async clearOldLogs(olderThan: string) {
    const cutoffDate = new Date();
    const days = parseInt(olderThan.replace('d', ''));
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.systemLogRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    return {
      deletedCount: result.affected || 0,
      message: `Deleted ${result.affected || 0} old log entries`,
    };
  }
}
