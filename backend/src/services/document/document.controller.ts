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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/user.decorator';
import { UserRole, DocumentStatus, DocumentType } from '@prisma/client';

/**
 * Document Controller - Quản lý MOU và văn bản hợp tác
 */
@ApiTags('Document Management')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * UC002: Tạo đề xuất MOU mới
   */
  @Post()
  @ApiOperation({ summary: 'Tạo đề xuất MOU mới (UC002)' })
  @ApiResponse({ status: 201, description: 'Tạo đề xuất thành công' })
  create(@Body() createDocumentDto: CreateDocumentDto, @User() user: any) {
    return this.documentService.create(createDocumentDto, user.sub);
  }

  /**
   * Lấy danh sách documents
   */
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách văn bản MOU' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'status', required: false, enum: DocumentStatus, description: 'Lọc theo trạng thái' })
  @ApiQuery({ name: 'type', required: false, enum: DocumentType, description: 'Lọc theo loại văn bản' })
  @ApiQuery({ name: 'partnerCountry', required: false, description: 'Lọc theo quốc gia đối tác' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: DocumentStatus,
    @Query('type') type?: DocumentType,
    @Query('partnerCountry') partnerCountry?: string,
  ) {
    return this.documentService.findAll(
      parseInt(page),
      parseInt(limit),
      status,
      type,
      partnerCountry,
    );
  }

  /**
   * Thống kê documents
   */
  @Get('stats')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.LEADERSHIP)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Thống kê văn bản MOU' })
  getStats() {
    return this.documentService.getDocumentStats();
  }

  /**
   * Lấy chi tiết một document
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết văn bản MOU' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy văn bản' })
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  /**
   * Cập nhật document
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật văn bản MOU' })
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @User() user: any,
  ) {
    return this.documentService.update(id, updateDocumentDto, user.sub);
  }

  /**
   * UC003: Duyệt MOU
   */
  @Patch(':id/approve')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.LEADERSHIP)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Duyệt MOU (UC003)' })
  approve(@Param('id') id: string, @User() user: any) {
    return this.documentService.approve(id, user.sub);
  }

  /**
   * Từ chối MOU
   */
  @Patch(':id/reject')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER, UserRole.LEADERSHIP)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Từ chối MOU' })
  reject(@Param('id') id: string, @User() user: any, @Body('reason') reason?: string) {
    return this.documentService.reject(id, user.sub, reason);
  }

  /**
   * Nộp MOU để duyệt
   */
  @Patch(':id/submit')
  @ApiOperation({ summary: 'Nộp MOU để duyệt' })
  submit(@Param('id') id: string, @User() user: any) {
    return this.documentService.submit(id, user.sub);
  }

  /**
   * Xóa document
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa văn bản MOU' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id') id: string, @User() user: any) {
    return this.documentService.remove(id, user.sub);
  }
}