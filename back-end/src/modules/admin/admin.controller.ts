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
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto';

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
  ) {
    return this.adminService.getSystemLogs(page, limit);
  }
}
