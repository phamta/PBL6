import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma, Visa, VisaStatus, VisaExtension } from '@prisma/client';
import { CreateVisaDto, UpdateVisaDto, FilterVisaDto, ExtendVisaDto, ApproveVisaDto, ApprovalAction } from './dto';

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
    unitId?: string | null;
  };
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  partner?: {
    id: string;
    name: string;
    country?: string | null;
    contactEmail?: string | null;
  } | null;
  unit?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
  extensions: VisaExtension[];
  foreignStudents: Array<{
    id: string;
    fullName: string;
    nationality: string;
    status?: string | null;
  }>;
}

export interface VisaListResult {
  visas: VisaWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VisaStats {
  totalVisas: number;
  byStatus: Record<string, number>;
  expiringVisas: number;
  myVisas: number;
  recentExtensions: number;
}

@Injectable()
export class VisaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly visaInclude: Prisma.VisaInclude = {
    createdBy: {
      select: { id: true, fullName: true, email: true, unitId: true },
    },
    approvedBy: {
      select: { id: true, fullName: true, email: true },
    },
    partner: {
      select: { id: true, name: true, country: true, contactEmail: true },
    },
    unit: {
      select: { id: true, name: true, code: true },
    },
    extensions: {
      orderBy: { createdAt: 'desc' },
    },
    foreignStudents: {
      select: { id: true, fullName: true, nationality: true, status: true },
    },
  };

  /**
   * Create new visa record with all new fields
   * Supports: dateOfBirth, visaType, entryDate, program, department,
   * supervisorName, email, phone, partnerId, unitId, etc.
   */
  async create(createVisaDto: CreateVisaDto, user: VisaUser): Promise<VisaWithRelations> {
    if (!user.actions.includes('VISA_CREATE')) {
      throw new ForbiddenException('You do not have permission to create visa applications');
    }

    // Check if visa number already exists
    const existingVisa = await this.prisma.visa.findUnique({
      where: { visaNumber: createVisaDto.visaNumber },
    });

    if (existingVisa) {
      throw new ConflictException(`Visa number ${createVisaDto.visaNumber} already exists`);
    }

    // Validate partner if provided
    if (createVisaDto['partnerId']) {
      const partner = await this.prisma.partner.findUnique({
        where: { id: createVisaDto['partnerId'] },
      });
      if (!partner) {
        throw new BadRequestException(`Partner with ID ${createVisaDto['partnerId']} not found`);
      }
    }

    // Validate unit if provided
    if (createVisaDto['unitId']) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: createVisaDto['unitId'] },
      });
      if (!unit) {
        throw new BadRequestException(`Unit with ID ${createVisaDto['unitId']} not found`);
      }
    }

    // Validate dates
    const issueDate = new Date(createVisaDto.issueDate);
    const expirationDate = new Date(createVisaDto.expirationDate);

    if (expirationDate <= issueDate) {
      throw new BadRequestException('Expiration date must be after issue date');
    }

    // Prepare data for creation
    const data: Prisma.VisaCreateInput = {
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
      createdBy: {
        connect: { id: user.id },
      },
    };

    // Add new optional fields if provided
    if (createVisaDto['dateOfBirth']) {
      data.dateOfBirth = new Date(createVisaDto['dateOfBirth']);
    }
    if (createVisaDto['visaType']) {
      data.visaType = createVisaDto['visaType'];
    }
    if (createVisaDto['entryDate']) {
      data.entryDate = new Date(createVisaDto['entryDate']);
    }
    if (createVisaDto['program']) {
      data.program = createVisaDto['program'];
    }
    if (createVisaDto['department']) {
      data.department = createVisaDto['department'];
    }
    if (createVisaDto['supervisorName']) {
      data.supervisorName = createVisaDto['supervisorName'];
    }
    if (createVisaDto['email']) {
      data.email = createVisaDto['email'];
    }
    if (createVisaDto['phone']) {
      data.phone = createVisaDto['phone'];
    }
    if (createVisaDto['na5Request'] !== undefined) {
      data.na5Request = createVisaDto['na5Request'];
    }

    // Connect relations
    if (createVisaDto['partnerId']) {
      data.partner = { connect: { id: createVisaDto['partnerId'] } };
    }
    if (createVisaDto['unitId']) {
      data.unit = { connect: { id: createVisaDto['unitId'] } };
    }

    const visa = await this.prisma.visa.create({
      data,
      include: this.visaInclude,
    });

    // Emit event
    this.eventEmitter.emit('visa.created', {
      visa,
      user,
      timestamp: new Date(),
    });

    return visa;
  }

  /**
   * Get all visas with filtering and pagination
   * Supports filters: partnerId, unitId, status, search (holderName/passportNumber)
   */
  async findAll(filterDto: FilterVisaDto, user: VisaUser): Promise<VisaListResult> {
    const page = parseInt(filterDto.page || '1', 10);
    const limit = Math.min(parseInt(filterDto.limit || '10', 10), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.VisaWhereInput = {};

    // Permission-based filtering
    if (!user.actions.includes('VISA_READ_ALL')) {
      where.createdById = user.id;
    }

    // Filter by partner
    if (filterDto['partnerId']) {
      where.partnerId = filterDto['partnerId'];
    }

    // Filter by unit
    if (filterDto['unitId']) {
      where.unitId = filterDto['unitId'];
    }

    // Search by holder name or passport number
    if (filterDto.search) {
      where.OR = [
        { holderName: { contains: filterDto.search, mode: 'insensitive' } },
        { passportNumber: { contains: filterDto.search, mode: 'insensitive' } },
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

    // Filter visas expiring soon
    if (filterDto.expiringWithinDays) {
      const days = parseInt(filterDto.expiringWithinDays, 10);
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      where.expirationDate = {
        gte: today,
        lte: futureDate,
      };
      where.status = VisaStatus.ACTIVE;
    }

    // Filter by creator
    if (filterDto.createdBy) {
      where.createdById = filterDto.createdBy;
    }

    // Filter by approver
    if (filterDto.approvedBy) {
      where.approvedById = filterDto.approvedBy;
    }

    // Sorting
    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder || 'desc';

    // Execute query
    const [visas, total] = await Promise.all([
      this.prisma.visa.findMany({
        where,
        include: this.visaInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
  }

  /**
   * Find visa by ID with all relations
   */
  async findOne(id: string, user: VisaUser): Promise<VisaWithRelations> {
    const visa = await this.prisma.visa.findUnique({
      where: { id },
      include: this.visaInclude,
    });

    if (!visa) {
      throw new NotFoundException(`Visa with ID ${id} not found`);
    }

    // Check permission
    if (!user.actions.includes('VISA_READ_ALL')) {
      if (visa.createdById !== user.id) {
        throw new ForbiddenException('You do not have permission to view this visa');
      }
    }

    return visa;
  }

  /**
   * Update visa information with support for all new fields
   */
  async update(id: string, updateVisaDto: UpdateVisaDto, user: VisaUser): Promise<VisaWithRelations> {
    if (!user.actions.includes('VISA_UPDATE')) {
      throw new ForbiddenException('You do not have permission to update visas');
    }

    const existingVisa = await this.findOne(id, user);

    // Only creator or admin can update
    if (!user.actions.includes('VISA_UPDATE_ALL') && existingVisa.createdById !== user.id) {
      throw new ForbiddenException('You can only update your own visa applications');
    }

    // Check visa number uniqueness if changing
    if (updateVisaDto.visaNumber && updateVisaDto.visaNumber !== existingVisa.visaNumber) {
      const duplicate = await this.prisma.visa.findUnique({
        where: { visaNumber: updateVisaDto.visaNumber },
      });
      if (duplicate) {
        throw new ConflictException(`Visa number ${updateVisaDto.visaNumber} already exists`);
      }
    }

    // Validate partner if provided
    if (updateVisaDto['partnerId'] !== undefined) {
      if (updateVisaDto['partnerId']) {
        const partner = await this.prisma.partner.findUnique({
          where: { id: updateVisaDto['partnerId'] },
        });
        if (!partner) {
          throw new BadRequestException(`Partner with ID ${updateVisaDto['partnerId']} not found`);
        }
      }
    }

    // Validate unit if provided
    if (updateVisaDto['unitId'] !== undefined) {
      if (updateVisaDto['unitId']) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: updateVisaDto['unitId'] },
        });
        if (!unit) {
          throw new BadRequestException(`Unit with ID ${updateVisaDto['unitId']} not found`);
        }
      }
    }

    // Prepare update data
    const data: Prisma.VisaUpdateInput = {};

    // Update basic fields
    if (updateVisaDto.holderName !== undefined) data.holderName = updateVisaDto.holderName;
    if (updateVisaDto.holderCountry !== undefined) data.holderCountry = updateVisaDto.holderCountry;
    if (updateVisaDto.passportNumber !== undefined) data.passportNumber = updateVisaDto.passportNumber;
    if (updateVisaDto.visaNumber !== undefined) data.visaNumber = updateVisaDto.visaNumber;
    if (updateVisaDto.purpose !== undefined) data.purpose = updateVisaDto.purpose;
    if (updateVisaDto.sponsorUnit !== undefined) data.sponsorUnit = updateVisaDto.sponsorUnit;
    if (updateVisaDto.status !== undefined) data.status = updateVisaDto.status;
    if (updateVisaDto.attachments !== undefined) data.attachments = updateVisaDto.attachments;

    // Update date fields
    if (updateVisaDto.issueDate !== undefined) {
      data.issueDate = new Date(updateVisaDto.issueDate);
    }
    if (updateVisaDto.expirationDate !== undefined) {
      data.expirationDate = new Date(updateVisaDto.expirationDate);
    }

    // Update new optional fields
    if (updateVisaDto['dateOfBirth'] !== undefined) {
      data.dateOfBirth = updateVisaDto['dateOfBirth'] ? new Date(updateVisaDto['dateOfBirth']) : null;
    }
    if (updateVisaDto['visaType'] !== undefined) {
      data.visaType = updateVisaDto['visaType'];
    }
    if (updateVisaDto['entryDate'] !== undefined) {
      data.entryDate = updateVisaDto['entryDate'] ? new Date(updateVisaDto['entryDate']) : null;
    }
    if (updateVisaDto['program'] !== undefined) {
      data.program = updateVisaDto['program'];
    }
    if (updateVisaDto['department'] !== undefined) {
      data.department = updateVisaDto['department'];
    }
    if (updateVisaDto['supervisorName'] !== undefined) {
      data.supervisorName = updateVisaDto['supervisorName'];
    }
    if (updateVisaDto['email'] !== undefined) {
      data.email = updateVisaDto['email'];
    }
    if (updateVisaDto['phone'] !== undefined) {
      data.phone = updateVisaDto['phone'];
    }
    if (updateVisaDto['extensionRequestDate'] !== undefined) {
      data.extensionRequestDate = updateVisaDto['extensionRequestDate'] ? new Date(updateVisaDto['extensionRequestDate']) : null;
    }
    if (updateVisaDto['extensionReason'] !== undefined) {
      data.extensionReason = updateVisaDto['extensionReason'];
    }
    if (updateVisaDto['na5Request'] !== undefined) {
      data.na5Request = updateVisaDto['na5Request'];
    }

    // Update relations
    if (updateVisaDto['partnerId'] !== undefined) {
      if (updateVisaDto['partnerId']) {
        data.partner = { connect: { id: updateVisaDto['partnerId'] } };
      } else {
        data.partner = { disconnect: true };
      }
    }
    if (updateVisaDto['unitId'] !== undefined) {
      if (updateVisaDto['unitId']) {
        data.unit = { connect: { id: updateVisaDto['unitId'] } };
      } else {
        data.unit = { disconnect: true };
      }
    }

    const visa = await this.prisma.visa.update({
      where: { id },
      data,
      include: this.visaInclude,
    });

    // Emit event
    this.eventEmitter.emit('visa.updated', {
      visa,
      user,
      timestamp: new Date(),
    });

    return visa;
  }

  /**
   * Delete/Cancel visa
   */
  async remove(id: string, user: VisaUser): Promise<void> {
    if (!user.actions.includes('VISA_DELETE')) {
      throw new ForbiddenException('You do not have permission to delete visas');
    }

    const visa = await this.findOne(id, user);

    // Only creator or admin can delete
    if (!user.actions.includes('VISA_DELETE_ALL') && visa.createdById !== user.id) {
      throw new ForbiddenException('You can only delete your own visa applications');
    }

    // Soft delete by setting status to CANCELLED
    await this.prisma.visa.update({
      where: { id },
      data: { status: VisaStatus.CANCELLED },
    });

    // Emit event
    this.eventEmitter.emit('visa.deleted', {
      visaId: id,
      user,
      timestamp: new Date(),
    });
  }

  /**
   * Create visa extension request
   */
  async createExtension(id: string, extendVisaDto: ExtendVisaDto, user: VisaUser): Promise<VisaExtension> {
    if (!user.actions.includes('VISA_EXTEND')) {
      throw new ForbiddenException('You do not have permission to create visa extensions');
    }

    const visa = await this.findOne(id, user);

    // Validate new expiration date
    const newExpirationDate = new Date(extendVisaDto.newExpirationDate);
    if (newExpirationDate <= visa.expirationDate) {
      throw new BadRequestException('New expiration date must be after current expiration date');
    }

    const extension = await this.prisma.visaExtension.create({
      data: {
        visaId: id,
        newExpirationDate,
        reason: extendVisaDto.reason,
        status: 'PENDING',
      },
    });

    // Update visa with extension request info
    await this.prisma.visa.update({
      where: { id },
      data: {
        extensionRequestDate: new Date(),
        extensionReason: extendVisaDto.reason,
      },
    });

    // Emit event
    this.eventEmitter.emit('visa.extension.created', {
      extension,
      visa,
      user,
      timestamp: new Date(),
    });

    return extension;
  }

  /**
   * Approve or reject visa extension
   */
  async approveExtension(extensionId: string, approveDto: ApproveVisaDto, user: VisaUser): Promise<VisaExtension> {
    if (!user.actions.includes('VISA_APPROVE')) {
      throw new ForbiddenException('You do not have permission to approve visa extensions');
    }

    const extension = await this.prisma.visaExtension.findUnique({
      where: { id: extensionId },
      include: { visa: true },
    });

    if (!extension) {
      throw new NotFoundException(`Visa extension with ID ${extensionId} not found`);
    }

    if (extension.status !== 'PENDING') {
      throw new BadRequestException('This extension has already been processed');
    }

    const isApproved = approveDto.action === ApprovalAction.APPROVE;
    const newStatus = isApproved ? 'APPROVED' : 'REJECTED';

    // Update extension
    const updatedExtension = await this.prisma.visaExtension.update({
      where: { id: extensionId },
      data: { status: newStatus },
    });

    // If approved, update visa expiration date and status
    if (isApproved) {
      await this.prisma.visa.update({
        where: { id: extension.visaId },
        data: {
          expirationDate: extension.newExpirationDate,
          status: VisaStatus.EXTENDED,
          approvedBy: { connect: { id: user.id } },
          approvedAt: new Date(),
        },
      });
    }

    // Emit event
    this.eventEmitter.emit(isApproved ? 'visa.extension.approved' : 'visa.extension.rejected', {
      extension: updatedExtension,
      visa: extension.visa,
      user,
      approveDto,
      timestamp: new Date(),
    });

    return updatedExtension;
  }

  /**
   * Get visa extensions by visa ID
   */
  async getExtensions(visaId: string, user: VisaUser): Promise<VisaExtension[]> {
    await this.findOne(visaId, user); // Check permission

    return this.prisma.visaExtension.findMany({
      where: { visaId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get visa statistics
   */
  async getStats(user: VisaUser): Promise<VisaStats> {
    const where: Prisma.VisaWhereInput = {};

    // Permission-based filtering
    if (!user.actions.includes('VISA_READ_ALL')) {
      where.createdById = user.id;
    }

    // Total visas
    const totalVisas = await this.prisma.visa.count({ where });

    // By status
    const byStatusData = await this.prisma.visa.groupBy({
      by: ['status'],
      where,
      _count: true,
    });
    const byStatus = byStatusData.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Expiring visas (within 30 days)
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);

    const expiringVisas = await this.prisma.visa.count({
      where: {
        ...where,
        status: VisaStatus.ACTIVE,
        expirationDate: {
          gte: today,
          lte: futureDate,
        },
      },
    });

    // My visas
    const myVisas = await this.prisma.visa.count({
      where: { createdById: user.id },
    });

    // Recent extensions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const recentExtensions = await this.prisma.visaExtension.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: 'APPROVED',
      },
    });

    return {
      totalVisas,
      byStatus,
      expiringVisas,
      myVisas,
      recentExtensions,
    };
  }

  /**
   * Get visas expiring within specified days
   * Used for automatic reminders
   */
  async getExpiringVisas(daysBeforeExpiration: number = 30): Promise<VisaWithRelations[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysBeforeExpiration);

    return this.prisma.visa.findMany({
      where: {
        status: VisaStatus.ACTIVE,
        expirationDate: {
          gte: today,
          lte: futureDate,
        },
        reminderSent: false,
      },
      include: this.visaInclude,
    });
  }

  /**
   * Check expiring visas and send reminders
   * Called by cron job
   */
  async checkExpiringVisas(daysBeforeExpiration: number = 30): Promise<VisaWithRelations[]> {
    const expiringVisas = await this.getExpiringVisas(daysBeforeExpiration);

    for (const visa of expiringVisas) {
      // Emit event for notification service
      this.eventEmitter.emit('visa.expiring', {
        visa,
        daysUntilExpiration: Math.ceil(
          (visa.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        ),
        timestamp: new Date(),
      });

      // Mark reminder as sent
      await this.prisma.visa.update({
        where: { id: visa.id },
        data: {
          reminderSent: true,
          reminderSentDate: new Date(),
        },
      });
    }

    return expiringVisas;
  }

  /**
   * Get visa statistics for reporting
   * Used by scheduler for monthly reports
   */
  async getStatistics() {
    const [total, byStatus, expiringSoon, recentExtensions] = await Promise.all([
      this.prisma.visa.count(),
      this.prisma.visa.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.visa.count({
        where: {
          status: VisaStatus.ACTIVE,
          expirationDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.visaExtension.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      expiringSoon,
      recentExtensions,
    };
  }

  /**
   * Reset reminders (for testing)
   */
  async resetReminders(): Promise<number> {
    const result = await this.prisma.visa.updateMany({
      where: { reminderSent: true },
      data: {
        reminderSent: false,
        reminderSentDate: null,
      },
    });

    return result.count;
  }
}
