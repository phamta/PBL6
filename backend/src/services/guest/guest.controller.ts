import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { GuestService, GuestUser } from './guest.service';
import { CreateGuestDto, UpdateGuestDto, FilterGuestDto, ApproveGuestDto, RejectGuestDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ActionGuard } from '../../common/guards/action.guard';
import { RequireAction } from '../../decorators/require-action.decorator';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: GuestUser;
}

/**
 * Guest Controller with RBAC Action-Based Permissions
 * 
 * Actions:
 * - guest:create: Tạo guest registration mới
 * - guest:view: Xem guest information
 * - guest:update: Cập nhật guest information
 * - guest:delete: Xóa/hủy guest registration
 * - guest:approve: Approve guest registration
 * - guest:reject: Reject guest registration
 * - guest:checkin: Check-in khi guest đến
 * - guest:checkout: Check-out khi guest rời đi
 */
@ApiTags('Guest Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ActionGuard)
@Controller('guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  /**
   * Tạo guest registration mới
   */
  @Post()
  @RequireAction('guest:create')
  @ApiOperation({ 
    summary: 'Tạo guest registration mới',
    description: 'Đăng ký đoàn khách quốc tế hoặc khách cá nhân' 
  })
  @ApiBody({ type: CreateGuestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Guest registration đã được tạo thành công',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền tạo guest registration',
  })
  async create(
    @Body() createGuestDto: CreateGuestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.create(createGuestDto, req.user);
  }

  /**
   * Lấy danh sách guest với filtering và pagination
   */
  @Get()
  @RequireAction('guest:view')
  @ApiOperation({ 
    summary: 'Lấy danh sách guest',
    description: 'Lấy danh sách guest với các bộ lọc và phân trang' 
  })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo tên đoàn, người liên hệ, mục đích' })
  @ApiQuery({ name: 'status', required: false, enum: ['REGISTERED', 'APPROVED', 'ARRIVED', 'DEPARTED', 'CANCELLED'], description: 'Lọc theo trạng thái' })
  @ApiQuery({ name: 'nationality', required: false, description: 'Lọc theo quốc tịch' })
  @ApiQuery({ name: 'arrivalDateFrom', required: false, description: 'Lọc từ ngày đến (ISO 8601)' })
  @ApiQuery({ name: 'arrivalDateTo', required: false, description: 'Lọc đến ngày đến (ISO 8601)' })
  @ApiQuery({ name: 'departureDateFrom', required: false, description: 'Lọc từ ngày về (ISO 8601)' })
  @ApiQuery({ name: 'departureDateTo', required: false, description: 'Lọc đến ngày về (ISO 8601)' })
  @ApiQuery({ name: 'createdById', required: false, description: 'Lọc theo người tạo' })
  @ApiQuery({ name: 'approvedById', required: false, description: 'Lọc theo người duyệt' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang (bắt đầu từ 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Số bản ghi mỗi trang (1-100)', example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sắp xếp theo trường', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Thứ tự sắp xếp', example: 'desc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách guest được trả về thành công',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền xem guest',
  })
  async findAll(
    @Query() filterDto: FilterGuestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.findAll(filterDto, req.user);
  }

  /**
   * Lấy thống kê guest
   */
  @Get('statistics')
  @RequireAction('guest:view')
  @ApiOperation({ 
    summary: 'Lấy thống kê guest',
    description: 'Lấy các thống kê tổng quan về guest' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thống kê guest được trả về thành công',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền xem thống kê guest',
  })
  async getStats(@Req() req: AuthenticatedRequest) {
    return this.guestService.getStats(req.user);
  }

  /**
   * Lấy chi tiết guest theo ID
   */
  @Get(':id')
  @RequireAction('guest:view')
  @ApiOperation({ 
    summary: 'Lấy chi tiết guest',
    description: 'Lấy thông tin chi tiết của guest theo ID' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thông tin guest được trả về thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền xem guest',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.findOne(id, req.user);
  }

  /**
   * Cập nhật thông tin guest
   */
  @Patch(':id')
  @RequireAction('guest:update')
  @ApiOperation({ 
    summary: 'Cập nhật guest',
    description: 'Cập nhật thông tin guest (chỉ cho phép khi chưa hoàn thành hoặc bị hủy)' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiBody({ type: UpdateGuestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest đã được cập nhật thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Không thể cập nhật guest đã hoàn thành hoặc bị hủy',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền cập nhật guest',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGuestDto: UpdateGuestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.update(id, updateGuestDto, req.user);
  }

  /**
   * Hủy guest registration
   */
  @Delete(':id')
  @RequireAction('guest:delete')
  @ApiOperation({ 
    summary: 'Hủy guest registration',
    description: 'Hủy guest registration (chuyển trạng thái thành CANCELLED)' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest đã được hủy thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Không thể hủy guest đã hoàn thành',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền hủy guest',
  })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.cancel(id, req.user);
  }

  /**
   * Approve guest registration (REGISTERED → APPROVED)
   */
  @Post(':id/approve')
  @RequireAction('guest:approve')
  @ApiOperation({ 
    summary: 'Duyệt guest registration',
    description: 'Duyệt guest registration (REGISTERED → APPROVED)' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiBody({ type: ApproveGuestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest đã được duyệt thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Chỉ có thể duyệt guest ở trạng thái REGISTERED',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền duyệt guest',
  })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveDto: ApproveGuestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.approve(id, approveDto, req.user);
  }

  /**
   * Reject guest registration (REGISTERED/APPROVED → CANCELLED)
   */
  @Post(':id/reject')
  @RequireAction('guest:reject')
  @ApiOperation({ 
    summary: 'Từ chối guest registration',
    description: 'Từ chối guest registration (REGISTERED/APPROVED → CANCELLED)' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiBody({ type: RejectGuestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest đã được từ chối thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Chỉ có thể từ chối guest ở trạng thái REGISTERED hoặc APPROVED',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền từ chối guest',
  })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rejectDto: RejectGuestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.reject(id, rejectDto, req.user);
  }

  /**
   * Check-in guest (APPROVED → ARRIVED)
   */
  @Post(':id/checkin')
  @RequireAction('guest:checkin')
  @ApiOperation({ 
    summary: 'Check-in guest',
    description: 'Check-in guest khi đến (APPROVED → ARRIVED)' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest đã check-in thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Chỉ có thể check-in guest đã được duyệt (APPROVED)',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền check-in guest',
  })
  async checkin(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.checkin(id, req.user);
  }

  /**
   * Check-out guest (ARRIVED → DEPARTED)
   */
  @Post(':id/checkout')
  @RequireAction('guest:checkout')
  @ApiOperation({ 
    summary: 'Check-out guest',
    description: 'Check-out guest khi rời đi (ARRIVED → DEPARTED)' 
  })
  @ApiParam({ name: 'id', description: 'ID của guest', example: 'uuid-string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guest đã check-out thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy guest',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Chỉ có thể check-out guest đã check-in (ARRIVED)',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền check-out guest',
  })
  async checkout(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.guestService.checkout(id, req.user);
  }
}