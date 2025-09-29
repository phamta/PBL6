import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { GenerateReportDto, FilterReportDto, ReportParameters } from './dto';
import { ReportLog, ReportType, ReportStatus, Prisma } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface ReportUser {
  id: string;
  actions: string[];
  unitId?: string;
  email?: string;
  fullName?: string;
}

export interface ReportLogWithRelations extends ReportLog {
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface ReportListResult {
  reports: ReportLogWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportData {
  summary: {
    title: string;
    type: ReportType;
    generatedAt: string;
    generatedBy: string;
    parameters: ReportParameters;
    totalRecords: number;
  };
  data: any[];
  statistics?: any;
  charts?: any;
}

/**
 * ReportService - Quản lý báo cáo và thống kê
 * 
 * Action permissions:
 * - report:generate: Tạo báo cáo
 * - report:view: Xem danh sách báo cáo
 * - report:download: Tải xuống báo cáo
 * - report:delete: Xóa báo cáo
 */
@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  private readonly reportsDir = path.join(process.cwd(), 'reports');

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.ensureReportsDirectory();
  }

  /**
   * Đảm bảo thư mục reports tồn tại
   */
  private async ensureReportsDirectory() {
    try {
      await fs.access(this.reportsDir);
    } catch {
      await fs.mkdir(this.reportsDir, { recursive: true });
      this.logger.log(`Created reports directory: ${this.reportsDir}`);
    }
  }

  /**
   * Tạo báo cáo mới
   */
  async generateReport(generateReportDto: GenerateReportDto, user: ReportUser): Promise<ReportLogWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('report:generate')) {
      throw new ForbiddenException('Không có quyền tạo báo cáo');
    }

    let reportLog: ReportLogWithRelations;

    try {
      // Tạo ReportLog với status GENERATING
      reportLog = await this.prisma.reportLog.create({
        data: {
          name: generateReportDto.name,
          type: generateReportDto.type,
          parameters: (generateReportDto.parameters || {}) as any,
          status: ReportStatus.GENERATING,
          createdById: user.id,
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      }) as ReportLogWithRelations;

      this.logger.log(`Started generating report: ${reportLog.name} (ID: ${reportLog.id})`);

      // Emit event
      this.eventEmitter.emit('report.generating', {
        report: reportLog,
        user,
      });

      // Tạo báo cáo trong background (simulate async processing)
      setImmediate(() => this.processReportGeneration(reportLog, user));

      return reportLog;
    } catch (error) {
      this.logger.error(`Failed to initiate report generation: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi khởi tạo báo cáo');
    }
  }

  /**
   * Xử lý tạo báo cáo (background process)
   */
  private async processReportGeneration(reportLog: ReportLogWithRelations, user: ReportUser) {
    try {
      // Query dữ liệu theo loại báo cáo
      const reportData = await this.queryReportData(reportLog.type, reportLog.parameters as ReportParameters);
      
      // Tạo file JSON
      const fileName = `${reportLog.type.toLowerCase()}_${reportLog.id}_${Date.now()}.json`;
      const filePath = path.join(this.reportsDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(reportData, null, 2), 'utf-8');
      const stats = await fs.stat(filePath);

      // Cập nhật ReportLog với thông tin file
      const updatedReport = await this.prisma.reportLog.update({
        where: { id: reportLog.id },
        data: {
          status: ReportStatus.COMPLETED,
          filePath: fileName, // Chỉ lưu tên file, không lưu full path
          fileSize: stats.size,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      this.logger.log(`Completed report generation: ${reportLog.name} (${stats.size} bytes)`);

      // Emit event
      this.eventEmitter.emit('report.completed', {
        report: updatedReport,
        user,
        filePath: fileName,
        fileSize: stats.size,
      });

    } catch (error) {
      this.logger.error(`Failed to generate report ${reportLog.id}: ${error.message}`, error.stack);

      // Cập nhật status thành FAILED
      await this.prisma.reportLog.update({
        where: { id: reportLog.id },
        data: {
          status: ReportStatus.FAILED,
          updatedAt: new Date(),
        },
      });

      // Emit event
      this.eventEmitter.emit('report.failed', {
        report: reportLog,
        user,
        error: error.message,
      });
    }
  }

  /**
   * Query dữ liệu theo loại báo cáo
   */
  private async queryReportData(type: ReportType, parameters: ReportParameters): Promise<ReportData> {
    const params = parameters || {};
    let whereClause: any = {};

    // Build date range filter
    if (params.dateFrom || params.dateTo) {
      whereClause.createdAt = {};
      if (params.dateFrom) {
        whereClause.createdAt.gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        whereClause.createdAt.lte = new Date(params.dateTo);
      }
    }

    switch (type) {
      case ReportType.MOU_SUMMARY:
        return this.generateMouSummary(whereClause, params);
      
      case ReportType.VISA_SUMMARY:
        return this.generateVisaSummary(whereClause, params);
      
      case ReportType.GUEST_SUMMARY:
        return this.generateGuestSummary(whereClause, params);
      
      case ReportType.TRANSLATION_SUMMARY:
        return this.generateTranslationSummary(whereClause, params);
      
      case ReportType.ACTIVITY_SUMMARY:
        return this.generateActivitySummary(whereClause, params);
      
      case ReportType.CUSTOM:
        return this.generateCustomReport(whereClause, params);
      
      default:
        throw new BadRequestException(`Unsupported report type: ${type}`);
    }
  }

  /**
   * Tạo báo cáo tổng hợp MOU/Document
   */
  private async generateMouSummary(whereClause: any, params: ReportParameters): Promise<ReportData> {
    // Thêm filters specific cho Document
    if (params.status) {
      whereClause.status = params.status;
    }

    const [documents, totalCount, statusStats] = await Promise.all([
      this.prisma.document.findMany({
        where: whereClause,
        include: {
          createdBy: { select: { id: true, fullName: true } },
          approvedBy: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count({ where: whereClause }),
      this.prisma.document.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true },
      }),
    ]);

    // Thống kê theo năm
    const yearStats = await this.prisma.document.groupBy({
      by: ['createdAt'],
      where: whereClause,
      _count: { id: true },
    });

    const yearlyData = this.groupByYear(yearStats.map(item => ({
      year: new Date(item.createdAt).getFullYear(),
      count: item._count.id,
    })));

    return {
      summary: {
        title: 'Báo cáo tổng hợp MOU/Document',
        type: ReportType.MOU_SUMMARY,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System',
        parameters: params,
        totalRecords: totalCount,
      },
      data: documents,
      statistics: {
        total: totalCount,
        byStatus: statusStats,
        byYear: yearlyData,
      },
    };
  }

  /**
   * Tạo báo cáo tổng hợp Visa
   */
  private async generateVisaSummary(whereClause: any, params: ReportParameters): Promise<ReportData> {
    // Thêm filters specific cho Visa
    if (params.status) {
      whereClause.status = params.status;
    }
    if (params.visaType) {
      whereClause.visaType = params.visaType;
    }
    if (params.nationality) {
      whereClause.holderCountry = { contains: params.nationality, mode: 'insensitive' };
    }

    const [visas, totalCount, statusStats] = await Promise.all([
      this.prisma.visa.findMany({
        where: whereClause,
        include: {
          createdBy: { select: { id: true, fullName: true } },
          approvedBy: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.visa.count({ where: whereClause }),
      this.prisma.visa.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true },
      }),
    ]);

    // Get nationality stats with a simpler query
    const nationalityStats = await this.prisma.visa.findMany({
      where: whereClause,
      select: { holderCountry: true },
      take: 1000, // limit to prevent performance issues
    });

    const nationalityCounts = nationalityStats.reduce((acc, visa) => {
      if (visa.holderCountry) {
        acc[visa.holderCountry] = (acc[visa.holderCountry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topNationalities = Object.entries(nationalityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([nationality, count]) => ({ holderCountry: nationality, _count: { id: count } }));

    return {
      summary: {
        title: 'Báo cáo tổng hợp Visa',
        type: ReportType.VISA_SUMMARY,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System',
        parameters: params,
        totalRecords: totalCount,
      },
      data: visas,
      statistics: {
        total: totalCount,
        byStatus: statusStats,
        byNationality: topNationalities,
      },
    };
  }

  /**
   * Tạo báo cáo tổng hợp Guest
   */
  private async generateGuestSummary(whereClause: any, params: ReportParameters): Promise<ReportData> {
    // Thêm filters specific cho Guest
    if (params.status) {
      whereClause.status = params.status;
    }
    if (params.organization) {
      whereClause.groupName = { contains: params.organization, mode: 'insensitive' };
    }

    const [guests, totalCount, statusStats] = await Promise.all([
      this.prisma.guest.findMany({
        where: whereClause,
        include: {
          createdBy: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.guest.count({ where: whereClause }),
      this.prisma.guest.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true },
      }),
    ]);

    // Get group name stats with a simpler query
    const groupStats = await this.prisma.guest.findMany({
      where: whereClause,
      select: { groupName: true },
      take: 1000,
    });

    const groupCounts = groupStats.reduce((acc, guest) => {
      const groupName = guest.groupName || 'Cá nhân';
      acc[groupName] = (acc[groupName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topGroups = Object.entries(groupCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([groupName, count]) => ({ groupName, _count: { id: count } }));

    return {
      summary: {
        title: 'Báo cáo tổng hợp Guest',
        type: ReportType.GUEST_SUMMARY,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System',
        parameters: params,
        totalRecords: totalCount,
      },
      data: guests,
      statistics: {
        total: totalCount,
        byStatus: statusStats,
        byGroup: topGroups,
      },
    };
  }

  /**
   * Tạo báo cáo tổng hợp Translation
   */
  private async generateTranslationSummary(whereClause: any, params: ReportParameters): Promise<ReportData> {
    // Thêm filters specific cho Translation
    if (params.status) {
      whereClause.status = params.status;
    }
    if (params.sourceLanguage) {
      whereClause.sourceLanguage = { contains: params.sourceLanguage, mode: 'insensitive' };
    }
    if (params.targetLanguage) {
      whereClause.targetLanguage = { contains: params.targetLanguage, mode: 'insensitive' };
    }

    const [translations, totalCount, statusStats, languageStats] = await Promise.all([
      this.prisma.translation.findMany({
        where: whereClause,
        include: {
          createdBy: { select: { id: true, fullName: true } },
          approvedBy: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.translation.count({ where: whereClause }),
      this.prisma.translation.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true },
      }),
      this.prisma.translation.groupBy({
        by: ['sourceLanguage', 'targetLanguage'],
        where: whereClause,
        _count: { id: true },
        take: 10,
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    return {
      summary: {
        title: 'Báo cáo tổng hợp Translation',
        type: ReportType.TRANSLATION_SUMMARY,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System',
        parameters: params,
        totalRecords: totalCount,
      },
      data: translations,
      statistics: {
        total: totalCount,
        byStatus: statusStats,
        byLanguagePair: languageStats,
      },
    };
  }

  /**
   * Tạo báo cáo tổng hợp Activity
   */
  private async generateActivitySummary(whereClause: any, params: ReportParameters): Promise<ReportData> {
    // Thêm filters specific cho ActivityLog
    if (params.actionType) {
      whereClause.action = { contains: params.actionType, mode: 'insensitive' };
    }
    if (params.userId) {
      whereClause.userId = params.userId;
    }

    const [activities, totalCount, actionStats, userStats] = await Promise.all([
      this.prisma.activityLog.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.count({ where: whereClause }),
      this.prisma.activityLog.groupBy({
        by: ['action'],
        where: whereClause,
        _count: { id: true },
        take: 20,
        orderBy: { _count: { id: 'desc' } },
      }),
      this.prisma.activityLog.groupBy({
        by: ['userId'],
        where: whereClause,
        _count: { id: true },
        take: 10,
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    return {
      summary: {
        title: 'Báo cáo tổng hợp Activity',
        type: ReportType.ACTIVITY_SUMMARY,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System',
        parameters: params,
        totalRecords: totalCount,
      },
      data: activities,
      statistics: {
        total: totalCount,
        byAction: actionStats,
        byUser: userStats,
      },
    };
  }

  /**
   * Tạo báo cáo tùy chỉnh
   */
  private async generateCustomReport(whereClause: any, params: ReportParameters): Promise<ReportData> {
    // Báo cáo tùy chỉnh có thể kết hợp nhiều entity
    const [documentCount, visaCount, guestCount, translationCount, activityCount] = await Promise.all([
      this.prisma.document.count({ where: whereClause }),
      this.prisma.visa.count({ where: whereClause }),
      this.prisma.guest.count({ where: whereClause }),
      this.prisma.translation.count({ where: whereClause }),
      this.prisma.activityLog.count({ where: whereClause }),
    ]);

    return {
      summary: {
        title: 'Báo cáo tùy chỉnh',
        type: ReportType.CUSTOM,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System',
        parameters: params,
        totalRecords: documentCount + visaCount + guestCount + translationCount + activityCount,
      },
      data: [],
      statistics: {
        documents: documentCount,
        visas: visaCount,
        guests: guestCount,
        translations: translationCount,
        activities: activityCount,
      },
    };
  }

  /**
   * Nhóm dữ liệu theo năm
   */
  private groupByYear(data: { year: number; count: number }[]): Record<string, number> {
    return data.reduce((acc, item) => {
      acc[item.year.toString()] = (acc[item.year.toString()] || 0) + item.count;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Lấy danh sách báo cáo với filtering
   */
  async getReports(filterDto: FilterReportDto, user: ReportUser): Promise<ReportListResult> {
    // Kiểm tra quyền
    if (!user.actions.includes('report:view')) {
      throw new ForbiddenException('Không có quyền xem báo cáo');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ReportLogWhereInput = {};

    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.createdFrom || filters.createdTo) {
      where.createdAt = {};
      if (filters.createdFrom) {
        where.createdAt.gte = new Date(filters.createdFrom);
      }
      if (filters.createdTo) {
        where.createdAt.lte = new Date(filters.createdTo);
      }
    }

    // Build orderBy
    const orderBy: Prisma.ReportLogOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    try {
      const [reports, total] = await Promise.all([
        this.prisma.reportLog.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true },
            },
          },
        }),
        this.prisma.reportLog.count({ where }),
      ]);

      return {
        reports: reports as ReportLogWithRelations[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get reports: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy danh sách báo cáo');
    }
  }

  /**
   * Lấy chi tiết báo cáo theo ID
   */
  async getReportById(id: string, user: ReportUser): Promise<ReportLogWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('report:view')) {
      throw new ForbiddenException('Không có quyền xem báo cáo');
    }

    try {
      const report = await this.prisma.reportLog.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      if (!report) {
        throw new NotFoundException('Không tìm thấy báo cáo');
      }

      return report as ReportLogWithRelations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get report: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy thông tin báo cáo');
    }
  }

  /**
   * Tải xuống file báo cáo
   */
  async downloadReport(id: string, user: ReportUser): Promise<{ filePath: string; fileName: string; data: Buffer }> {
    // Kiểm tra quyền
    if (!user.actions.includes('report:download')) {
      throw new ForbiddenException('Không có quyền tải xuống báo cáo');
    }

    const report = await this.prisma.reportLog.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Không tìm thấy báo cáo');
    }

    if (report.status !== ReportStatus.COMPLETED) {
      throw new BadRequestException('Báo cáo chưa hoàn thành hoặc đã lỗi');
    }

    if (!report.filePath) {
      throw new BadRequestException('Không tìm thấy file báo cáo');
    }

    try {
      const fullFilePath = path.join(this.reportsDir, report.filePath);
      const data = await fs.readFile(fullFilePath);
      
      this.logger.log(`Downloaded report: ${report.name} by user: ${user.id}`);

      return {
        filePath: fullFilePath,
        fileName: report.filePath,
        data,
      };
    } catch (error) {
      this.logger.error(`Failed to download report: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi tải xuống báo cáo');
    }
  }

  /**
   * Xóa báo cáo
   */
  async deleteReport(id: string, user: ReportUser): Promise<void> {
    // Kiểm tra quyền
    if (!user.actions.includes('report:delete')) {
      throw new ForbiddenException('Không có quyền xóa báo cáo');
    }

    const report = await this.prisma.reportLog.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Không tìm thấy báo cáo');
    }

    try {
      // Xóa file nếu tồn tại
      if (report.filePath) {
        const fullFilePath = path.join(this.reportsDir, report.filePath);
        try {
          await fs.unlink(fullFilePath);
        } catch (error) {
          this.logger.warn(`Failed to delete report file: ${fullFilePath}`);
        }
      }

      // Xóa record trong database
      await this.prisma.reportLog.delete({
        where: { id },
      });

      this.logger.log(`Deleted report: ${report.name} by user: ${user.id}`);

      // Emit event
      this.eventEmitter.emit('report.deleted', {
        report,
        user,
      });
    } catch (error) {
      this.logger.error(`Failed to delete report: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi xóa báo cáo');
    }
  }

  /**
   * Lấy thống kê báo cáo
   */
  async getStats(user: ReportUser) {
    // Kiểm tra quyền
    if (!user.actions.includes('report:view')) {
      throw new ForbiddenException('Không có quyền xem thống kê báo cáo');
    }

    try {
      const [
        totalReports,
        generatingReports,
        completedReports,
        failedReports,
        recentReports,
        typeStats,
      ] = await Promise.all([
        this.prisma.reportLog.count(),
        this.prisma.reportLog.count({ where: { status: ReportStatus.GENERATING } }),
        this.prisma.reportLog.count({ where: { status: ReportStatus.COMPLETED } }),
        this.prisma.reportLog.count({ where: { status: ReportStatus.FAILED } }),
        this.prisma.reportLog.count({ 
          where: { 
            createdAt: { 
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            }
          } 
        }),
        this.prisma.reportLog.groupBy({
          by: ['type'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
        }),
      ]);

      return {
        totalReports,
        generatingReports,
        completedReports,
        failedReports,
        recentReports,
        typeStats,
      };
    } catch (error) {
      this.logger.error(`Failed to get report stats: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy thống kê báo cáo');
    }
  }
}