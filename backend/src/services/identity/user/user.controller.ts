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
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/change-password.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * User Controller - Xử lý CRUD operations cho users
 */
@ApiTags('User Management')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Tạo user mới (cho admin/manager)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({
    summary: 'Tạo user mới',
    description: 'Tạo user mới trong hệ thống (chỉ admin/manager)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo user thành công',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            role: { type: 'string' },
            isActive: { type: 'boolean' },
            unit: { type: 'object' },
          },
        },
        defaultPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo user' })
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.userService.createUser(createUserDto, req.user);
  }

  /**
   * Lấy danh sách users với pagination và filter
   */
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách users',
    description: 'Lấy danh sách users với pagination và filter',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'unitId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              fullName: { type: 'string' },
              role: { type: 'string' },
              isActive: { type: 'boolean' },
              unit: { type: 'object' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  async findUsers(@Query() queryDto: QueryUsersDto, @Req() req: any) {
    return this.userService.findUsers(queryDto, req.user);
  }

  /**
   * Lấy user theo ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy user theo ID',
    description: 'Lấy thông tin chi tiết của user theo ID',
  })
  @ApiParam({ name: 'id', description: 'ID của user', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string' },
        isActive: { type: 'boolean' },
        unit: { type: 'object' },
        refreshTokens: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem user này' })
  async findUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.userService.findUserById(id, req.user);
  }

  /**
   * Cập nhật user
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật user',
    description: 'Cập nhật thông tin user',
  })
  @ApiParam({ name: 'id', description: 'ID của user', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string' },
        isActive: { type: 'boolean' },
        unit: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật user này' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userService.updateUser(id, updateUserDto, req.user);
  }

  /**
   * Xóa user (soft delete)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Xóa user',
    description: 'Xóa user khỏi hệ thống (chỉ admin)',
  })
  @ApiParam({ name: 'id', description: 'ID của user', type: 'string' })
  @ApiResponse({ status: 200, description: 'Xóa user thành công' })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa user' })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.userService.deleteUser(id, req.user);
  }

  /**
   * Thay đổi mật khẩu (user tự thay đổi)
   */
  @Put(':id/change-password')
  @ApiOperation({
    summary: 'Thay đổi mật khẩu',
    description: 'User thay đổi mật khẩu của chính mình',
  })
  @ApiParam({ name: 'id', description: 'ID của user', type: 'string' })
  @ApiResponse({ status: 200, description: 'Thay đổi mật khẩu thành công' })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  @ApiResponse({ status: 400, description: 'Mật khẩu hiện tại không đúng' })
  @ApiResponse({ status: 403, description: 'Không thể thay đổi mật khẩu của user khác' })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    return this.userService.changePassword(id, changePasswordDto, req.user);
  }

  /**
   * Reset mật khẩu (cho admin/manager)
   */
  @Put(':id/reset-password')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({
    summary: 'Reset mật khẩu',
    description: 'Admin/Manager reset mật khẩu cho user khác',
  })
  @ApiParam({ name: 'id', description: 'ID của user', type: 'string' })
  @ApiResponse({ status: 200, description: 'Reset mật khẩu thành công' })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền reset mật khẩu' })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: any,
  ) {
    return this.userService.resetPassword(id, resetPasswordDto, req.user);
  }
}