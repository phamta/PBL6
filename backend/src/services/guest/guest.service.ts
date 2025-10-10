import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Guest, GuestStatus, GuestMember, Prisma } from '@prisma/client';
import { 
  CreateGuestDto, 
  UpdateGuestDto, 
  FilterGuestDto,
  ApproveGuestDto,
  RejectGuestDto 
} from './dto';

export interface GuestUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface GuestWithRelations extends Guest {
  partner?: {
    id: string;
    name: string;
    country: string;
    contactEmail: string | null;
  } | null;
  unit?: {
    id: string;
    name: string;
    code: string;
  } | null;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
    unitId: string | null;
  };
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  members: GuestMember[];
}

export interface GuestListResult {
  guests: GuestWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GuestStats {
  totalGuests: number;
  byStatus: { status: GuestStatus; count: number }[];
  upcomingArrivals: number;
  currentlyPresent: number;
  myGuests: number;
}

/**
 * Guest Service - Quản lý khách quốc tế và thành viên đoàn
 * 
 * Action permissions:
 * - guest:create: Tạo guest registration mới
 * - guest:view: Xem guest information  
 * - guest:update: Cập nhật guest information  
 * - guest:delete: Xóa/hủy guest registration
 * - guest:approve: Approve guest registration
 * - guest:reject: Reject guest registration
 * - guest:checkin: Check-in khi guest đến
 * - guest:checkout: Check-out khi guest rời đi
 */
@Injectable()
export class GuestService {
  private readonly guestInclude: Prisma.GuestInclude = {
    partner: {
      select: {
        id: true,
        name: true,
        country: true,
        contactEmail: true,
      },
    },
    unit: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        fullName: true,
        email: true,
        unitId: true,
      },
    },
    approvedBy: {
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    },
    members: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new guest registration with all new fields
   */
  async create(createGuestDto: CreateGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:create')) {
      throw new ForbiddenException('You do not have permission to create guests');
    }

    // Validate dates
    const arrivalDate = new Date(createGuestDto.arrivalDate);
    const departureDate = new Date(createGuestDto.departureDate);
    
    if (arrivalDate >= departureDate) {
      throw new BadRequestException('Arrival date must be before departure date');
    }

    if (arrivalDate < new Date()) {
      throw new BadRequestException('Arrival date cannot be in the past');
    }

    // Validate partner if provided
    if (createGuestDto['partnerId']) {
      const partner = await this.prisma.partner.findUnique({
        where: { id: createGuestDto['partnerId'] },
      });
      if (!partner) {
        throw new BadRequestException(`Partner with ID ${createGuestDto['partnerId']} not found`);
      }
    }

    // Validate unit if provided
    if (createGuestDto['unitId']) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: createGuestDto['unitId'] },
      });
      if (!unit) {
        throw new BadRequestException(`Unit with ID ${createGuestDto['unitId']} not found`);
      }
    }

    try {
      // Prepare data with all new fields
      const data: Prisma.GuestCreateInput = {
        groupName: createGuestDto.groupName,
        purpose: createGuestDto.purpose,
        arrivalDate: new Date(createGuestDto.arrivalDate),
        departureDate: new Date(createGuestDto.departureDate),
        contactPerson: createGuestDto.contactPerson,
        contactEmail: createGuestDto.contactEmail,
        contactPhone: createGuestDto.contactPhone,
        totalMembers: createGuestDto.totalMembers || 1,
        status: GuestStatus.REGISTERED,
        notes: createGuestDto.notes,
        attachments: createGuestDto.attachments || undefined,
        visitPurpose: createGuestDto['visitPurpose'],
        hostDepartment: createGuestDto['hostDepartment'],
        invitationLetterNo: createGuestDto['invitationLetterNo'],
        immigrationDocNA2: createGuestDto['immigrationDocNA2'],
        visaRequestDocNA5: createGuestDto['visaRequestDocNA5'],
        reportFile: createGuestDto['reportFile'],
        createdBy: {
          connect: { id: user.id },
        },
      };

      // Connect partner if provided
      if (createGuestDto['partnerId']) {
        data.partner = {
          connect: { id: createGuestDto['partnerId'] },
        };
      }

      // Connect unit if provided
      if (createGuestDto['unitId']) {
        data.unit = {
          connect: { id: createGuestDto['unitId'] },
        };
      }

      // Create guest members if provided
      if (createGuestDto.members && createGuestDto.members.length > 0) {
        data.members = {
          create: createGuestDto.members.map(member => ({
            fullName: member.fullName,
            nationality: member.nationality,
            passportNumber: member.passportNumber,
            position: member.position,
            organization: member.organization,
            email: member.email,
            phoneNumber: member.phoneNumber,
            dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
            title: member['title'],
            gender: member['gender'],
            affiliation: member['affiliation'],
          })),
        };
      }

      const guest = await this.prisma.guest.create({
        data,
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.created', {
        guestId: guest.id,
        userId: user.id,
        arrivalDate: guest.arrivalDate,
        totalMembers: guest.totalMembers,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create guest: ${error.message}`);
    }
  }

  /**
   * Find all guests with filtering and pagination
   */
  async findAll(filterDto: FilterGuestDto, user: GuestUser): Promise<GuestListResult> {
    // Check permission
    if (!user.actions.includes('guest:view')) {
      throw new ForbiddenException('You do not have permission to view guests');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.GuestWhereInput = {};

    // Keyword search (groupName, contactPerson, contactEmail)
    if (filters.search) {
      where.OR = [
        { groupName: { contains: filters.search, mode: 'insensitive' } },
        { contactPerson: { contains: filters.search, mode: 'insensitive' } },
        { contactEmail: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status;
    }

    // Nationality filter (search in members)
    if (filters.nationality) {
      where.members = {
        some: {
          nationality: { contains: filters.nationality, mode: 'insensitive' },
        },
      };
    }

    // Partner filter
    if (filters['partnerId']) {
      where.partnerId = filters['partnerId'];
    }

    // Unit filter
    if (filters['unitId']) {
      where.unitId = filters['unitId'];
    }

    // Arrival date range
    if (filters.arrivalDateFrom || filters.arrivalDateTo) {
      where.arrivalDate = {};
      if (filters.arrivalDateFrom) {
        where.arrivalDate.gte = new Date(filters.arrivalDateFrom);
      }
      if (filters.arrivalDateTo) {
        where.arrivalDate.lte = new Date(filters.arrivalDateTo);
      }
    }

    // Departure date range
    if (filters.departureDateFrom || filters.departureDateTo) {
      where.departureDate = {};
      if (filters.departureDateFrom) {
        where.departureDate.gte = new Date(filters.departureDateFrom);
      }
      if (filters.departureDateTo) {
        where.departureDate.lte = new Date(filters.departureDateTo);
      }
    }

    // Created by filter
    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    // Approved by filter
    if (filters.approvedById) {
      where.approvedById = filters.approvedById;
    }

    // Build orderBy
    const orderBy: Prisma.GuestOrderByWithRelationInput = {};
    if (sortBy === 'arrivalDate' || sortBy === 'departureDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    try {
      const [guests, total] = await Promise.all([
        this.prisma.guest.findMany({
          where,
          include: this.guestInclude,
          skip,
          take: limit,
          orderBy,
        }),
        this.prisma.guest.count({ where }),
      ]);

      return {
        guests: guests as GuestWithRelations[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch guests: ${error.message}`);
    }
  }

  /**
   * Find one guest by ID
   */
  async findOne(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:view')) {
      throw new ForbiddenException('You do not have permission to view guests');
    }

    try {
      const guest = await this.prisma.guest.findUnique({
        where: { id },
        include: this.guestInclude,
      });

      if (!guest) {
        throw new NotFoundException(`Guest with ID ${id} not found`);
      }

      return guest as GuestWithRelations;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch guest: ${error.message}`);
    }
  }

  /**
   * Update guest information with all new fields
   */
  async update(id: string, updateGuestDto: UpdateGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:update')) {
      throw new ForbiddenException('You do not have permission to update guests');
    }

    // Find existing guest
    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    // Cannot update if DEPARTED or CANCELLED
    if (existingGuest.status === GuestStatus.DEPARTED || existingGuest.status === GuestStatus.CANCELLED) {
      throw new BadRequestException(`Cannot update guest with status ${existingGuest.status}`);
    }

    // Validate dates if provided
    if (updateGuestDto.arrivalDate || updateGuestDto.departureDate) {
      const arrivalDate = updateGuestDto.arrivalDate ? new Date(updateGuestDto.arrivalDate) : existingGuest.arrivalDate;
      const departureDate = updateGuestDto.departureDate ? new Date(updateGuestDto.departureDate) : existingGuest.departureDate;
      
      if (arrivalDate >= departureDate) {
        throw new BadRequestException('Arrival date must be before departure date');
      }
    }

    // Validate partner if provided
    if (updateGuestDto['partnerId'] !== undefined) {
      if (updateGuestDto['partnerId'] !== null) {
        const partner = await this.prisma.partner.findUnique({
          where: { id: updateGuestDto['partnerId'] },
        });
        if (!partner) {
          throw new BadRequestException(`Partner with ID ${updateGuestDto['partnerId']} not found`);
        }
      }
    }

    // Validate unit if provided
    if (updateGuestDto['unitId'] !== undefined) {
      if (updateGuestDto['unitId'] !== null) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: updateGuestDto['unitId'] },
        });
        if (!unit) {
          throw new BadRequestException(`Unit with ID ${updateGuestDto['unitId']} not found`);
        }
      }
    }

    try {
      // Prepare update data
      const data: Prisma.GuestUpdateInput = {};

      if (updateGuestDto.groupName !== undefined) data.groupName = updateGuestDto.groupName;
      if (updateGuestDto.purpose !== undefined) data.purpose = updateGuestDto.purpose;
      if (updateGuestDto.arrivalDate !== undefined) data.arrivalDate = new Date(updateGuestDto.arrivalDate);
      if (updateGuestDto.departureDate !== undefined) data.departureDate = new Date(updateGuestDto.departureDate);
      if (updateGuestDto.contactPerson !== undefined) data.contactPerson = updateGuestDto.contactPerson;
      if (updateGuestDto.contactEmail !== undefined) data.contactEmail = updateGuestDto.contactEmail;
      if (updateGuestDto.contactPhone !== undefined) data.contactPhone = updateGuestDto.contactPhone;
      if (updateGuestDto.totalMembers !== undefined) data.totalMembers = updateGuestDto.totalMembers;
      if (updateGuestDto.notes !== undefined) data.notes = updateGuestDto.notes;
      if (updateGuestDto.attachments !== undefined) data.attachments = updateGuestDto.attachments;
      
      // New fields
      if (updateGuestDto['visitPurpose'] !== undefined) data.visitPurpose = updateGuestDto['visitPurpose'];
      if (updateGuestDto['hostDepartment'] !== undefined) data.hostDepartment = updateGuestDto['hostDepartment'];
      if (updateGuestDto['invitationLetterNo'] !== undefined) data.invitationLetterNo = updateGuestDto['invitationLetterNo'];
      if (updateGuestDto['immigrationDocNA2'] !== undefined) data.immigrationDocNA2 = updateGuestDto['immigrationDocNA2'];
      if (updateGuestDto['visaRequestDocNA5'] !== undefined) data.visaRequestDocNA5 = updateGuestDto['visaRequestDocNA5'];
      if (updateGuestDto['reportFile'] !== undefined) data.reportFile = updateGuestDto['reportFile'];

      // Handle partner relation
      if (updateGuestDto['partnerId'] !== undefined) {
        if (updateGuestDto['partnerId'] === null) {
          data.partner = { disconnect: true };
        } else {
          data.partner = { connect: { id: updateGuestDto['partnerId'] } };
        }
      }

      // Handle unit relation
      if (updateGuestDto['unitId'] !== undefined) {
        if (updateGuestDto['unitId'] === null) {
          data.unit = { disconnect: true };
        } else {
          data.unit = { connect: { id: updateGuestDto['unitId'] } };
        }
      }

      // Handle members update if provided
      if (updateGuestDto.members !== undefined) {
        // Delete existing members and create new ones
        await this.prisma.guestMember.deleteMany({
          where: { guestId: id },
        });

        if (updateGuestDto.members.length > 0) {
          data.members = {
            create: updateGuestDto.members.map(member => ({
              fullName: member.fullName,
              nationality: member.nationality,
              passportNumber: member.passportNumber,
              position: member.position,
              organization: member.organization,
              email: member.email,
              phoneNumber: member.phoneNumber,
              dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
              title: member['title'],
              gender: member['gender'],
              affiliation: member['affiliation'],
            })),
          };
        }
      }

      const guest = await this.prisma.guest.update({
        where: { id },
        data,
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.updated', {
        guestId: guest.id,
        userId: user.id,
        changes: Object.keys(data),
      });

      return guest as GuestWithRelations;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update guest: ${error.message}`);
    }
  }

  /**
   * Soft delete (cancel) a guest registration
   */
  async cancel(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:delete')) {
      throw new ForbiddenException('You do not have permission to delete guests');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    if (existingGuest.status === GuestStatus.DEPARTED) {
      throw new BadRequestException('Cannot cancel a guest that has already departed');
    }

    if (existingGuest.status === GuestStatus.CANCELLED) {
      throw new BadRequestException('Guest is already cancelled');
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: { status: GuestStatus.CANCELLED },
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.cancelled', {
        guestId: guest.id,
        userId: user.id,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to cancel guest: ${error.message}`);
    }
  }

  /**
   * Approve guest registration (REGISTERED  APPROVED)
   */
  async approve(id: string, approveDto: ApproveGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:approve')) {
      throw new ForbiddenException('You do not have permission to approve guests');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    if (existingGuest.status !== GuestStatus.REGISTERED) {
      throw new BadRequestException(`Can only approve guests with status REGISTERED. Current status: ${existingGuest.status}`);
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.APPROVED,
          approvedBy: { connect: { id: user.id } },
          approvedAt: new Date(),
          notes: approveDto.notes || existingGuest.notes,
        },
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.approved', {
        guestId: guest.id,
        approverId: user.id,
        arrivalDate: guest.arrivalDate,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to approve guest: ${error.message}`);
    }
  }

  /**
   * Reject guest registration
   */
  async reject(id: string, rejectDto: RejectGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:reject')) {
      throw new ForbiddenException('You do not have permission to reject guests');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    if (existingGuest.status !== GuestStatus.REGISTERED && existingGuest.status !== GuestStatus.APPROVED) {
      throw new BadRequestException(`Can only reject guests with status REGISTERED or APPROVED. Current status: ${existingGuest.status}`);
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.CANCELLED,
          approvedBy: { connect: { id: user.id } },
          approvedAt: new Date(),
          notes: `REJECTED: ${rejectDto.reason}${rejectDto.notes ? ' - ' + rejectDto.notes : ''}`,
        },
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.rejected', {
        guestId: guest.id,
        userId: user.id,
        reason: rejectDto.reason,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to reject guest: ${error.message}`);
    }
  }

  /**
   * Check-in guest (APPROVED  ARRIVED)
   */
  async checkin(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:checkin')) {
      throw new ForbiddenException('You do not have permission to check-in guests');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    if (existingGuest.status !== GuestStatus.APPROVED) {
      throw new BadRequestException(`Can only check-in guests with status APPROVED. Current status: ${existingGuest.status}`);
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: { status: GuestStatus.ARRIVED },
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.checkedin', {
        guestId: guest.id,
        userId: user.id,
        arrivalDate: guest.arrivalDate,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to check-in guest: ${error.message}`);
    }
  }

  /**
   * Check-out guest (ARRIVED  DEPARTED)
   */
  async checkout(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Check permission
    if (!user.actions.includes('guest:checkout')) {
      throw new ForbiddenException('You do not have permission to check-out guests');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    if (existingGuest.status !== GuestStatus.ARRIVED) {
      throw new BadRequestException(`Can only check-out guests with status ARRIVED. Current status: ${existingGuest.status}`);
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: { status: GuestStatus.DEPARTED },
        include: this.guestInclude,
      });

      // Emit event
      this.eventEmitter.emit('guest.checkedout', {
        guestId: guest.id,
        userId: user.id,
        departureDate: guest.departureDate,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to check-out guest: ${error.message}`);
    }
  }

  /**
   * Get guest statistics
   */
  async getStats(user: GuestUser): Promise<GuestStats> {
    if (!user.actions.includes('guest:view')) {
      throw new ForbiddenException('You do not have permission to view guest statistics');
    }

    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const [totalGuests, byStatus, upcomingArrivals, currentlyPresent, myGuests] = await Promise.all([
        this.prisma.guest.count(),
        this.prisma.guest.groupBy({
          by: ['status'],
          _count: true,
        }),
        this.prisma.guest.count({
          where: {
            status: GuestStatus.APPROVED,
            arrivalDate: {
              gte: now,
              lte: thirtyDaysFromNow,
            },
          },
        }),
        this.prisma.guest.count({
          where: { status: GuestStatus.ARRIVED },
        }),
        this.prisma.guest.count({
          where: { createdById: user.id },
        }),
      ]);

      return {
        totalGuests,
        byStatus: byStatus.map(item => ({
          status: item.status,
          count: item._count,
        })),
        upcomingArrivals,
        currentlyPresent,
        myGuests,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch guest statistics: ${error.message}`);
    }
  }

  /**
   * Helper: Get guests by date range
   */
  async getGuestsByDateRange(start: Date, end: Date): Promise<GuestWithRelations[]> {
    try {
      const guests = await this.prisma.guest.findMany({
        where: {
          OR: [
            {
              arrivalDate: {
                gte: start,
                lte: end,
              },
            },
            {
              departureDate: {
                gte: start,
                lte: end,
              },
            },
          ],
        },
        include: this.guestInclude,
        orderBy: { arrivalDate: 'asc' },
      });

      return guests as GuestWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch guests by date range: ${error.message}`);
    }
  }

  /**
   * Helper: Get guests by partner
   */
  async getGuestsByPartner(partnerId: string): Promise<GuestWithRelations[]> {
    try {
      const guests = await this.prisma.guest.findMany({
        where: { partnerId },
        include: this.guestInclude,
        orderBy: { arrivalDate: 'desc' },
      });

      return guests as GuestWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch guests by partner: ${error.message}`);
    }
  }

  /**
   * Helper: Get guests by unit
   */
  async getGuestsByUnit(unitId: string): Promise<GuestWithRelations[]> {
    try {
      const guests = await this.prisma.guest.findMany({
        where: { unitId },
        include: this.guestInclude,
        orderBy: { arrivalDate: 'desc' },
      });

      return guests as GuestWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch guests by unit: ${error.message}`);
    }
  }
}
