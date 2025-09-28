import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * User Controller - Quản lý người dùng
 * Chỉ dành cho admin và quản lý
 */
@ApiTags('User Management')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Lấy danh sách tất cả người dùng
   */
  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({ summary: 'Lấy danh sách người dùng (Admin only)' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole, description: 'Lọc theo vai trò' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: UserRole,
  ) {
    return this.userService.findAll(parseInt(page), parseInt(limit), role);
  }

  /**
   * Tìm kiếm người dùng
   */
  @Get('search')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({ summary: 'Tìm kiếm người dùng (Admin only)' })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiResponse({ status: 200, description: 'Tìm kiếm thành công' })
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.userService.searchUsers(query, parseInt(page), parseInt(limit));
  }

  /**
   * Lấy thống kê người dùng
   */
  @Get('stats')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({ summary: 'Lấy thống kê người dùng (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lấy thống kê thành công' })
  async getUserStats() {
    return this.userService.getUserStats();
  }

  /**
   * Lấy thông tin một người dùng
   */
  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({ summary: 'Lấy thông tin người dùng (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Kích hoạt/vô hiệu hóa người dùng
   */
  @Patch(':id/toggle-status')
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Kích hoạt/vô hiệu hóa người dùng (System Admin only)' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async toggleUserStatus(@Param('id') id: string) {
    return this.userService.toggleUserStatus(id);
  }

  /**
   * Xóa người dùng
   */
  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Xóa người dùng (System Admin only)' })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}