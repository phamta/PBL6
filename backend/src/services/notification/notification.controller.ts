import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequireAction } from '../../decorators/require-action.decorator';
import { NotificationService, NotificationUser } from './notification.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  SendNotificationDto,
  FilterNotificationDto,
  FilterTemplateDto,
} from './dto';

interface RequestWithUser extends Request {
  user: NotificationUser;
}

/**
 * Notification Controller - REST API cho quản lý notification
 * Base route: /api/v1/notifications
 */
@ApiTags('Notifications')
@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ==================== TEMPLATE MANAGEMENT ====================

  /**
   * POST /api/v1/notifications/templates - Tạo notification template mới
   */
  @Post('templates')
  @RequireAction('notification:create_template')
  @ApiOperation({ 
    summary: 'Tạo notification template mới',
    description: 'Tạo template thông báo cho EMAIL, SYSTEM, hoặc SMS'
  })
  @ApiResponse({
    status: 201,
    description: 'Template đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền tạo template',
  })
  @ApiResponse({
    status: 409,
    description: 'Tên template đã tồn tại',
  })
  async createTemplate(
    @Body(ValidationPipe) createTemplateDto: CreateTemplateDto,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.createTemplate(createTemplateDto, req.user);
  }

  /**
   * GET /api/v1/notifications/templates - Lấy danh sách template
   */
  @Get('templates')
  @RequireAction('notification:view_template')
  @ApiOperation({ 
    summary: 'Lấy danh sách notification template',
    description: 'Lấy danh sách template với filtering, sorting và pagination'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số item trên trang (default: 20)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Tìm kiếm theo tên, subject, content' })
  @ApiQuery({ name: 'type', required: false, enum: ['EMAIL', 'SYSTEM', 'SMS'], description: 'Loại template' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Trạng thái hoạt động' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'type', 'createdAt', 'updatedAt'], description: 'Sắp xếp theo field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Thứ tự sắp xếp' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách template thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem template',
  })
  async getTemplates(
    @Query(ValidationPipe) filterDto: FilterTemplateDto,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.getTemplates(filterDto, req.user);
  }

  /**
   * GET /api/v1/notifications/templates/:id - Lấy chi tiết template
   */
  @Get('templates/:id')
  @RequireAction('notification:view_template')
  @ApiOperation({ 
    summary: 'Lấy chi tiết notification template',
    description: 'Lấy thông tin chi tiết của một template'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết template thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem template',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy template',
  })
  async getTemplateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.getTemplateById(id, req.user);
  }

  /**
   * PATCH /api/v1/notifications/templates/:id - Cập nhật template
   */
  @Patch('templates/:id')
  @RequireAction('notification:update_template')
  @ApiOperation({ 
    summary: 'Cập nhật notification template',
    description: 'Cập nhật thông tin template'
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật template thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền cập nhật template',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy template',
  })
  @ApiResponse({
    status: 409,
    description: 'Tên template đã tồn tại',
  })
  async updateTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTemplateDto: UpdateTemplateDto,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.updateTemplate(id, updateTemplateDto, req.user);
  }

  /**
   * DELETE /api/v1/notifications/templates/:id - Xóa template
   */
  @Delete('templates/:id')
  @RequireAction('notification:delete_template')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Xóa notification template',
    description: 'Xóa template notification'
  })
  @ApiResponse({
    status: 204,
    description: 'Xóa template thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xóa template',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy template',
  })
  async deleteTemplate(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    await this.notificationService.deleteTemplate(id, req.user);
  }

  // ==================== NOTIFICATION SENDING ====================

  /**
   * POST /api/v1/notifications/send - Gửi notification
   */
  @Post('send')
  @RequireAction('notification:send')
  @ApiOperation({ 
    summary: 'Gửi notification',
    description: 'Gửi notification qua EMAIL, SYSTEM hoặc SMS. Có thể sử dụng template hoặc content trực tiếp'
  })
  @ApiResponse({
    status: 201,
    description: 'Gửi notification thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền gửi notification',
  })
  @ApiResponse({
    status: 404,
    description: 'Template không tồn tại (nếu sử dụng templateId)',
  })
  async sendNotification(
    @Body(ValidationPipe) sendDto: SendNotificationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.sendNotification(sendDto, req.user);
  }

  // ==================== LOGS ====================

  /**
   * GET /api/v1/notifications/logs - Lấy danh sách notification logs
   */
  @Get('logs')
  @RequireAction('notification:view_logs')
  @ApiOperation({ 
    summary: 'Lấy danh sách notification logs',
    description: 'Lấy danh sách log các notification đã gửi với filtering và pagination'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số item trên trang (default: 20)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Tìm kiếm theo recipient, subject, content' })
  @ApiQuery({ name: 'type', required: false, enum: ['EMAIL', 'SYSTEM', 'SMS'], description: 'Loại notification' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'SENT', 'FAILED', 'DELIVERED'], description: 'Trạng thái' })
  @ApiQuery({ name: 'sentById', required: false, type: String, description: 'ID người gửi' })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, description: 'Từ ngày tạo (ISO date)' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, description: 'Đến ngày tạo (ISO date)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'sentAt', 'status'], description: 'Sắp xếp theo field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Thứ tự sắp xếp' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách logs thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem logs',
  })
  async getLogs(
    @Query(ValidationPipe) filterDto: FilterNotificationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.getLogs(filterDto, req.user);
  }

  // ==================== USER NOTIFICATIONS ====================

  /**
   * GET /api/v1/notifications/user - Lấy danh sách thông báo của user hiện tại
   */
  @Get('user')
  @RequireAction('notification:view_user')
  @ApiOperation({ 
    summary: 'Lấy danh sách thông báo của user',
    description: 'Lấy danh sách system notification dành cho user hiện tại'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số item trên trang (default: 20)' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách user notification thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem user notification',
  })
  async getUserNotifications(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req?: RequestWithUser,
  ) {
    return this.notificationService.getUserNotifications(req!.user, page, limit);
  }

  /**
   * PATCH /api/v1/notifications/user/:id/read - Mark notification as read
   */
  @Patch('user/:id/read')
  @RequireAction('notification:view_user')
  @ApiOperation({ 
    summary: 'Đánh dấu notification đã đọc',
    description: 'Đánh dấu một user notification là đã đọc'
  })
  @ApiResponse({
    status: 200,
    description: 'Đánh dấu đã đọc thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền cập nhật notification này',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy notification',
  })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.notificationService.markAsRead(id, req.user);
  }

  // ==================== STATISTICS ====================

  /**
   * GET /api/v1/notifications/stats - Lấy thống kê notification
   */
  @Get('stats')
  @RequireAction('notification:view_logs')
  @ApiOperation({ 
    summary: 'Lấy thống kê notification',
    description: 'Lấy thống kê tổng quan về notification system'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem thống kê',
  })
  async getStats(@Request() req: RequestWithUser) {
    return this.notificationService.getStats(req.user);
  }
}