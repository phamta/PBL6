import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  Logger,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequireAction } from '../../decorators/require-action.decorator';
import { User } from '../../common/decorators/user.decorator';
import { ReportService, ReportUser, ReportListResult } from './report.service';
import { GenerateReportDto, FilterReportDto } from './dto';
import { ReportLog } from '@prisma/client';

/**
 * ReportController - Quản lý API báo cáo và thống kê
 * 
 * Endpoints:
 * - POST /reports: Tạo báo cáo mới
 * - GET /reports: Lấy danh sách báo cáo với filtering
 * - GET /reports/stats: Lấy thống kê báo cáo
 * - GET /reports/:id: Lấy chi tiết báo cáo
 * - GET /reports/:id/download: Tải xuống file báo cáo
 * - DELETE /reports/:id: Xóa báo cáo
 * 
 * Actions:
 * - report:generate: Tạo báo cáo
 * - report:view: Xem danh sách báo cáo và thống kê
 * - report:download: Tải xuống báo cáo
 * - report:delete: Xóa báo cáo
 */
@ApiTags('Reports')
@ApiBearerAuth()
@Controller('api/v1/reports')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  /**
   * Tạo báo cáo mới
   */
  @Post()
  @RequireAction('report:generate')
  @ApiOperation({
    summary: 'Tạo báo cáo mới',
    description: 'Tạo báo cáo tổng hợp theo loại và tham số được chỉ định. Báo cáo sẽ được xử lý trong background.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo báo cáo thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Tạo báo cáo thành công' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['MOU_SUMMARY', 'VISA_SUMMARY', 'GUEST_SUMMARY', 'TRANSLATION_SUMMARY', 'ACTIVITY_SUMMARY', 'CUSTOM'] },
            status: { type: 'string', enum: ['GENERATING', 'COMPLETED', 'FAILED'] },
            createdAt: { type: 'string', format: 'date-time' },
            createdBy: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fullName: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền tạo báo cáo',
  })
  async generateReport(
    @Body() generateReportDto: GenerateReportDto,
    @User() user: ReportUser,
  ) {
    this.logger.log(`User ${user.id} is generating report: ${generateReportDto.name}`);

    const report = await this.reportService.generateReport(generateReportDto, user);

    return {
      success: true,
      message: 'Tạo báo cáo thành công',
      data: report,
    };
  }

  /**
   * Lấy danh sách báo cáo với filtering
   */
  @Get()
  @RequireAction('report:view')
  @ApiOperation({
    summary: 'Lấy danh sách báo cáo',
    description: 'Lấy danh sách báo cáo với filtering, pagination và sorting.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (mặc định: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng item mỗi trang (mặc định: 20)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Tìm kiếm theo tên báo cáo' })
  @ApiQuery({ name: 'type', required: false, enum: ['MOU_SUMMARY', 'VISA_SUMMARY', 'GUEST_SUMMARY', 'TRANSLATION_SUMMARY', 'ACTIVITY_SUMMARY', 'CUSTOM'], description: 'Lọc theo loại báo cáo' })
  @ApiQuery({ name: 'status', required: false, enum: ['GENERATING', 'COMPLETED', 'FAILED'], description: 'Lọc theo trạng thái' })
  @ApiQuery({ name: 'createdById', required: false, type: String, description: 'Lọc theo người tạo' })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, description: 'Lọc từ ngày tạo (YYYY-MM-DD)' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, description: 'Lọc đến ngày tạo (YYYY-MM-DD)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'updatedAt', 'name', 'type', 'status'], description: 'Sắp xếp theo trường (mặc định: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Thứ tự sắp xếp (mặc định: desc)' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách báo cáo thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Lấy danh sách báo cáo thành công' },
        data: {
          type: 'object',
          properties: {
            reports: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  type: { type: 'string' },
                  status: { type: 'string' },
                  fileSize: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  createdBy: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      fullName: { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
                },
              },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem báo cáo',
  })
  async getReports(
    @Query() filterDto: FilterReportDto,
    @User() user: ReportUser,
  ): Promise<{ success: boolean; message: string; data: ReportListResult }> {
    this.logger.log(`User ${user.id} is getting reports with filters:`, JSON.stringify(filterDto));

    const result = await this.reportService.getReports(filterDto, user);

    return {
      success: true,
      message: 'Lấy danh sách báo cáo thành công',
      data: result,
    };
  }

  /**
   * Lấy thống kê báo cáo
   */
  @Get('stats')
  @RequireAction('report:view')
  @ApiOperation({
    summary: 'Lấy thống kê báo cáo',
    description: 'Lấy thống kê tổng quan về báo cáo trong hệ thống.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê báo cáo thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Lấy thống kê báo cáo thành công' },
        data: {
          type: 'object',
          properties: {
            totalReports: { type: 'number', example: 150 },
            generatingReports: { type: 'number', example: 5 },
            completedReports: { type: 'number', example: 140 },
            failedReports: { type: 'number', example: 5 },
            recentReports: { type: 'number', example: 25, description: 'Báo cáo tạo trong 7 ngày qua' },
            typeStats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  _count: { type: 'object', properties: { id: { type: 'number' } } },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem thống kê báo cáo',
  })
  async getStats(@User() user: ReportUser) {
    this.logger.log(`User ${user.id} is getting report stats`);

    const stats = await this.reportService.getStats(user);

    return {
      success: true,
      message: 'Lấy thống kê báo cáo thành công',
      data: stats,
    };
  }

  /**
   * Lấy chi tiết báo cáo theo ID
   */
  @Get(':id')
  @RequireAction('report:view')
  @ApiOperation({
    summary: 'Lấy chi tiết báo cáo',
    description: 'Lấy thông tin chi tiết của một báo cáo theo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết báo cáo thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Lấy chi tiết báo cáo thành công' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string' },
            parameters: { type: 'object' },
            filePath: { type: 'string' },
            fileSize: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            createdBy: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fullName: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xem báo cáo',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy báo cáo',
  })
  async getReportById(
    @Param('id') id: string,
    @User() user: ReportUser,
  ) {
    this.logger.log(`User ${user.id} is getting report: ${id}`);

    const report = await this.reportService.getReportById(id, user);

    return {
      success: true,
      message: 'Lấy chi tiết báo cáo thành công',
      data: report,
    };
  }

  /**
   * Tải xuống file báo cáo
   */
  @Get(':id/download')
  @RequireAction('report:download')
  @ApiOperation({
    summary: 'Tải xuống báo cáo',
    description: 'Tải xuống file báo cáo đã hoàn thành theo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tải xuống báo cáo thành công',
    headers: {
      'Content-Type': { description: 'application/json' },
      'Content-Disposition': { description: 'attachment; filename="report.json"' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Báo cáo chưa hoàn thành hoặc không tìm thấy file',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền tải xuống báo cáo',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy báo cáo',
  })
  async downloadReport(
    @Param('id') id: string,
    @User() user: ReportUser,
    @Res() res: Response,
  ) {
    this.logger.log(`User ${user.id} is downloading report: ${id}`);

    const { fileName, data } = await this.reportService.downloadReport(id, user);

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': data.length.toString(),
    });

    res.status(HttpStatus.OK).send(data);
  }

  /**
   * Xóa báo cáo
   */
  @Delete(':id')
  @RequireAction('report:delete')
  @ApiOperation({
    summary: 'Xóa báo cáo',
    description: 'Xóa báo cáo và file đính kèm theo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa báo cáo thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Xóa báo cáo thành công' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xóa báo cáo',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy báo cáo',
  })
  async deleteReport(
    @Param('id') id: string,
    @User() user: ReportUser,
  ) {
    this.logger.log(`User ${user.id} is deleting report: ${id}`);

    await this.reportService.deleteReport(id, user);

    return {
      success: true,
      message: 'Xóa báo cáo thành công',
    };
  }
}