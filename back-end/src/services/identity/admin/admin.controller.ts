import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { AdminService } from './admin.service';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  AssignRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  SystemSettingsDto,
  BatchDeleteUsersDto,
  BatchUpdateUserStatusDto,
  ClearLogsDto,
} from './dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard thống kê
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/user-stats')
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  @Get('dashboard/visa-stats')
  async getVisaStats() {
    return this.adminService.getVisaStats();
  }

  // Quản lý người dùng
  @Get('users')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.adminService.deleteUser(id);
    return { success: result };
  }

  // Phân quyền
  @Get('roles')
  async getAllRoles() {
    return this.adminService.getAllRoles();
  }

  @Post('users/assign-role')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.adminService.assignRole(assignRoleDto);
  }

  @Delete('users/:userId/roles/:roleId')
  async revokeRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ) {
    const result = await this.adminService.revokeRole(userId, roleId);
    return { success: result };
  }

  // Nhật ký hệ thống
  @Get('system-logs')
  async getSystemLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('level') level?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
  ) {
    return this.adminService.getSystemLogs(page, limit, { level, action, userId });
  }

  // Quản lý Roles
  @Post('roles')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.adminService.createRole(createRoleDto);
  }

  @Put('roles/:id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.adminService.updateRole(id, updateRoleDto);
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.adminService.deleteRole(id);
    return { success: result };
  }

  // Quản lý tất cả applications
  @Get('applications/visa')
  async getAllVisaApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
  ) {
    return this.adminService.getAllVisaApplications(page, limit, { status, userId });
  }

  @Get('applications/mou')
  async getAllMouApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllMouApplications(page, limit, { status });
  }

  @Get('applications/visitor')
  async getAllVisitorApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllVisitorApplications(page, limit, { status });
  }

  @Get('applications/translation')
  async getAllTranslationRequests(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllTranslationRequests(page, limit, { status });
  }

  // Thống kê nâng cao
  @Get('dashboard/advanced-stats')
  async getAdvancedStats() {
    return this.adminService.getAdvancedStats();
  }

  @Get('dashboard/activity-summary')
  async getActivitySummary(@Query('period') period: string = '7d') {
    return this.adminService.getActivitySummary(period);
  }

  // Cấu hình hệ thống
  @Get('settings')
  async getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Put('settings')
  async updateSystemSettings(@Body() settings: SystemSettingsDto) {
    return this.adminService.updateSystemSettings(settings);
  }

  // Export data
  @Get('export/users')
  async exportUsers(@Query('format') format: string = 'csv') {
    return this.adminService.exportUsers(format);
  }

  @Get('export/applications')
  async exportApplications(
    @Query('type') type: string,
    @Query('format') format: string = 'csv',
  ) {
    return this.adminService.exportApplications(type, format);
  }

  // Batch operations
  @Post('users/batch-delete')
  async batchDeleteUsers(@Body() batchDeleteDto: BatchDeleteUsersDto) {
    return this.adminService.batchDeleteUsers(batchDeleteDto.userIds);
  }

  @Post('users/batch-update-status')
  async batchUpdateUserStatus(@Body() batchUpdateDto: BatchUpdateUserStatusDto) {
    return this.adminService.batchUpdateUserStatus(batchUpdateDto.userIds, batchUpdateDto.status);
  }

  // Backup và maintenance
  @Post('backup/create')
  async createBackup() {
    return this.adminService.createBackup();
  }

  @Get('backup/list')
  async listBackups() {
    return this.adminService.listBackups();
  }

  @Post('maintenance/clear-logs')
  async clearOldLogs(@Body() clearLogsDto: ClearLogsDto) {
    return this.adminService.clearOldLogs(clearLogsDto.olderThan);
  }
}
