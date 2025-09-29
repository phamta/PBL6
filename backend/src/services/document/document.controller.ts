import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ActionGuard } from '../../common/guards/action.guard';
import { RequireAction } from '../../decorators/require-action.decorator';
import { DocumentService, DocumentUser } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto, ApproveDocumentDto, FilterDocumentDto } from './dto';
import { DocumentStatus, DocumentType } from '@prisma/client';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    actions: string[];
    unitId?: string;
  };
}

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard, ActionGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // ==================== CRUD Operations ====================

  /**
   * Tạo đề xuất MOU mới
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireAction('DOCUMENT_CREATE')
  @ApiOperation({ 
    summary: 'Tạo đề xuất MOU mới',
    description: 'Cho phép user có quyền document:create tạo đề xuất MOU mới với trạng thái DRAFT' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Document được tạo thành công với trạng thái DRAFT'
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'Không có quyền document:create' })
  @ApiBody({ type: CreateDocumentDto })
  async create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.create(createDocumentDto, user);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Document created successfully',
      data: document
    };
  }

  /**
   * Lấy danh sách documents với filtering và pagination
   */
  @Get()
  @RequireAction('DOCUMENT_READ')
  @ApiOperation({ 
    summary: 'Lấy danh sách documents',
    description: 'Lấy danh sách documents với filter theo status, type, partner, năm, v.v.'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'status', required: false, enum: DocumentStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, enum: DocumentType, description: 'Filter by type' })
  @ApiQuery({ name: 'partnerName', required: false, type: String, description: 'Filter by partner name' })
  @ApiQuery({ name: 'partnerCountry', required: false, type: String, description: 'Filter by partner country' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Filter by year' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in title, partner name' })
  @ApiQuery({ name: 'expiringInDays', required: false, type: Number, description: 'Filter documents expiring in N days' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async findAll(@Query() filterDto: FilterDocumentDto, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const result = await this.documentService.findAll(filterDto, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Documents retrieved successfully',
      data: result
    };
  }

  /**
   * Lấy thống kê documents
   */
  @Get('stats')
  @RequireAction('DOCUMENT_READ')
  @ApiOperation({ 
    summary: 'Lấy thống kê documents',
    description: 'Thống kê số lượng documents theo trạng thái, loại, v.v.'
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const stats = await this.documentService.getDocumentStats(user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document statistics retrieved successfully',
      data: stats
    };
  }

  /**
   * Lấy chi tiết document theo ID
   */
  @Get(':id')
  @RequireAction('DOCUMENT_READ')
  @ApiOperation({ 
    summary: 'Lấy chi tiết document',
    description: 'Lấy thông tin chi tiết của một document. Kiểm tra quyền view dựa trên status và ownership.'
  })
  @ApiResponse({ status: 200, description: 'Document details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem document này' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.findOne(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document retrieved successfully',
      data: document
    };
  }

  /**
   * Cập nhật document (chỉ được phép khi status = DRAFT và là creator)
   */
  @Patch(':id')
  @RequireAction('DOCUMENT_UPDATE')
  @ApiOperation({ 
    summary: 'Cập nhật document',
    description: 'Cập nhật thông tin document. Chỉ được phép khi document ở trạng thái DRAFT và user là creator.'
  })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed hoặc document không thể update' })
  @ApiResponse({ status: 403, description: 'Không có quyền update document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiBody({ type: UpdateDocumentDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: AuthenticatedRequest
  ) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.update(id, updateDocumentDto, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document updated successfully',
      data: document
    };
  }

  /**
   * Hủy document (DRAFT hoặc SUBMITTED)
   */
  @Delete(':id')
  @RequireAction('DOCUMENT_DELETE')
  @ApiOperation({ 
    summary: 'Hủy document',
    description: 'Hủy document (chuyển status sang CANCELLED). Chỉ được phép khi DRAFT hoặc SUBMITTED.'
  })
  @ApiResponse({ status: 200, description: 'Document cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể hủy ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền hủy document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    await this.documentService.cancel(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document cancelled successfully'
    };
  }

  // ==================== Workflow Operations ====================

  /**
   * Submit document để review (DRAFT → SUBMITTED)
   */
  @Post(':id/submit')
  @RequireAction('DOCUMENT_CREATE')
  @ApiOperation({ 
    summary: 'Submit document để review',
    description: 'Chuyển document từ DRAFT → SUBMITTED để bắt đầu quy trình duyệt'
  })
  @ApiResponse({ status: 200, description: 'Document submitted successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể submit ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền submit document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async submit(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.submit(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document submitted successfully',
      data: document
    };
  }

  /**
   * Bắt đầu review process (SUBMITTED → REVIEWING)
   */
  @Post(':id/review')
  @RequireAction('DOCUMENT_UPDATE')
  @ApiOperation({ 
    summary: 'Bắt đầu review process',
    description: 'Chuyển document từ SUBMITTED → REVIEWING để bắt đầu quá trình review'
  })
  @ApiResponse({ status: 200, description: 'Document review started successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể review ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền review document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async startReview(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.startReview(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document review started successfully',
      data: document
    };
  }

  /**
   * Approve document (REVIEWING → APPROVED)
   */
  @Post(':id/approve')
  @RequireAction('DOCUMENT_APPROVE')
  @ApiOperation({ 
    summary: 'Approve document',
    description: 'Phê duyệt document sau khi review. Chuyển từ REVIEWING → APPROVED'
  })
  @ApiResponse({ status: 200, description: 'Document approved successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể approve ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền approve document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiBody({ type: ApproveDocumentDto })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveDto: ApproveDocumentDto,
    @Req() req: AuthenticatedRequest
  ) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.approve(id, approveDto, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document approved successfully',
      data: document
    };
  }

  /**
   * Reject document (REVIEWING → DRAFT)
   */
  @Post(':id/reject')
  @RequireAction('DOCUMENT_APPROVE')
  @ApiOperation({ 
    summary: 'Reject document',
    description: 'Từ chối document sau khi review. Chuyển từ REVIEWING → DRAFT với feedback'
  })
  @ApiResponse({ status: 200, description: 'Document rejected successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể reject ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền reject document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiBody({ 
    type: ApproveDocumentDto,
    description: 'Feedback lý do reject' 
  })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rejectDto: ApproveDocumentDto,
    @Req() req: AuthenticatedRequest
  ) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.reject(id, rejectDto, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document rejected successfully',
      data: document
    };
  }

  /**
   * Sign document (APPROVED → SIGNED)
   */
  @Post(':id/sign')
  @RequireAction('DOCUMENT_APPROVE')
  @ApiOperation({ 
    summary: 'Sign document',
    description: 'Ký kết document sau khi approved. Chuyển từ APPROVED → SIGNED'
  })
  @ApiResponse({ status: 200, description: 'Document signed successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể sign ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền sign document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async sign(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.sign(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document signed successfully',
      data: document
    };
  }

  /**
   * Activate document (SIGNED → ACTIVE)
   */
  @Post(':id/activate')
  @RequireAction('DOCUMENT_ACTIVATE')
  @ApiOperation({ 
    summary: 'Activate document',
    description: 'Kích hoạt document sau khi signed. Chuyển từ SIGNED → ACTIVE'
  })
  @ApiResponse({ status: 200, description: 'Document activated successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể activate ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền activate document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async activate(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.activate(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document activated successfully',
      data: document
    };
  }

  /**
   * Mark document as expired (ACTIVE → EXPIRED)
   */
  @Post(':id/expire')
  @RequireAction('DOCUMENT_APPROVE')
  @ApiOperation({ 
    summary: 'Mark document as expired',
    description: 'Đánh dấu document đã hết hạn. Chuyển từ ACTIVE → EXPIRED'
  })
  @ApiResponse({ status: 200, description: 'Document marked as expired successfully' })
  @ApiResponse({ status: 400, description: 'Document không thể expire ở trạng thái hiện tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền expire document này' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async expire(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const user: DocumentUser = {
      id: req.user.id,
      actions: req.user.actions,
      unitId: req.user.unitId
    };

    const document = await this.documentService.expire(id, user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Document marked as expired successfully',
      data: document
    };
  }
}