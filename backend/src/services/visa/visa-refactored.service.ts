import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { CreateVisaDto, UpdateVisaDto, ExtendVisaDto, ApproveVisaDto, FilterVisaDto, ApprovalAction } from './dto';
import { Visa, VisaExtension, VisaStatus, Prisma } from '@prisma/client';

export interface VisaUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface VisaWithRelations extends Visa {
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  extensions: VisaExtension[];
}

export interface VisaListResult {
  visas: VisaWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VisaExtensionWithVisa extends VisaExtension {
  visa: VisaWithRelations;
}

/**
 * Visa Service - Quản lý visa và visa extensions
 * 
 * Action permissions:
 * - visa.create: Tạo visa application mới
 * - visa.update: Cập nhật visa information  
 * - visa.delete: Xóa/hủy visa
 * - visa.extend: Tạo visa extension request
 * - visa.approve: Approve visa extension
 * - visa.reject: Reject visa extension
 * - visa.view_all: Xem tất cả visas
 * - visa.view_own: Xem visas do mình tạo
 * - visa.remind: Gửi reminder cho visa sắp hết hạn
 * 
 */
@Injectable()
export class VisaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * UC001: Create new visa record
   */
  async create(createVisaDto: CreateVisaDto, user: VisaUser): Promise<VisaWithRelations> {
    // Kiểm tra quyền tạo visa
    if (!user.actions.includes('visa.create')) {
      throw new ForbiddenException('Không có quyền tạo visa application');
    }

    // Check if visa number already exists
    const existingVisa = await this.prisma.visa.findUnique({
      where: { visaNumber: createVisaDto.visaNumber },
    });

    if (existingVisa) {
      throw new ConflictException(`Visa với số ${createVisaDto.visaNumber} đã tồn tại`);
    }

    // Validate dates
    const issueDate = new Date(createVisaDto.issueDate);
    const expirationDate = new Date(createVisaDto.expirationDate);

    if (expirationDate <= issueDate) {
      throw new BadRequestException('Ngày hết hạn phải sau ngày cấp');
    }

    if (issueDate > new Date()) {
      throw new BadRequestException('Ngày cấp không được trong tương lai');
    }

    try {
      const visa = await this.prisma.visa.create({
        data: {
          holderName: createVisaDto.holderName,
          holderCountry: createVisaDto.holderCountry,
          passportNumber: createVisaDto.passportNumber,
          visaNumber: createVisaDto.visaNumber,
          issueDate: issueDate,
          expirationDate: expirationDate,
          purpose: createVisaDto.purpose,
          sponsorUnit: createVisaDto.sponsorUnit,
          status: VisaStatus.ACTIVE,
          attachments: createVisaDto.attachments || [],
          createdById: createVisaDto.createdBy,
          reminderSent: false,
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          extensions: true,
        },
      });

      // Emit event for visa creation
      this.eventEmitter.emit('visa.created', {
        visaId: visa.id,
        holderName: visa.holderName,
        visaNumber: visa.visaNumber,
        createdById: visa.createdById,
        expirationDate: visa.expirationDate,
      });

      return visa;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Số visa phải là duy nhất');
        }
      }
      throw error;
    }
  }

  /**
   * UC002: Get all visas with filtering and pagination
   */
  async findAll(filterDto: FilterVisaDto, user: VisaUser): Promise<VisaListResult> {
    const page = parseInt(filterDto.page || '1', 10);
    const limit = parseInt(filterDto.limit || '10', 10);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.VisaWhereInput = {};

    // Permission-based filtering
    if (user.actions.includes('visa.view_all')) {
      // Có thể xem tất cả visas
    } else if (user.actions.includes('visa.view_own')) {
      // Chỉ xem visas do mình tạo
      where.createdById = user.id;
    } else {
      throw new ForbiddenException('Không có quyền xem danh sách visa');
    }

    // Search by holder name or visa number
    if (filterDto.search) {
      where.OR = [
        { holderName: { contains: filterDto.search, mode: 'insensitive' } },
        { visaNumber: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    // Filter by status
    if (filterDto.status) {
      where.status = filterDto.status;
    }

    // Filter by multiple statuses
    if (filterDto.statuses && filterDto.statuses.length > 0) {
      where.status = { in: filterDto.statuses };
    }

    // Filter by holder country
    if (filterDto.holderCountry) {
      where.holderCountry = { contains: filterDto.holderCountry, mode: 'insensitive' };
    }

    // Filter by sponsor unit
    if (filterDto.sponsorUnit) {
      where.sponsorUnit = { contains: filterDto.sponsorUnit, mode: 'insensitive' };
    }

    // Filter by issue date range
    if (filterDto.issueDateFrom || filterDto.issueDateTo) {
      where.issueDate = {};
      if (filterDto.issueDateFrom) {
        where.issueDate.gte = new Date(filterDto.issueDateFrom);
      }
      if (filterDto.issueDateTo) {
        where.issueDate.lte = new Date(filterDto.issueDateTo);
      }
    }

    // Filter by expiration date range
    if (filterDto.expirationDateFrom || filterDto.expirationDateTo) {
      where.expirationDate = {};
      if (filterDto.expirationDateFrom) {
        where.expirationDate.gte = new Date(filterDto.expirationDateFrom);
      }
      if (filterDto.expirationDateTo) {
        where.expirationDate.lte = new Date(filterDto.expirationDateTo);
      }
    }

    // Filter visas expiring within specified days
    if (filterDto.expiringWithinDays) {
      const days = parseInt(filterDto.expiringWithinDays, 10);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      where.expirationDate = {
        gte: new Date(),
        lte: futureDate,
      };
    }

    // Filter by created by
    if (filterDto.createdBy) {
      where.createdById = filterDto.createdBy;
    }

    // Filter by approved by
    if (filterDto.approvedBy) {
      where.approvedById = filterDto.approvedBy;
    }

    const orderBy: Prisma.VisaOrderByWithRelationInput = {};
    const sortField = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder || 'desc';
    orderBy[sortField as keyof Prisma.VisaOrderByWithRelationInput] = sortOrder;

    try {
      const [visas, total] = await Promise.all([
        this.prisma.visa.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true },
            },
            approvedBy: {
              select: { id: true, fullName: true, email: true },
            },
            extensions: true,
          },
        }),
        this.prisma.visa.count({ where }),
      ]);

      return {
        visas,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi truy vấn danh sách visa');
    }
  }

  /**
   * UC003: Find visa by ID
   */
  async findOne(id: string, user: VisaUser): Promise<VisaWithRelations> {
    const visa = await this.prisma.visa.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
        approvedBy: {
          select: { id: true, fullName: true, email: true },
        },
        extensions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!visa) {
      throw new NotFoundException('Không tìm thấy visa');
    }

    // Permission-based access control
    if (!user.actions.includes('visa.view_all')) {
      // Nếu không có quyền view all, chỉ xem được visa của mình
      if (!user.actions.includes('visa.view_own') || visa.createdById !== user.id) {
        throw new ForbiddenException('Không có quyền truy cập visa này');
      }
    }

    return visa;
  }

  /**
   * UC004: Update visa information
   */
  async update(id: string, updateVisaDto: UpdateVisaDto, user: VisaUser): Promise<VisaWithRelations> {
    // Kiểm tra quyền update
    if (!user.actions.includes('visa.update')) {
      throw new ForbiddenException('Không có quyền cập nhật visa');
    }

    const visa = await this.findOne(id, user);

    // Chỉ creator có thể update
    if (visa.createdById !== user.id) {
      throw new ForbiddenException('Chỉ có thể cập nhật visa do bạn tạo');
    }

    // Validate dates if provided
    if (updateVisaDto.issueDate || updateVisaDto.expirationDate) {
      const issueDate = updateVisaDto.issueDate ? new Date(updateVisaDto.issueDate) : visa.issueDate;
      const expirationDate = updateVisaDto.expirationDate ? new Date(updateVisaDto.expirationDate) : visa.expirationDate;

      if (expirationDate <= issueDate) {
        throw new BadRequestException('Ngày hết hạn phải sau ngày cấp');
      }
    }

    try {
      const updatedVisa = await this.prisma.visa.update({
        where: { id },
        data: updateVisaDto,
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          extensions: true,
        },
      });

      this.eventEmitter.emit('visa.updated', {
        visaId: id,
        updatedBy: user.id,
        changes: updateVisaDto,
      });

      return updatedVisa;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Số visa đã tồn tại');
        }
      }
      throw error;
    }
  }

  /**
   * UC005: Delete/Cancel visa
   */
  async remove(id: string, user: VisaUser): Promise<void> {
    // Kiểm tra quyền delete
    if (!user.actions.includes('visa.delete')) {
      throw new ForbiddenException('Không có quyền xóa visa');
    }

    const visa = await this.findOne(id, user);

    // Chỉ creator có thể delete
    if (visa.createdById !== user.id) {
      throw new ForbiddenException('Chỉ có thể xóa visa do bạn tạo');
    }

    // Không thể xóa visa đã có extensions được approve
    const approvedExtensions = await this.prisma.visaExtension.count({
      where: {
        visaId: id,
        status: 'APPROVED',
      },
    });

    if (approvedExtensions > 0) {
      throw new BadRequestException('Không thể xóa visa đã có extension được phê duyệt');
    }

    try {
      // Soft delete by updating status
      await this.prisma.visa.update({
        where: { id },
        data: { status: VisaStatus.CANCELLED },
      });

      this.eventEmitter.emit('visa.cancelled', {
        visaId: id,
        cancelledBy: user.id,
        holderName: visa.holderName,
      });
    } catch (error) {
      throw new BadRequestException('Lỗi khi xóa visa');
    }
  }

  /**
   * UC006: Create visa extension request
   */
  async createExtension(id: string, extendVisaDto: ExtendVisaDto, user: VisaUser): Promise<VisaExtension> {
    // Kiểm tra quyền extend
    if (!user.actions.includes('visa.extend')) {
      throw new ForbiddenException('Không có quyền tạo visa extension');
    }

    const visa = await this.findOne(id, user);

    // Validate new expiration date
    const newExpirationDate = new Date(extendVisaDto.newExpirationDate);
    if (newExpirationDate <= visa.expirationDate) {
      throw new BadRequestException('Ngày hết hạn mới phải sau ngày hết hạn hiện tại');
    }

    // Check if there's already a pending extension
    const pendingExtension = await this.prisma.visaExtension.findFirst({
      where: {
        visaId: id,
        status: 'PENDING',
      },
    });

    if (pendingExtension) {
      throw new ConflictException('Đã có extension đang chờ phê duyệt');
    }

    try {
      const extension = await this.prisma.visaExtension.create({
        data: {
          visaId: id,
          newExpirationDate: newExpirationDate,
          reason: extendVisaDto.reason,
          status: 'PENDING',
        },
      });

      this.eventEmitter.emit('visa.extension.created', {
        extensionId: extension.id,
        visaId: id,
        requestedBy: user.id,
        holderName: visa.holderName,
        newExpirationDate: newExpirationDate,
      });

      return extension;
    } catch (error) {
      throw new BadRequestException('Lỗi khi tạo extension request');
    }
  }

  /**
   * UC007: Approve visa extension
   */
  async approveExtension(extensionId: string, approveDto: ApproveVisaDto, user: VisaUser): Promise<VisaExtension> {
    // Kiểm tra quyền approve
    if (!user.actions.includes('visa.approve')) {
      throw new ForbiddenException('Không có quyền phê duyệt visa extension');
    }

    const extension = await this.prisma.visaExtension.findUnique({
      where: { id: extensionId },
      include: {
        visa: {
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
      },
    });

    if (!extension) {
      throw new NotFoundException('Không tìm thấy extension request');
    }

    if (extension.status !== 'PENDING') {
      throw new BadRequestException('Chỉ có thể phê duyệt extension đang PENDING');
    }

    try {
      // Update extension status
      const updatedExtension = await this.prisma.visaExtension.update({
        where: { id: extensionId },
        data: {
          status: approveDto.action === ApprovalAction.APPROVE ? 'APPROVED' : 'REJECTED',
        },
      });

      // If approved, update visa expiration date
      if (approveDto.action === ApprovalAction.APPROVE) {
        await this.prisma.visa.update({
          where: { id: extension.visaId },
          data: {
            expirationDate: extension.newExpirationDate,
            reminderSent: false, // Reset reminder flag
          },
        });

        this.eventEmitter.emit('visa.extension.approved', {
          extensionId: extensionId,
          visaId: extension.visaId,
          approvedBy: user.id,
          holderName: extension.visa.holderName,
          newExpirationDate: extension.newExpirationDate,
        });
      } else {
        this.eventEmitter.emit('visa.extension.rejected', {
          extensionId: extensionId,
          visaId: extension.visaId,
          rejectedBy: user.id,
          holderName: extension.visa.holderName,
          reason: approveDto.comments,
        });
      }

      return updatedExtension;
    } catch (error) {
      throw new BadRequestException('Lỗi khi xử lý extension request');
    }
  }

  /**
   * UC008: Get visa extensions
   */
  async getExtensions(visaId: string, user: VisaUser): Promise<VisaExtension[]> {
    // Kiểm tra quyền xem extensions
    const visa = await this.findOne(visaId, user);

    return await this.prisma.visaExtension.findMany({
      where: { visaId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * UC009: Get visa statistics
   */
  async getStats(user: VisaUser): Promise<any> {
    const where: Prisma.VisaWhereInput = {};

    // Permission-based filtering for stats
    if (user.actions.includes('visa.view_all')) {
      // Có thể xem stats của tất cả visas
    } else if (user.actions.includes('visa.view_own')) {
      // Chỉ xem stats của visas của mình
      where.createdById = user.id;
    } else {
      throw new ForbiddenException('Không có quyền xem thống kê visa');
    }

    const [
      totalCount,
      activeCount,
      expiredCount,
      cancelledCount,
      expiringSoonCount,
      pendingExtensionsCount,
    ] = await Promise.all([
      this.prisma.visa.count({ where }),
      this.prisma.visa.count({ where: { ...where, status: VisaStatus.ACTIVE } }),
      this.prisma.visa.count({ where: { ...where, status: VisaStatus.EXPIRED } }),
      this.prisma.visa.count({ where: { ...where, status: VisaStatus.CANCELLED } }),
      this.prisma.visa.count({
        where: {
          ...where,
          status: VisaStatus.ACTIVE,
          expirationDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            gte: new Date(),
          },
        },
      }),
      this.prisma.visaExtension.count({
        where: {
          status: 'PENDING',
          visa: where.createdById ? { createdById: where.createdById } : {},
        },
      }),
    ]);

    return {
      total: totalCount,
      byStatus: {
        active: activeCount,
        expired: expiredCount,
        cancelled: cancelledCount,
      },
      alerts: {
        expiringSoon: expiringSoonCount,
        pendingExtensions: pendingExtensionsCount,
      },
    };
  }

  /**
   * UC010: Send expiration reminders (cron job)
   */
  async sendExpirationReminders(): Promise<void> {
    // Chỉ system hoặc user có quyền remind mới được gọi
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // 30 days from now

    const expiringVisas = await this.prisma.visa.findMany({
      where: {
        status: VisaStatus.ACTIVE,
        expirationDate: {
          lte: futureDate,
          gte: new Date(),
        },
        reminderSent: false,
      },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    for (const visa of expiringVisas) {
      this.eventEmitter.emit('visa.expiring', {
        visaId: visa.id,
        holderName: visa.holderName,
        visaNumber: visa.visaNumber,
        expirationDate: visa.expirationDate,
        daysLeft: Math.ceil((visa.expirationDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
        createdBy: visa.createdBy,
      });

      // Mark reminder as sent
      await this.prisma.visa.update({
        where: { id: visa.id },
        data: { reminderSent: true },
      });
    }
  }

  /**
   * Reset reminder status (for testing)
   */
  async resetReminders(): Promise<number> {
    const result = await this.prisma.visa.updateMany({
      where: { reminderSent: true },
      data: { reminderSent: false },
    });

    return result.count;
  }
}