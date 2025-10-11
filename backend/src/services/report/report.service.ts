import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ReportLog, ReportType, ReportStatus, Prisma } from 'prisma/prisma-client';
import { GenerateReportDto, FilterReportDto } from './dto';

export interface ReportUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface ReportLogWithRelations extends ReportLog {
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface ReportListResult {
  reports: ReportLogWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportStats {
  totalReports: number;
  byType: { type: ReportType; count: number }[];
  byStatus: { status: ReportStatus; count: number }[];
  completedReports: number;
  failedReports: number;
  generatingReports: number;
}

/**
 * Report Service - Quản lý report logs và report generation
 * 
 * Features:
 * - CRUD operations for report logs
 * - Report filtering by type, year, unitName, partnerName
 * - Status management: GENERATING  COMPLETED / FAILED
 * - Report generation tracking
 * - Statistics and analytics
 */
@Injectable()
export class ReportService {
  private readonly reportInclude: Prisma.ReportLogInclude = {
    createdBy: {
      select: {
        id: true,
        fullName: true,
        email: true,
      } ,
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new report log
   */
  async create(generateReportDto: GenerateReportDto, userId: string): Promise<ReportLogWithRelations> {
    try {
      const data: Prisma.ReportLogCreateInput = {
        name: generateReportDto.name,
        type: generateReportDto.type,
        status: ReportStatus.GENERATING,
        parameters: generateReportDto.parameters ? (generateReportDto.parameters as Prisma.InputJsonValue) : undefined,
        year: generateReportDto['year'],
        unitName: generateReportDto['unitName'],
        partnerName: generateReportDto['partnerName'],
        createdBy: {
          connect: { id: userId },
        },
      };

      const report = await this.prisma.reportLog.create({
        data,
        include: this.reportInclude,
      });

      if (!report.createdBy) {
        throw new BadRequestException('The "createdBy" relation is missing in the report data.');
      }
      return report as ReportLogWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to create report log: ${error.message}`);
    }
  }

  /**
   * Generate a new report (alias for create, used by controller)
   */
  async generateReport(generateReportDto: GenerateReportDto, user: ReportUser): Promise<ReportLogWithRelations> {
    return this.create(generateReportDto, user.id);
  }

  /**
   * Find all reports with filtering and pagination
   */
  async findAll(filterDto: FilterReportDto): Promise<ReportListResult> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ReportLogWhereInput = {};

    // Search in name
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    // Type filter
    if (filters.type) {
      where.type = filters.type;
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status;
    }

    // Year filter
    if (filters['year']) {
      where.year = filters['year'];
    }

    // Unit name filter
    if (filters['unitName']) {
      where.unitName = { contains: filters['unitName'], mode: 'insensitive' };
    }

    // Partner name filter
    if (filters['partnerName']) {
      where.partnerName = { contains: filters['partnerName'], mode: 'insensitive' };
    }

    // Created by filter
    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    // Date range filter
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
    if (sortBy === 'name' || sortBy === 'type' || sortBy === 'status' || 
        sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'fileSize') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    try {
      const [reports, total] = await Promise.all([
        this.prisma.reportLog.findMany({
          where,
          include: this.reportInclude,
          skip,
          take: limit,
          orderBy,
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
      throw new BadRequestException(`Failed to fetch reports: ${error.message}`);
    }
  }

  /**
   * Get reports (alias for findAll, used by controller)
   */
  async getReports(filterDto: FilterReportDto, user: ReportUser): Promise<ReportListResult> {
    // Optional: Add user-specific filtering logic here if needed
    // For example, filter by user.unitId for non-admin users
    return this.findAll(filterDto);
  }

  /**
   * Find one report by ID
   */
  async findOne(id: string): Promise<ReportLogWithRelations> {
    try {
      const report = await this.prisma.reportLog.findUnique({
        where: { id },
        include: this.reportInclude,
      });

      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }

      return report as ReportLogWithRelations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch report: ${error.message}`);
    }
  }

  /**
   * Get report by ID (alias for findOne, used by controller)
   */
  async getReportById(id: string, user: ReportUser): Promise<ReportLogWithRelations> {
    // Optional: Add permission check here if needed
    return this.findOne(id);
  }

  /**
   * Update report status and file information
   */
  async updateStatus(
    id: string, 
    status: ReportStatus, 
    filePath?: string, 
    fileSize?: number
  ): Promise<ReportLogWithRelations> {
    const existingReport = await this.prisma.reportLog.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    try {
      const data: Prisma.ReportLogUpdateInput = {
        status,
      };

      if (filePath !== undefined) {
        data.filePath = filePath;
      }

      if (fileSize !== undefined) {
        data.fileSize = fileSize;
      }

      const report = await this.prisma.reportLog.update({
        where: { id },
        data,
        include: this.reportInclude,
      });

      return report as ReportLogWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to update report status: ${error.message}`);
    }
  }

  /**
   * Delete a report log
   */
  async remove(id: string): Promise<ReportLogWithRelations> {
    const existingReport = await this.prisma.reportLog.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    try {
      const report = await this.prisma.reportLog.delete({
        where: { id },
        include: this.reportInclude,
      });

      return report as ReportLogWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to delete report: ${error.message}`);
    }
  }

  /**
   * Delete report (alias for remove, used by controller)
   */
  async deleteReport(id: string, user: ReportUser): Promise<ReportLogWithRelations> {
    // Optional: Add permission check here if needed
    return this.remove(id);
  }

  /**
   * Mark report as completed with file information
   */
  async markCompleted(id: string, filePath: string, fileSize: number): Promise<ReportLogWithRelations> {
    return this.updateStatus(id, ReportStatus.COMPLETED, filePath, fileSize);
  }

  /**
   * Mark report as failed
   */
  async markFailed(id: string, error?: string): Promise<ReportLogWithRelations> {
    const existingReport = await this.prisma.reportLog.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    try {
      const data: Prisma.ReportLogUpdateInput = {
        status: ReportStatus.FAILED,
      };

      // Store error in parameters if provided
      if (error) {
        const currentParams = existingReport.parameters as any || {};
        data.parameters = {
          ...currentParams,
          error,
          failedAt: new Date().toISOString(),
        };
      }

      const report = await this.prisma.reportLog.update({
        where: { id },
        data,
        include: this.reportInclude,
      });

      return report as ReportLogWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to mark report as failed: ${error.message}`);
    }
  }

  /**
   * Get report statistics
   */
  async getStats(user?: ReportUser): Promise<ReportStats> {
    try {
      // Optional: Filter stats by user's unit if needed
      const where: Prisma.ReportLogWhereInput = {};
      // if (user && user.unitId && !user.actions.includes('report:view:all')) {
      //   where.createdBy = { unitId: user.unitId };
      // }

      const [totalReports, byType, byStatus, completedReports, failedReports, generatingReports] = await Promise.all([
        this.prisma.reportLog.count({ where }),
        this.prisma.reportLog.groupBy({
          by: ['type'],
          _count: true,
          where,
        }),
        this.prisma.reportLog.groupBy({
          by: ['status'],
          _count: true,
          where,
        }),
        this.prisma.reportLog.count({
          where: { ...where, status: ReportStatus.COMPLETED },
        }),
        this.prisma.reportLog.count({
          where: { ...where, status: ReportStatus.FAILED },
        }),
        this.prisma.reportLog.count({
          where: { ...where, status: ReportStatus.GENERATING },
        }),
      ]);

      return {
        totalReports,
        byType: byType.map(item => ({
          type: item.type,
          count: item._count,
        })),
        byStatus: byStatus.map(item => ({
          status: item.status,
          count: item._count,
        })),
        completedReports,
        failedReports,
        generatingReports,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch report statistics: ${error.message}`);
    }
  }

  /**
   * Helper: Get reports by type
   */
  async getReportsByType(type: ReportType): Promise<ReportLogWithRelations[]> {
    try {
      const reports = await this.prisma.reportLog.findMany({
        where: { type },
        include: this.reportInclude,
        orderBy: { createdAt: 'desc' },
      });

      return reports as ReportLogWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch reports by type: ${error.message}`);
    }
  }

  /**
   * Helper: Get reports by year
   */
  async getReportsByYear(year: number): Promise<ReportLogWithRelations[]> {
    try {
      const reports = await this.prisma.reportLog.findMany({
        where: { year },
        include: this.reportInclude,
        orderBy: { createdAt: 'desc' },
      });

      return reports as ReportLogWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch reports by year: ${error.message}`);
    }
  }

  /**
   * Helper: Get reports by unit name
   */
  async getReportsByUnitName(unitName: string): Promise<ReportLogWithRelations[]> {
    try {
      const reports = await this.prisma.reportLog.findMany({
        where: { 
          unitName: { contains: unitName, mode: 'insensitive' } 
        },
        include: this.reportInclude,
        orderBy: { createdAt: 'desc' },
      });

      return reports as ReportLogWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch reports by unit name: ${error.message}`);
    }
  }

  /**
   * Helper: Get reports by partner name
   */
  async getReportsByPartnerName(partnerName: string): Promise<ReportLogWithRelations[]> {
    try {
      const reports = await this.prisma.reportLog.findMany({
        where: { 
          partnerName: { contains: partnerName, mode: 'insensitive' } 
        },
        include: this.reportInclude,
        orderBy: { createdAt: 'desc' },
      });

      return reports as ReportLogWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch reports by partner name: ${error.message}`);
    }
  }

  /**
   * Helper: Get generating reports
   */
  async getGeneratingReports(): Promise<ReportLogWithRelations[]> {
    try {
      const reports = await this.prisma.reportLog.findMany({
        where: { status: ReportStatus.GENERATING },
        include: this.reportInclude,
        orderBy: { createdAt: 'asc' }, // Oldest first
      });

      return reports as ReportLogWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch generating reports: ${error.message}`);
    }
  }

  /**
   * Helper: Get failed reports
   */
  async getFailedReports(): Promise<ReportLogWithRelations[]> {
    try {
      const reports = await this.prisma.reportLog.findMany({
        where: { status: ReportStatus.FAILED },
        include: this.reportInclude,
        orderBy: { createdAt: 'desc' },
      });

      return reports as ReportLogWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch failed reports: ${error.message}`);
    }
  }

  /**
   * Download report file
   */
  async downloadReport(id: string, user: ReportUser): Promise<{ fileName: string; data: Buffer }> {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (report.status !== ReportStatus.COMPLETED) {
      throw new BadRequestException('Report is not completed yet. Only completed reports can be downloaded.');
    }

    if (!report.filePath) {
      throw new BadRequestException('Report file not found. The report may have been generated without a file.');
    }

    try {
      // In a real implementation, you would read the file from storage (S3, local filesystem, etc.)
      // For now, we'll return the report data as JSON
      const reportData = {
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        year: report.year,
        unitName: report.unitName,
        partnerName: report.partnerName,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        createdBy: report.createdBy,
        // Add more report data here based on the report type
      };

      const jsonData = JSON.stringify(reportData, null, 2);
      const buffer = Buffer.from(jsonData, 'utf-8');

      // Generate a safe filename
      const sanitizedName = report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${sanitizedName}_${report.id.substring(0, 8)}.json`;

      return {
        fileName,
        data: buffer,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to download report: ${error.message}`);
    }
  }

  /**
   * Helper: Retry failed report
   */
  async retryReport(id: string): Promise<ReportLogWithRelations> {
    const existingReport = await this.prisma.reportLog.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (existingReport.status !== ReportStatus.FAILED) {
      throw new BadRequestException('Can only retry failed reports');
    }

    try {
      // Clear error information and set to GENERATING
      const currentParams = existingReport.parameters as any || {};
      delete currentParams.error;
      delete currentParams.failedAt;

      const report = await this.prisma.reportLog.update({
        where: { id },
        data: {
          status: ReportStatus.GENERATING,
          parameters: currentParams,
          filePath: null,
          fileSize: null,
        },
        include: this.reportInclude,
      });

      return report as ReportLogWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to retry report: ${error.message}`);
    }
  }
}
