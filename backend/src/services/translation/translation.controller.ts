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
import { TranslationService, TranslationUser } from './translation.service';
import {
  CreateTranslationDto,
  UpdateTranslationDto,
  FilterTranslationDto,
  ApproveTranslationDto,
  RejectTranslationDto,
  CompleteTranslationDto,
} from './dto';

interface RequestWithUser extends Request {
  user: TranslationUser;
}

/**
 * Translation Controller - REST API cho quản lý translation
 * Base route: /api/v1/translations
 */
@ApiTags('Translations')
@Controller('api/v1/translations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  /**
   * POST /api/v1/translations - Tạo translation request mới
   */
  @Post()
  @RequireAction('translation:create')
  @ApiOperation({ 
    summary: 'Tạo translation request mới',
    description: 'Tạo yêu cầu dịch thuật và công chứng tài liệu mới'
  })
  @ApiResponse({
    status: 201,
    description: 'Translation request đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền tạo translation request',
  })
  @ApiResponse({
    status: 409,
    description: 'Translation request đã tồn tại',
  })
  async create(
    @Body(ValidationPipe) createTranslationDto: CreateTranslationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.create(createTranslationDto, req.user);
  }

  /**
   * GET /api/v1/translations - Lấy danh sách translation với filtering
   */
  @Get()
  @RequireAction('translation:view')
  @ApiOperation({ 
    summary: 'Lấy danh sách translation',
    description: 'Lấy danh sách translation với filtering, sorting và pagination'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số item trên trang (default: 20)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Tìm kiếm theo tên, email, tiêu đề' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'] })
  @ApiQuery({ name: 'sourceLanguage', required: false, type: String, description: 'Ngôn ngữ nguồn' })
  @ApiQuery({ name: 'targetLanguage', required: false, type: String, description: 'Ngôn ngữ đích' })
  @ApiQuery({ name: 'documentType', required: false, type: String, description: 'Loại tài liệu' })
  @ApiQuery({ name: 'urgentLevel', required: false, enum: ['NORMAL', 'URGENT', 'VERY_URGENT'] })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, description: 'Từ ngày tạo (ISO date)' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, description: 'Đến ngày tạo (ISO date)' })
  @ApiQuery({ name: 'createdById', required: false, type: String, description: 'ID người tạo' })
  @ApiQuery({ name: 'approvedById', required: false, type: String, description: 'ID người duyệt' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'updatedAt', 'urgentLevel'], description: 'Sắp xếp theo field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Thứ tự sắp xếp' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách translation thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem translation',
  })
  async findAll(
    @Query(ValidationPipe) filterDto: FilterTranslationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.findAll(filterDto, req.user);
  }

  /**
   * GET /api/v1/translations/stats - Lấy thống kê translation
   */
  @Get('stats')
  @RequireAction('translation:view')
  @ApiOperation({ 
    summary: 'Lấy thống kê translation',
    description: 'Lấy thống kê tổng quan về translation requests'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem thống kê translation',
  })
  async getStats(@Request() req: RequestWithUser) {
    return this.translationService.getStats(req.user);
  }

  /**
   * GET /api/v1/translations/:id - Lấy chi tiết translation theo ID
   */
  @Get(':id')
  @RequireAction('translation:view')
  @ApiOperation({ 
    summary: 'Lấy chi tiết translation',
    description: 'Lấy thông tin chi tiết của một translation request'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết translation thành công',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem translation',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy translation',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.findOne(id, req.user);
  }

  /**
   * PATCH /api/v1/translations/:id - Cập nhật thông tin translation
   */
  @Patch(':id')
  @RequireAction('translation:update')
  @ApiOperation({ 
    summary: 'Cập nhật translation',
    description: 'Cập nhật thông tin translation request (chỉ khi status = PENDING)'
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật translation thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc không thể cập nhật',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền cập nhật translation',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy translation',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTranslationDto: UpdateTranslationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.update(id, updateTranslationDto, req.user);
  }

  /**
   * DELETE /api/v1/translations/:id - Hủy/Xóa translation request
   */
  @Delete(':id')
  @RequireAction('translation:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Hủy translation request',
    description: 'Hủy/Xóa translation request (chuyển status về REJECTED)'
  })
  @ApiResponse({
    status: 204,
    description: 'Hủy translation thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể hủy translation',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền hủy translation',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy translation',
  })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    await this.translationService.cancel(id, req.user);
  }

  /**
   * POST /api/v1/translations/:id/approve - Duyệt translation request
   */
  @Post(':id/approve')
  @RequireAction('translation:approve')
  @ApiOperation({ 
    summary: 'Duyệt translation request',
    description: 'Duyệt translation request từ PENDING → APPROVED'
  })
  @ApiResponse({
    status: 200,
    description: 'Duyệt translation thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể duyệt translation',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền duyệt translation',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy translation',
  })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) approveDto: ApproveTranslationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.approve(id, approveDto, req.user);
  }

  /**
   * POST /api/v1/translations/:id/reject - Từ chối translation request
   */
  @Post(':id/reject')
  @RequireAction('translation:reject')
  @ApiOperation({ 
    summary: 'Từ chối translation request',
    description: 'Từ chối translation request từ PENDING/APPROVED → REJECTED'
  })
  @ApiResponse({
    status: 200,
    description: 'Từ chối translation thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể từ chối translation',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền từ chối translation',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy translation',
  })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) rejectDto: RejectTranslationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.reject(id, rejectDto, req.user);
  }

  /**
   * POST /api/v1/translations/:id/complete - Hoàn thành translation với file dịch
   */
  @Post(':id/complete')
  @RequireAction('translation:complete')
  @ApiOperation({ 
    summary: 'Hoàn thành translation',
    description: 'Hoàn thành translation với file đã dịch từ APPROVED → COMPLETED'
  })
  @ApiResponse({
    status: 200,
    description: 'Hoàn thành translation thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể hoàn thành translation',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền hoàn thành translation',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy translation',
  })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) completeDto: CompleteTranslationDto,
    @Request() req: RequestWithUser,
  ) {
    return this.translationService.complete(id, completeDto, req.user);
  }
}