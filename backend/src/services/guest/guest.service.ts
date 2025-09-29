import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { CreateGuestDto, UpdateGuestDto, FilterGuestDto, ApproveGuestDto, RejectGuestDto } from './dto';
import { Guest, GuestMember, GuestStatus, Prisma } from '@prisma/client';

export interface GuestUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface GuestWithRelations extends Guest {
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
  members: GuestMember[];
}

export interface GuestListResult {
  guests: GuestWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
 * 
 */
@Injectable()
export class GuestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Tạo guest registration mới
   */
  async create(createGuestDto: CreateGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:create')) {
      throw new ForbiddenException('Không có quyền tạo guest registration');
    }

    // Validate dates
    const arrivalDate = new Date(createGuestDto.arrivalDate);
    const departureDate = new Date(createGuestDto.departureDate);
    
    if (arrivalDate >= departureDate) {
      throw new BadRequestException('Ngày đến phải trước ngày về');
    }

    if (arrivalDate < new Date()) {
      throw new BadRequestException('Ngày đến không thể trong quá khứ');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Tạo guest record
        const guest = await tx.guest.create({
          data: {
            groupName: createGuestDto.groupName,
            purpose: createGuestDto.purpose,
            arrivalDate,
            departureDate,
            contactPerson: createGuestDto.contactPerson,
            contactEmail: createGuestDto.contactEmail,
            contactPhone: createGuestDto.contactPhone,
            totalMembers: createGuestDto.totalMembers || 1,
            notes: createGuestDto.notes,
            attachments: createGuestDto.attachments,
            createdById: user.id,
            status: GuestStatus.REGISTERED,
          },
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true },
            },
            approvedBy: {
              select: { id: true, fullName: true, email: true },
            },
            members: true,
          },
        });

        // Tạo guest members nếu có
        if (createGuestDto.members && createGuestDto.members.length > 0) {
          await tx.guestMember.createMany({
            data: createGuestDto.members.map(member => ({
              ...member,
              guestId: guest.id,
              dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
            })),
          });

          // Lấy lại guest với members
          return await tx.guest.findUnique({
            where: { id: guest.id },
            include: {
              createdBy: {
                select: { id: true, fullName: true, email: true },
              },
              approvedBy: {
                select: { id: true, fullName: true, email: true },
              },
              members: true,
            },
          });
        }

        return guest;
      });

      // Emit event
      this.eventEmitter.emit('guest.created', {
        guest: result,
        user,
      });

      return result as GuestWithRelations;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Guest registration đã tồn tại');
        }
      }
      throw error;
    }
  }

  /**
   * Lấy danh sách guest với filtering và pagination
   */
  async findAll(filterDto: FilterGuestDto, user: GuestUser): Promise<GuestListResult> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:view')) {
      throw new ForbiddenException('Không có quyền xem guest');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.GuestWhereInput = {};

    if (filters.search) {
      where.OR = [
        { groupName: { contains: filters.search, mode: 'insensitive' } },
        { contactPerson: { contains: filters.search, mode: 'insensitive' } },
        { contactEmail: { contains: filters.search, mode: 'insensitive' } },
        { purpose: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.nationality) {
      where.members = {
        some: {
          nationality: { contains: filters.nationality, mode: 'insensitive' }
        }
      };
    }

    if (filters.arrivalDateFrom || filters.arrivalDateTo) {
      where.arrivalDate = {};
      if (filters.arrivalDateFrom) {
        where.arrivalDate.gte = new Date(filters.arrivalDateFrom);
      }
      if (filters.arrivalDateTo) {
        where.arrivalDate.lte = new Date(filters.arrivalDateTo);
      }
    }

    if (filters.departureDateFrom || filters.departureDateTo) {
      where.departureDate = {};
      if (filters.departureDateFrom) {
        where.departureDate.gte = new Date(filters.departureDateFrom);
      }
      if (filters.departureDateTo) {
        where.departureDate.lte = new Date(filters.departureDateTo);
      }
    }

    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.approvedById) {
      where.approvedById = filters.approvedById;
    }

    // Build orderBy
    const orderBy: Prisma.GuestOrderByWithRelationInput = {};
    if (sortBy === 'createdAt' || sortBy === 'arrivalDate' || sortBy === 'departureDate' || sortBy === 'updatedAt') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      const [guests, total] = await Promise.all([
        this.prisma.guest.findMany({
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
            members: true,
          },
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
      throw new BadRequestException('Lỗi khi lấy danh sách guest');
    }
  }

  /**
   * Lấy chi tiết guest theo ID
   */
  async findOne(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:view')) {
      throw new ForbiddenException('Không có quyền xem guest');
    }

    try {
      const guest = await this.prisma.guest.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: {
            orderBy: { createdAt: 'asc' }
          },
        },
      });

      if (!guest) {
        throw new NotFoundException('Không tìm thấy guest');
      }

      return guest as GuestWithRelations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi lấy thông tin guest');
    }
  }

  /**
   * Cập nhật thông tin guest
   */
  async update(id: string, updateGuestDto: UpdateGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:update')) {
      throw new ForbiddenException('Không có quyền cập nhật guest');
    }

    // Tìm guest hiện tại
    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingGuest) {
      throw new NotFoundException('Không tìm thấy guest');
    }

    // Không cho phép update khi đã DEPARTED hoặc CANCELLED
    if (existingGuest.status === GuestStatus.DEPARTED || existingGuest.status === GuestStatus.CANCELLED) {
      throw new BadRequestException('Không thể cập nhật guest đã hoàn thành hoặc bị hủy');
    }

    // Validate dates nếu có update
    if (updateGuestDto.arrivalDate || updateGuestDto.departureDate) {
      const arrivalDate = updateGuestDto.arrivalDate ? new Date(updateGuestDto.arrivalDate) : existingGuest.arrivalDate;
      const departureDate = updateGuestDto.departureDate ? new Date(updateGuestDto.departureDate) : existingGuest.departureDate;
      
      if (arrivalDate >= departureDate) {
        throw new BadRequestException('Ngày đến phải trước ngày về');
      }
    }

    try {
      const updateData: any = {
        ...updateGuestDto,
        updatedAt: new Date(),
      };

      // Chỉ admin/manager mới được thay đổi status trực tiếp
      if (updateGuestDto.status && !user.actions.includes('guest:approve')) {
        delete updateData.status;
      }

      if (updateGuestDto.arrivalDate) {
        updateData.arrivalDate = new Date(updateGuestDto.arrivalDate);
      }
      if (updateGuestDto.departureDate) {
        updateData.departureDate = new Date(updateGuestDto.departureDate);
      }

      const guest = await this.prisma.guest.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: true,
        },
      });

      // Emit event
      this.eventEmitter.emit('guest.updated', {
        guest,
        user,
        changes: updateGuestDto,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi cập nhật guest');
    }
  }

  /**
   * Hủy guest registration
   */
  async cancel(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:delete')) {
      throw new ForbiddenException('Không có quyền hủy guest registration');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException('Không tìm thấy guest');
    }

    if (existingGuest.status === GuestStatus.DEPARTED) {
      throw new BadRequestException('Không thể hủy guest đã hoàn thành chuyến thăm');
    }

    if (existingGuest.status === GuestStatus.CANCELLED) {
      throw new BadRequestException('Guest đã được hủy trước đó');
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.CANCELLED,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: true,
        },
      });

      // Emit event
      this.eventEmitter.emit('guest.cancelled', {
        guest,
        user,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi hủy guest');
    }
  }

  /**
   * Approve guest registration (REGISTERED → APPROVED)
   */
  async approve(id: string, approveDto: ApproveGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:approve')) {
      throw new ForbiddenException('Không có quyền duyệt guest');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException('Không tìm thấy guest');
    }

    if (existingGuest.status !== GuestStatus.REGISTERED) {
      throw new BadRequestException('Chỉ có thể duyệt guest ở trạng thái REGISTERED');
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.APPROVED,
          approvedById: user.id,
          approvedAt: new Date(),
          notes: approveDto.notes || existingGuest.notes,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: true,
        },
      });

      // Emit event
      this.eventEmitter.emit('guest.approved', {
        guest,
        user,
        notes: approveDto.notes,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi duyệt guest');
    }
  }

  /**
   * Reject guest registration (REGISTERED/APPROVED → CANCELLED)
   */
  async reject(id: string, rejectDto: RejectGuestDto, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:reject')) {
      throw new ForbiddenException('Không có quyền từ chối guest');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException('Không tìm thấy guest');
    }

    if (existingGuest.status !== GuestStatus.REGISTERED && existingGuest.status !== GuestStatus.APPROVED) {
      throw new BadRequestException('Chỉ có thể từ chối guest ở trạng thái REGISTERED hoặc APPROVED');
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.CANCELLED,
          notes: `${existingGuest.notes || ''}\n\nLý do từ chối: ${rejectDto.reason}${rejectDto.notes ? `\nGhi chú: ${rejectDto.notes}` : ''}`,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: true,
        },
      });

      // Emit event
      this.eventEmitter.emit('guest.rejected', {
        guest,
        user,
        reason: rejectDto.reason,
        notes: rejectDto.notes,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi từ chối guest');
    }
  }

  /**
   * Check-in guest (APPROVED → ARRIVED)
   */
  async checkin(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:checkin')) {
      throw new ForbiddenException('Không có quyền check-in guest');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException('Không tìm thấy guest');
    }

    if (existingGuest.status !== GuestStatus.APPROVED) {
      throw new BadRequestException('Chỉ có thể check-in guest đã được duyệt (APPROVED)');
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.ARRIVED,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: true,
        },
      });

      // Emit event
      this.eventEmitter.emit('guest.checked_in', {
        guest,
        user,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi check-in guest');
    }
  }

  /**
   * Check-out guest (ARRIVED → DEPARTED)
   */
  async checkout(id: string, user: GuestUser): Promise<GuestWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:checkout')) {
      throw new ForbiddenException('Không có quyền check-out guest');
    }

    const existingGuest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!existingGuest) {
      throw new NotFoundException('Không tìm thấy guest');
    }

    if (existingGuest.status !== GuestStatus.ARRIVED) {
      throw new BadRequestException('Chỉ có thể check-out guest đã check-in (ARRIVED)');
    }

    try {
      const guest = await this.prisma.guest.update({
        where: { id },
        data: {
          status: GuestStatus.DEPARTED,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
          members: true,
        },
      });

      // Emit event
      this.eventEmitter.emit('guest.checked_out', {
        guest,
        user,
      });

      return guest as GuestWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi check-out guest');
    }
  }

  /**
   * Lấy thống kê guest
   */
  async getStats(user: GuestUser) {
    // Kiểm tra quyền
    if (!user.actions.includes('guest:view')) {
      throw new ForbiddenException('Không có quyền xem thống kê guest');
    }

    try {
      const [
        totalGuests,
        registeredGuests,
        approvedGuests,
        arrivedGuests,
        departedGuests,
        cancelledGuests,
        currentlyStaying,
        upcomingArrivals,
      ] = await Promise.all([
        this.prisma.guest.count(),
        this.prisma.guest.count({ where: { status: GuestStatus.REGISTERED } }),
        this.prisma.guest.count({ where: { status: GuestStatus.APPROVED } }),
        this.prisma.guest.count({ where: { status: GuestStatus.ARRIVED } }),
        this.prisma.guest.count({ where: { status: GuestStatus.DEPARTED } }),
        this.prisma.guest.count({ where: { status: GuestStatus.CANCELLED } }),
        this.prisma.guest.count({ 
          where: { 
            status: GuestStatus.ARRIVED,
            departureDate: { gt: new Date() }
          } 
        }),
        this.prisma.guest.count({ 
          where: { 
            status: GuestStatus.APPROVED,
            arrivalDate: { 
              gte: new Date(),
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            }
          } 
        }),
      ]);

      return {
        totalGuests,
        registeredGuests,
        approvedGuests,
        arrivedGuests,
        departedGuests,
        cancelledGuests,
        currentlyStaying,
        upcomingArrivals,
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi lấy thống kê guest');
    }
  }
}