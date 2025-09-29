import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { CreateTranslationDto, UpdateTranslationDto, FilterTranslationDto, ApproveTranslationDto, RejectTranslationDto, CompleteTranslationDto } from './dto';
import { Translation, TranslationStatus, Prisma } from '@prisma/client';

export interface TranslationUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface TranslationWithRelations extends Translation {
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
}

export interface TranslationListResult {
  translations: TranslationWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Translation Service - Quản lý yêu cầu dịch thuật và công chứng
 * 
 * Action permissions:
 * - translation:create: Tạo translation request mới
 * - translation:view: Xem translation information  
 * - translation:update: Cập nhật translation information  
 * - translation:delete: Xóa/hủy translation request
 * - translation:approve: Approve translation request
 * - translation:reject: Reject translation request
 * - translation:complete: Complete translation với file dịch
 * 
 */
@Injectable()
export class TranslationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Tạo translation request mới
   */
  async create(createTranslationDto: CreateTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:create')) {
      throw new ForbiddenException('Không có quyền tạo translation request');
    }

    try {
      const translation = await this.prisma.translation.create({
        data: {
          applicantName: createTranslationDto.applicantName,
          applicantEmail: createTranslationDto.applicantEmail,
          applicantPhone: createTranslationDto.applicantPhone,
          documentTitle: createTranslationDto.documentTitle,
          sourceLanguage: createTranslationDto.sourceLanguage,
          targetLanguage: createTranslationDto.targetLanguage,
          documentType: createTranslationDto.documentType,
          purpose: createTranslationDto.purpose,
          urgentLevel: createTranslationDto.urgentLevel || 'NORMAL',
          originalFile: createTranslationDto.originalFile,
          attachments: createTranslationDto.attachments,
          notes: createTranslationDto.notes,
          createdById: user.id,
          status: TranslationStatus.PENDING,
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Emit event
      this.eventEmitter.emit('translation.created', {
        translation,
        user,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Translation request đã tồn tại');
        }
      }
      throw error;
    }
  }

  /**
   * Lấy danh sách translation với filtering và pagination
   */
  async findAll(filterDto: FilterTranslationDto, user: TranslationUser): Promise<TranslationListResult> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:view')) {
      throw new ForbiddenException('Không có quyền xem translation');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TranslationWhereInput = {};

    if (filters.search) {
      where.OR = [
        { applicantName: { contains: filters.search, mode: 'insensitive' } },
        { applicantEmail: { contains: filters.search, mode: 'insensitive' } },
        { documentTitle: { contains: filters.search, mode: 'insensitive' } },
        { documentType: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.sourceLanguage) {
      where.sourceLanguage = { contains: filters.sourceLanguage, mode: 'insensitive' };
    }

    if (filters.targetLanguage) {
      where.targetLanguage = { contains: filters.targetLanguage, mode: 'insensitive' };
    }

    if (filters.documentType) {
      where.documentType = { contains: filters.documentType, mode: 'insensitive' };
    }

    if (filters.urgentLevel) {
      where.urgentLevel = filters.urgentLevel;
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

    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.approvedById) {
      where.approvedById = filters.approvedById;
    }

    // Build orderBy
    const orderBy: Prisma.TranslationOrderByWithRelationInput = {};
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      orderBy[sortBy] = sortOrder;
    } else if (sortBy === 'urgentLevel') {
      // Custom sorting for urgentLevel: VERY_URGENT > URGENT > NORMAL
      orderBy.urgentLevel = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      const [translations, total] = await Promise.all([
        this.prisma.translation.findMany({
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
          },
        }),
        this.prisma.translation.count({ where }),
      ]);

      return {
        translations: translations as TranslationWithRelations[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi lấy danh sách translation');
    }
  }

  /**
   * Lấy chi tiết translation theo ID
   */
  async findOne(id: string, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:view')) {
      throw new ForbiddenException('Không có quyền xem translation');
    }

    try {
      const translation = await this.prisma.translation.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      if (!translation) {
        throw new NotFoundException('Không tìm thấy translation');
      }

      return translation as TranslationWithRelations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi lấy thông tin translation');
    }
  }

  /**
   * Cập nhật thông tin translation
   */
  async update(id: string, updateTranslationDto: UpdateTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:update')) {
      throw new ForbiddenException('Không có quyền cập nhật translation');
    }

    // Tìm translation hiện tại
    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingTranslation) {
      throw new NotFoundException('Không tìm thấy translation');
    }

    // Chỉ cho phép creator update khi status = PENDING
    if (existingTranslation.status !== TranslationStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể cập nhật translation ở trạng thái PENDING');
    }

    if (existingTranslation.createdById !== user.id && !user.actions.includes('translation:approve')) {
      throw new ForbiddenException('Chỉ có thể cập nhật translation do chính mình tạo');
    }

    try {
      const updateData: any = {
        ...updateTranslationDto,
        updatedAt: new Date(),
      };

      // Chỉ admin/manager mới được thay đổi status trực tiếp
      if (updateTranslationDto.status && !user.actions.includes('translation:approve')) {
        delete updateData.status;
      }

      const translation = await this.prisma.translation.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Emit event
      this.eventEmitter.emit('translation.updated', {
        translation,
        user,
        changes: updateTranslationDto,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi cập nhật translation');
    }
  }

  /**
   * Hủy translation request
   */
  async cancel(id: string, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:delete')) {
      throw new ForbiddenException('Không có quyền hủy translation request');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException('Không tìm thấy translation');
    }

    if (existingTranslation.status === TranslationStatus.COMPLETED) {
      throw new BadRequestException('Không thể hủy translation đã hoàn thành');
    }

    if (existingTranslation.status === TranslationStatus.REJECTED) {
      throw new BadRequestException('Translation đã được hủy trước đó');
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.REJECTED,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Emit event
      this.eventEmitter.emit('translation.cancelled', {
        translation,
        user,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi hủy translation');
    }
  }

  /**
   * Approve translation request (PENDING → APPROVED)
   */
  async approve(id: string, approveDto: ApproveTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:approve')) {
      throw new ForbiddenException('Không có quyền duyệt translation');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException('Không tìm thấy translation');
    }

    if (existingTranslation.status !== TranslationStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể duyệt translation ở trạng thái PENDING');
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.APPROVED,
          approvedById: user.id,
          approvedAt: new Date(),
          notes: approveDto.notes || existingTranslation.notes,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Emit event
      this.eventEmitter.emit('translation.approved', {
        translation,
        user,
        notes: approveDto.notes,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi duyệt translation');
    }
  }

  /**
   * Reject translation request (PENDING/APPROVED → REJECTED)
   */
  async reject(id: string, rejectDto: RejectTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:reject')) {
      throw new ForbiddenException('Không có quyền từ chối translation');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException('Không tìm thấy translation');
    }

    if (existingTranslation.status !== TranslationStatus.PENDING && existingTranslation.status !== TranslationStatus.APPROVED) {
      throw new BadRequestException('Chỉ có thể từ chối translation ở trạng thái PENDING hoặc APPROVED');
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.REJECTED,
          notes: `${existingTranslation.notes || ''}\n\nLý do từ chối: ${rejectDto.reason}${rejectDto.notes ? `\nGhi chú: ${rejectDto.notes}` : ''}`,
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Emit event
      this.eventEmitter.emit('translation.rejected', {
        translation,
        user,
        reason: rejectDto.reason,
        notes: rejectDto.notes,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi từ chối translation');
    }
  }

  /**
   * Complete translation (APPROVED → COMPLETED)
   */
  async complete(id: string, completeDto: CompleteTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:complete')) {
      throw new ForbiddenException('Không có quyền hoàn thành translation');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException('Không tìm thấy translation');
    }

    if (existingTranslation.status !== TranslationStatus.APPROVED) {
      throw new BadRequestException('Chỉ có thể hoàn thành translation ở trạng thái APPROVED');
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.COMPLETED,
          translatedFile: completeDto.translatedFile,
          certificationFile: completeDto.certificationFile,
          notes: completeDto.notes || existingTranslation.notes,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Emit event
      this.eventEmitter.emit('translation.completed', {
        translation,
        user,
        translatedFile: completeDto.translatedFile,
        certificationFile: completeDto.certificationFile,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException('Lỗi khi hoàn thành translation');
    }
  }

  /**
   * Lấy thống kê translation
   */
  async getStats(user: TranslationUser) {
    // Kiểm tra quyền
    if (!user.actions.includes('translation:view')) {
      throw new ForbiddenException('Không có quyền xem thống kê translation');
    }

    try {
      const [
        totalTranslations,
        pendingTranslations,
        approvedTranslations,
        completedTranslations,
        rejectedTranslations,
        urgentTranslations,
        veryUrgentTranslations,
        recentTranslations,
      ] = await Promise.all([
        this.prisma.translation.count(),
        this.prisma.translation.count({ where: { status: TranslationStatus.PENDING } }),
        this.prisma.translation.count({ where: { status: TranslationStatus.APPROVED } }),
        this.prisma.translation.count({ where: { status: TranslationStatus.COMPLETED } }),
        this.prisma.translation.count({ where: { status: TranslationStatus.REJECTED } }),
        this.prisma.translation.count({ where: { urgentLevel: 'URGENT' } }),
        this.prisma.translation.count({ where: { urgentLevel: 'VERY_URGENT' } }),
        this.prisma.translation.count({ 
          where: { 
            createdAt: { 
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            }
          } 
        }),
      ]);

      // Lấy thống kê theo ngôn ngữ phổ biến
      const languageStats = await this.prisma.translation.groupBy({
        by: ['sourceLanguage', 'targetLanguage'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10,
      });

      return {
        totalTranslations,
        pendingTranslations,
        approvedTranslations,
        completedTranslations,
        rejectedTranslations,
        urgentTranslations,
        veryUrgentTranslations,
        recentTranslations,
        languageStats,
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi lấy thống kê translation');
    }
  }
}