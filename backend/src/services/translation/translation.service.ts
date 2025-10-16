import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Translation, TranslationStatus, Prisma } from '@prisma/client';
import { 
  CreateTranslationDto, 
  UpdateTranslationDto, 
  FilterTranslationDto,
  ApproveTranslationDto,
  RejectTranslationDto,
  CompleteTranslationDto
} from './dto';

export interface TranslationUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface TranslationWithRelations extends Translation {
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
}

export interface TranslationListResult {
  translations: TranslationWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TranslationStats {
  total: number;
  byStatus: Record<string, number>;
  byUrgentLevel: Record<string, number>;
  byLanguagePair: Record<string, number>;
  recentRequests: number;
  completedThisMonth: number;
}

/**
 * Translation Service - Quản lý yêu cầu dịch thuật và công chứng
 * 
 * Action permissions:
 * - TRANSLATION_CREATE: Tạo translation request mới
 * - TRANSLATION_READ: Xem translation information
 * - TRANSLATION_UPDATE: Cập nhật translation information
 * - TRANSLATION_DELETE: Xóa/hủy translation request
 * - TRANSLATION_APPROVE: Approve translation request
 * - TRANSLATION_REJECT: Reject translation request
 * - TRANSLATION_COMPLETE: Complete translation với file dịch
 */
@Injectable()
export class TranslationService {
  private readonly translationInclude: Prisma.TranslationInclude = {
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
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new translation request with all new fields
   */
  async create(createTranslationDto: CreateTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_CREATE')) {
      throw new ForbiddenException('You do not have permission to create translations');
    }

    // Validate required fields
    if (!createTranslationDto.applicantName || createTranslationDto.applicantName.trim() === '') {
      throw new BadRequestException('Applicant name is required');
    }

    if (!createTranslationDto.documentTitle || createTranslationDto.documentTitle.trim() === '') {
      throw new BadRequestException('Document title is required');
    }

    if (!createTranslationDto.sourceLanguage || createTranslationDto.sourceLanguage.trim() === '') {
      throw new BadRequestException('Source language is required');
    }

    if (!createTranslationDto.targetLanguage || createTranslationDto.targetLanguage.trim() === '') {
      throw new BadRequestException('Target language is required');
    }

    if (!createTranslationDto.documentType || createTranslationDto.documentType.trim() === '') {
      throw new BadRequestException('Document type is required');
    }

    if (!createTranslationDto.purpose || createTranslationDto.purpose.trim() === '') {
      throw new BadRequestException('Purpose is required');
    }

    if (!createTranslationDto.originalFile || createTranslationDto.originalFile.trim() === '') {
      throw new BadRequestException('Original file is required');
    }

    // Validate language pair
    if (createTranslationDto.sourceLanguage.toLowerCase() === createTranslationDto.targetLanguage.toLowerCase()) {
      throw new BadRequestException('Source language and target language cannot be the same');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (createTranslationDto.applicantEmail && !emailRegex.test(createTranslationDto.applicantEmail)) {
      throw new BadRequestException('Invalid applicant email format');
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (createTranslationDto.applicantPhone && !phoneRegex.test(createTranslationDto.applicantPhone)) {
      throw new BadRequestException('Invalid applicant phone format');
    }

    // Validate urgent level
    const validUrgentLevels = ['NORMAL', 'URGENT', 'VERY_URGENT'];
    if (createTranslationDto.urgentLevel && !validUrgentLevels.includes(createTranslationDto.urgentLevel)) {
      throw new BadRequestException('Invalid urgent level');
    }

    // Validate partner if provided
    if (createTranslationDto['partnerId']) {
      const partner = await this.prisma.partner.findUnique({
        where: { id: createTranslationDto['partnerId'] },
      });
      if (!partner) {
        throw new BadRequestException(`Partner with ID ${createTranslationDto['partnerId']} not found`);
      }
    }

    // Validate unit if provided
    if (createTranslationDto['unitId']) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: createTranslationDto['unitId'] },
      });
      if (!unit) {
        throw new BadRequestException(`Unit with ID ${createTranslationDto['unitId']} not found`);
      }
    }

    try {
      // Prepare data with all new fields
      const data: Prisma.TranslationCreateInput = {
        applicantName: createTranslationDto.applicantName,
        applicantEmail: createTranslationDto.applicantEmail,
        applicantPhone: createTranslationDto.applicantPhone,
        documentTitle: createTranslationDto.documentTitle,
        sourceLanguage: createTranslationDto.sourceLanguage,
        targetLanguage: createTranslationDto.targetLanguage,
        documentType: createTranslationDto.documentType,
        purpose: createTranslationDto.purpose,
        urgentLevel: createTranslationDto.urgentLevel || 'NORMAL',
        status: TranslationStatus.PENDING,
        originalFile: createTranslationDto.originalFile,
        translatedFile: createTranslationDto.translatedFile,
        attachments: createTranslationDto.attachments || undefined,
        notes: createTranslationDto.notes,
        unitName: createTranslationDto['unitName'],
        translatorName: createTranslationDto['translatorName'],
        reason: createTranslationDto['reason'],
        verificationFile: createTranslationDto['verificationFile'],
        languagePair: createTranslationDto['languagePair'] || 
          `${createTranslationDto.sourceLanguage}  ${createTranslationDto.targetLanguage}`,
        createdBy: {
          connect: { id: user.id },
        },
      };

      // Connect partner if provided
      if (createTranslationDto['partnerId']) {
        data.partner = {
          connect: { id: createTranslationDto['partnerId'] },
        };
      }

      // Connect unit if provided
      if (createTranslationDto['unitId']) {
        data.unit = {
          connect: { id: createTranslationDto['unitId'] },
        };
      }

      const translation = await this.prisma.translation.create({
        data,
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('translation.created', {
        translationId: translation.id,
        userId: user.id,
        urgentLevel: translation.urgentLevel,
        documentTitle: translation.documentTitle,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create translation: ${error.message}`);
    }
  }

  /**
   * Find all translations with filtering and pagination
   */
  async findAll(filterDto: FilterTranslationDto, user: TranslationUser): Promise<TranslationListResult> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_READ')) {
      throw new ForbiddenException('You do not have permission to view translations');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TranslationWhereInput = {};

    // Keyword search (documentTitle, applicantName, translatorName)
    if (filters.search) {
      where.OR = [
        { documentTitle: { contains: filters.search, mode: 'insensitive' } },
        { applicantName: { contains: filters.search, mode: 'insensitive' } },
        { translatorName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status;
    }

    // Source language filter
    if (filters.sourceLanguage) {
      where.sourceLanguage = { contains: filters.sourceLanguage, mode: 'insensitive' };
    }

    // Target language filter
    if (filters.targetLanguage) {
      where.targetLanguage = { contains: filters.targetLanguage, mode: 'insensitive' };
    }

    // Document type filter
    if (filters.documentType) {
      where.documentType = { contains: filters.documentType, mode: 'insensitive' };
    }

    // Urgent level filter
    if (filters.urgentLevel) {
      where.urgentLevel = filters.urgentLevel;
    }

    // Partner filter
    if (filters['partnerId']) {
      where.partnerId = filters['partnerId'];
    }

    // Unit filter
    if (filters['unitId']) {
      where.unitId = filters['unitId'];
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

    // Created by filter
    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    // Approved by filter
    if (filters.approvedById) {
      where.approvedById = filters.approvedById;
    }

    // Build orderBy
    const orderBy: Prisma.TranslationOrderByWithRelationInput = {};
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      orderBy[sortBy] = sortOrder;
    } else if (sortBy === 'urgentLevel') {
      orderBy.urgentLevel = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    try {
      const [translations, total] = await Promise.all([
        this.prisma.translation.findMany({
          where,
          include: this.translationInclude,
          skip,
          take: limit,
          orderBy,
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
      throw new BadRequestException(`Failed to fetch translations: ${error.message}`);
    }
  }

  /**
   * Find one translation by ID
   */
  async findOne(id: string, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_READ')) {
      throw new ForbiddenException('You do not have permission to view translations');
    }

    try {
      const translation = await this.prisma.translation.findUnique({
        where: { id },
        include: this.translationInclude,
      });

      if (!translation) {
        throw new NotFoundException(`Translation with ID ${id} not found`);
      }

      return translation as TranslationWithRelations;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch translation: ${error.message}`);
    }
  }

  /**
   * Update translation information with all new fields
   */
  async update(id: string, updateTranslationDto: UpdateTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_UPDATE')) {
      throw new ForbiddenException('You do not have permission to update translations');
    }

    // Find existing translation
    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingTranslation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    // Only creator can update when status = PENDING
    if (existingTranslation.status !== TranslationStatus.PENDING) {
      if (!user.actions.includes('TRANSLATION_APPROVE')) {
        throw new BadRequestException('Can only update translations with status PENDING');
      }
    }

    // Validate partner if provided
    if (updateTranslationDto['partnerId'] !== undefined) {
      if (updateTranslationDto['partnerId'] !== null) {
        const partner = await this.prisma.partner.findUnique({
          where: { id: updateTranslationDto['partnerId'] },
        });
        if (!partner) {
          throw new BadRequestException(`Partner with ID ${updateTranslationDto['partnerId']} not found`);
        }
      }
    }

    // Validate unit if provided
    if (updateTranslationDto['unitId'] !== undefined) {
      if (updateTranslationDto['unitId'] !== null) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: updateTranslationDto['unitId'] },
        });
        if (!unit) {
          throw new BadRequestException(`Unit with ID ${updateTranslationDto['unitId']} not found`);
        }
      }
    }

    try {
      // Prepare update data
      const data: Prisma.TranslationUpdateInput = {};

      if (updateTranslationDto.applicantName !== undefined) data.applicantName = updateTranslationDto.applicantName;
      if (updateTranslationDto.applicantEmail !== undefined) data.applicantEmail = updateTranslationDto.applicantEmail;
      if (updateTranslationDto.applicantPhone !== undefined) data.applicantPhone = updateTranslationDto.applicantPhone;
      if (updateTranslationDto.documentTitle !== undefined) data.documentTitle = updateTranslationDto.documentTitle;
      if (updateTranslationDto.sourceLanguage !== undefined) data.sourceLanguage = updateTranslationDto.sourceLanguage;
      if (updateTranslationDto.targetLanguage !== undefined) data.targetLanguage = updateTranslationDto.targetLanguage;
      if (updateTranslationDto.documentType !== undefined) data.documentType = updateTranslationDto.documentType;
      if (updateTranslationDto.purpose !== undefined) data.purpose = updateTranslationDto.purpose;
      if (updateTranslationDto.urgentLevel !== undefined) data.urgentLevel = updateTranslationDto.urgentLevel;
      if (updateTranslationDto.originalFile !== undefined) data.originalFile = updateTranslationDto.originalFile;
      if (updateTranslationDto.attachments !== undefined) data.attachments = updateTranslationDto.attachments;
      if (updateTranslationDto.notes !== undefined) data.notes = updateTranslationDto.notes;
      
      // New fields
      if (updateTranslationDto['unitName'] !== undefined) data.unitName = updateTranslationDto['unitName'];
      if (updateTranslationDto['translatorName'] !== undefined) data.translatorName = updateTranslationDto['translatorName'];
      if (updateTranslationDto['reason'] !== undefined) data.reason = updateTranslationDto['reason'];
      if (updateTranslationDto['verificationFile'] !== undefined) data.verificationFile = updateTranslationDto['verificationFile'];
      if (updateTranslationDto['languagePair'] !== undefined) data.languagePair = updateTranslationDto['languagePair'];

      // Handle partner relation
      if (updateTranslationDto['partnerId'] !== undefined) {
        if (updateTranslationDto['partnerId'] === null) {
          data.partner = { disconnect: true };
        } else {
          data.partner = { connect: { id: updateTranslationDto['partnerId'] } };
        }
      }

      // Handle unit relation
      if (updateTranslationDto['unitId'] !== undefined) {
        if (updateTranslationDto['unitId'] === null) {
          data.unit = { disconnect: true };
        } else {
          data.unit = { connect: { id: updateTranslationDto['unitId'] } };
        }
      }

      const translation = await this.prisma.translation.update({
        where: { id },
        data,
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('TRANSLATION_UPDATED', {
        translationId: translation.id,
        userId: user.id,
        changes: Object.keys(data),
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update translation: ${error.message}`);
    }
  }

  /**
   * Soft delete (cancel) a translation request
   */
  async cancel(id: string, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_DELETE')) {
      throw new ForbiddenException('You do not have permission to delete translations');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    if (existingTranslation.status === TranslationStatus.COMPLETED) {
      throw new BadRequestException('Cannot delete a completed translation');
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: { status: TranslationStatus.REJECTED },
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('translation.cancelled', {
        translationId: translation.id,
        userId: user.id,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to cancel translation: ${error.message}`);
    }
  }

  /**
   * Approve translation request (PENDING  APPROVED)
   */
  async approve(id: string, approveDto: ApproveTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_APPROVE')) {
      throw new ForbiddenException('You do not have permission to approve translations');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    if (existingTranslation.status !== TranslationStatus.PENDING) {
      throw new BadRequestException(`Can only approve translations with status PENDING. Current status: ${existingTranslation.status}`);
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.APPROVED,
          approvedBy: { connect: { id: user.id } },
          approvedAt: new Date(),
          notes: approveDto.notes || existingTranslation.notes,
        },
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('translation.approved', {
        translation: {
          id: translation.id,
          applicantName: translation.applicantName,
          applicantEmail: translation.applicantEmail,
          documentTitle: translation.documentTitle,
          status: translation.status,
        },
        user: {
          id: user.id,
          actions: user.actions,
          fullName: '', // Will be populated by the listener if needed
          email: '', // Will be populated by the listener if needed
        },
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to approve translation: ${error.message}`);
    }
  }

  /**
   * Reject translation request
   */
  async reject(id: string, rejectDto: RejectTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_REJECT')) {
      throw new ForbiddenException('You do not have permission to reject translations');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    if (existingTranslation.status !== TranslationStatus.PENDING && existingTranslation.status !== TranslationStatus.APPROVED) {
      throw new BadRequestException(`Can only reject translations with status PENDING or APPROVED. Current status: ${existingTranslation.status}`);
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.REJECTED,
          approvedBy: { connect: { id: user.id } },
          approvedAt: new Date(),
          reason: rejectDto.reason,
          notes: `REJECTED: ${rejectDto.reason}${rejectDto.notes ? ' - ' + rejectDto.notes : ''}`,
        },
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('translation.rejected', {
        translationId: translation.id,
        userId: user.id,
        reason: rejectDto.reason,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to reject translation: ${error.message}`);
    }
  }

  /**
   * Complete translation (APPROVED  COMPLETED)
   */
  async complete(id: string, completeDto: CompleteTranslationDto, user: TranslationUser): Promise<TranslationWithRelations> {
    // Check permission
    if (!user.actions.includes('TRANSLATION_COMPLETE')) {
      throw new ForbiddenException('You do not have permission to complete translations');
    }

    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    if (existingTranslation.status !== TranslationStatus.APPROVED) {
      throw new BadRequestException(`Can only complete translations with status APPROVED. Current status: ${existingTranslation.status}`);
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.COMPLETED,
          translatedFile: completeDto.translatedFile,
          certificationFile: completeDto.certificationFile,
          completedAt: new Date(),
          notes: completeDto.notes || existingTranslation.notes,
        },
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('translation.completed', {
        translationId: translation.id,
        userId: user.id,
        completedAt: translation.completedAt,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to complete translation: ${error.message}`);
    }
  }

  /**
   * Get translation statistics
   */
  async getStats(user: TranslationUser): Promise<TranslationStats> {
    if (!user.actions.includes('TRANSLATION_READ')) {
      throw new ForbiddenException('You do not have permission to view translation statistics');
    }

    try {
      const [totalTranslations, byStatus, byUrgentLevel, pendingTranslations, myTranslations, completedThisMonth, recentRequests, languagePairs] = await Promise.all([
        this.prisma.translation.count(),
        this.prisma.translation.groupBy({
          by: ['status'],
          _count: true,
        }),
        this.prisma.translation.groupBy({
          by: ['urgentLevel'],
          _count: true,
        }),
        this.prisma.translation.count({
          where: { status: TranslationStatus.PENDING },
        }),
        this.prisma.translation.count({
          where: { createdById: user.id },
        }),
        this.prisma.translation.count({
          where: {
            status: TranslationStatus.COMPLETED,
            completedAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
            },
          },
        }),
        this.prisma.translation.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
        this.prisma.translation.groupBy({
          by: ['sourceLanguage'],
          _count: true,
        }),
      ]);

      // Convert arrays to objects for frontend compatibility
      const byStatusObj: Record<string, number> = {};
      byStatus.forEach(item => {
        byStatusObj[item.status] = item._count;
      });

      const byUrgentLevelObj: Record<string, number> = {};
      byUrgentLevel.forEach(item => {
        byUrgentLevelObj[item.urgentLevel] = item._count;
      });

      const byLanguagePairObj: Record<string, number> = {};
      languagePairs.forEach(item => {
        // Skip if sourceLanguage is null or empty
        if (!item.sourceLanguage) return;
        // Use source language as key for statistics
        byLanguagePairObj[item.sourceLanguage] = item._count;
      });

      return {
        total: totalTranslations,
        byStatus: byStatusObj,
        byUrgentLevel: byUrgentLevelObj,
        byLanguagePair: byLanguagePairObj,
        recentRequests: recentRequests,
        completedThisMonth: completedThisMonth,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch translation statistics: ${error.message}`);
    }
  }

  /**
   * Helper: Get all pending translations
   */
  async getPendingTranslations(): Promise<TranslationWithRelations[]> {
    try {
      const translations = await this.prisma.translation.findMany({
        where: { status: TranslationStatus.PENDING },
        include: this.translationInclude,
        orderBy: { createdAt: 'asc' },
      });

      return translations as TranslationWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch pending translations: ${error.message}`);
    }
  }

  /**
   * Helper: Approve translation (simplified)
   */
  async approveTranslation(id: string, approverId: string): Promise<TranslationWithRelations> {
    const existingTranslation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!existingTranslation) {
      throw new NotFoundException(`Translation with ID ${id} not found`);
    }

    if (existingTranslation.status !== TranslationStatus.PENDING) {
      throw new BadRequestException('Can only approve pending translations');
    }

    try {
      const translation = await this.prisma.translation.update({
        where: { id },
        data: {
          status: TranslationStatus.APPROVED,
          approvedBy: { connect: { id: approverId } },
          approvedAt: new Date(),
        },
        include: this.translationInclude,
      });

      // Emit event
      this.eventEmitter.emit('translation.approved', {
        translationId: translation.id,
        approverId,
      });

      return translation as TranslationWithRelations;
    } catch (error) {
      throw new BadRequestException(`Failed to approve translation: ${error.message}`);
    }
  }

  /**
   * Helper: Get translations by partner
   */
  async getTranslationsByPartner(partnerId: string): Promise<TranslationWithRelations[]> {
    try {
      const translations = await this.prisma.translation.findMany({
        where: { partnerId },
        include: this.translationInclude,
        orderBy: { createdAt: 'desc' },
      });

      return translations as TranslationWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch translations by partner: ${error.message}`);
    }
  }

  /**
   * Helper: Get translations by unit
   */
  async getTranslationsByUnit(unitId: string): Promise<TranslationWithRelations[]> {
    try {
      const translations = await this.prisma.translation.findMany({
        where: { unitId },
        include: this.translationInclude,
        orderBy: { createdAt: 'desc' },
      });

      return translations as TranslationWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch translations by unit: ${error.message}`);
    }
  }

  /**
   * Helper: Get urgent translations
   */
  async getUrgentTranslations(urgentLevel: string = 'URGENT'): Promise<TranslationWithRelations[]> {
    try {
      const translations = await this.prisma.translation.findMany({
        where: {
          urgentLevel: { in: [urgentLevel, 'VERY_URGENT'] },
          status: { in: [TranslationStatus.PENDING, TranslationStatus.APPROVED] },
        },
        include: this.translationInclude,
        orderBy: [
          { urgentLevel: 'desc' },
          { createdAt: 'asc' },
        ],
      });

      return translations as TranslationWithRelations[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch urgent translations: ${error.message}`);
    }
  }
}
