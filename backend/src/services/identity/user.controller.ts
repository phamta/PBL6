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
import { ActionGuard } from '../../common/guards/action.guard';
import { RequireAction } from '../../decorators/require-action.decorator';

/**
 * User Controller - Quản lý người dùng với RBAC
 * Sử dụng action-based permissions thay vì UserRole enum
 */
@ApiTags('User Management')
@Controller('users')
@UseGuards(JwtAuthGuard, ActionGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Lấy danh sách tất cả người dùng
   */
  @Get()
  @RequireAction('user.view_all')
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'role', required: false, description: 'Lọc theo vai trò (string)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: string,
  ) {
    return this.userService.findAll(parseInt(page), parseInt(limit));
  }

  /**
   * Tìm kiếm người dùng
   */
  @Get('search')
  @RequireAction('user.search')
  @ApiOperation({ summary: 'Tìm kiếm người dùng' })
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
  @RequireAction('user.view_stats')
  @ApiOperation({ summary: 'Lấy thống kê người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy thống kê thành công' })
  async getUserStats() {
    return this.userService.getUserStats();
  }

  /**
   * Lấy thông tin một người dùng
   */
  @Get(':id')
  @RequireAction('user.view_detail')
  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Kích hoạt/vô hiệu hóa người dùng
   */
  @Patch(':id/toggle-status')
  @RequireAction('user.manage_status')
  @ApiOperation({ summary: 'Kích hoạt/vô hiệu hóa người dùng' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async toggleUserStatus(@Param('id') id: string) {
    return this.userService.toggleUserStatus(id);
  }

  /**
   * Xóa người dùng
   */
  @Delete(':id')
  @RequireAction('user.delete')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}