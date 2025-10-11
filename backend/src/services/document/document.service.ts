import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { Prisma, Document, DocumentStatus, DocumentType } from '@prisma/client';
import { CreateDocumentDto, UpdateDocumentDto, FilterDocumentDto, ApproveDocumentDto } from './dto';

export interface DocumentUser {
  id: string;
  actions: string[];
  unitId?: string;
}

export interface DocumentWithRelations extends Document {
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
}

export interface PaginatedDocuments {
  data: DocumentWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentStats {
  totalDocuments: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  expiringDocuments: number;
  myDocuments: number;
}

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Common include object for related entities
  private readonly documentInclude: Prisma.DocumentInclude = {
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
  };

  // ==================== CRUD Operations ====================

  /**
   * Tạo document mới với trạng thái DRAFT
   * Supports new fields: proposingUnit, signingLevel, signedBy, isHighLevelDelegation,
   * partnerAddress, partnerField, cooperationField, proposalReason, handlingStatus,
   * partnerId, unitId
   */
  async create(createDocumentDto: CreateDocumentDto, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_CREATE')) {
      throw new ForbiddenException('You do not have permission to create documents');
    }

    // Validate partner exists if partnerId is provided
    if (createDocumentDto.partnerId) {
      const partner = await this.prisma.partner.findUnique({
        where: { id: createDocumentDto.partnerId },
      });
      if (!partner) {
        throw new BadRequestException(`Partner with ID ${createDocumentDto.partnerId} not found`);
      }
    }

    // Validate unit exists if unitId is provided
    if (createDocumentDto.unitId) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: createDocumentDto.unitId },
      });
      if (!unit) {
        throw new BadRequestException(`Unit with ID ${createDocumentDto.unitId} not found`);
      }
    }

    // Prepare data for creation with proper relation connections
    const data: Prisma.DocumentCreateInput = {
      title: createDocumentDto.title,
      type: createDocumentDto.type || DocumentType.MOU,
      partnerName: createDocumentDto.partnerName,
      partnerCountry: createDocumentDto.partnerCountry,
      partnerAddress: createDocumentDto.partnerAddress,
      partnerField: createDocumentDto.partnerField,
      description: createDocumentDto.description,
      content: createDocumentDto.content,
      proposingUnit: createDocumentDto.proposingUnit,
      signingLevel: createDocumentDto.signingLevel,
      signedBy: createDocumentDto.signedBy,
      isHighLevelDelegation: createDocumentDto.isHighLevelDelegation || false,
      cooperationField: createDocumentDto.cooperationField,
      proposalReason: createDocumentDto.proposalReason,
      handlingStatus: createDocumentDto.handlingStatus,
      signedDate: createDocumentDto.signedDate ? new Date(createDocumentDto.signedDate) : null,
      effectiveDate: createDocumentDto.effectiveDate ? new Date(createDocumentDto.effectiveDate) : null,
      expirationDate: createDocumentDto.expirationDate ? new Date(createDocumentDto.expirationDate) : null,
      attachments: createDocumentDto.attachments || [],
      status: DocumentStatus.DRAFT,
      createdBy: {
        connect: { id: user.id },
      },
    };

    // Connect partner if provided
    if (createDocumentDto.partnerId) {
      data.partner = {
        connect: { id: createDocumentDto.partnerId },
      };
    }

    // Connect unit if provided
    if (createDocumentDto.unitId) {
      data.unit = {
        connect: { id: createDocumentDto.unitId },
      };
    }

    const document = await this.prisma.document.create({
      data,
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.created', {
      document,
      user,
      timestamp: new Date(),
    });

    return document;
  }

  /**
   * Lấy danh sách documents với filtering và pagination
   * Supports filters: status, type, year, partnerId, unitId, partnerName, partnerCountry, title
   */
  async findAll(filterDto: FilterDocumentDto, user: DocumentUser): Promise<PaginatedDocuments> {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      year,
      partnerName,
      partnerCountry,
      title,
      unitId,
      createdBy,
      createdFrom,
      createdTo,
      expiringSoon,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.DocumentWhereInput = {};
    
    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by year
    if (year) {
      where.createdAt = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }

    // Filter by partnerId
    if (filterDto['partnerId']) {
      where.partnerId = filterDto['partnerId'];
    }

    // Filter by unitId
    if (unitId) {
      where.unitId = unitId;
    }

    // Filter by partner name (partial match)
    if (partnerName) {
      where.partnerName = {
        contains: partnerName,
        mode: 'insensitive',
      };
    }

    // Filter by partner country (partial match)
    if (partnerCountry) {
      where.partnerCountry = {
        contains: partnerCountry,
        mode: 'insensitive',
      };
    }

    // Filter by title (partial match)
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    // Filter by creator
    if (createdBy) {
      where.createdById = createdBy;
    }

    // Filter by date range
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) {
        where.createdAt.gte = new Date(createdFrom);
      }
      if (createdTo) {
        where.createdAt.lte = new Date(createdTo);
      }
    }

    // Filter expiring soon
    if (expiringSoon) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + expiringSoon);
      
      where.expirationDate = {
        gte: today,
        lte: futureDate,
      };
      where.status = DocumentStatus.ACTIVE;
    }

    // Permission-based filtering
    if (!user.actions.includes('DOCUMENT_READ_ALL')) {
      // If user doesn't have READ_ALL, only show documents from their unit or created by them
      where.OR = [
        { createdById: user.id },
        { unitId: user.unitId },
      ];
    }

    // Execute query with pagination
    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: this.documentInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data: documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy thống kê documents
   */
  async getDocumentStats(user: DocumentUser): Promise<DocumentStats> {
    const where: Prisma.DocumentWhereInput = {};

    // Permission-based filtering
    if (!user.actions.includes('DOCUMENT_READ_ALL')) {
      where.OR = [
        { createdById: user.id },
        { unitId: user.unitId },
      ];
    }

    // Get total documents
    const totalDocuments = await this.prisma.document.count({ where });

    // Get documents by status
    const byStatusData = await this.prisma.document.groupBy({
      by: ['status'],
      where,
      _count: true,
    });
    const byStatus = byStatusData.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Get documents by type
    const byTypeData = await this.prisma.document.groupBy({
      by: ['type'],
      where,
      _count: true,
    });
    const byType = byTypeData.reduce((acc, item) => {
      acc[item.type] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Get expiring documents (within 30 days)
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);
    
    const expiringDocuments = await this.prisma.document.count({
      where: {
        ...where,
        status: DocumentStatus.ACTIVE,
        expirationDate: {
          gte: today,
          lte: futureDate,
        },
      },
    });

    // Get my documents
    const myDocuments = await this.prisma.document.count({
      where: {
        createdById: user.id,
      },
    });

    return {
      totalDocuments,
      byStatus,
      byType,
      expiringDocuments,
      myDocuments,
    };
  }

  /**
   * Lấy chi tiết document theo ID
   */
  async findOne(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: this.documentInclude,
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Check permission
    if (!user.actions.includes('DOCUMENT_READ_ALL')) {
      if (document.createdById !== user.id && document.unitId !== user.unitId) {
        throw new ForbiddenException('You do not have permission to view this document');
      }
    }

    return document;
  }

  /**
   * Cập nhật document (chỉ được phép khi status = DRAFT)
   * Supports updating all fields including new partner/unit relations
   */
  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: DocumentUser
  ): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_UPDATE')) {
      throw new ForbiddenException('You do not have permission to update documents');
    }

    // Get existing document
    const existingDocument = await this.findOne(id, user);

    // Only allow update if status is DRAFT
    if (existingDocument.status !== DocumentStatus.DRAFT) {
      throw new BadRequestException('Document can only be updated when status is DRAFT');
    }

    // Only creator can update
    if (existingDocument.createdById !== user.id) {
      throw new ForbiddenException('Only the creator can update this document');
    }

    // Validate partner exists if partnerId is provided
    if (updateDocumentDto.partnerId !== undefined) {
      if (updateDocumentDto.partnerId) {
        const partner = await this.prisma.partner.findUnique({
          where: { id: updateDocumentDto.partnerId },
        });
        if (!partner) {
          throw new BadRequestException(`Partner with ID ${updateDocumentDto.partnerId} not found`);
        }
      }
    }

    // Validate unit exists if unitId is provided
    if (updateDocumentDto.unitId !== undefined) {
      if (updateDocumentDto.unitId) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: updateDocumentDto.unitId },
        });
        if (!unit) {
          throw new BadRequestException(`Unit with ID ${updateDocumentDto.unitId} not found`);
        }
      }
    }

    // Prepare update data
    const data: Prisma.DocumentUpdateInput = {};

    // Update basic fields
    if (updateDocumentDto.title !== undefined) data.title = updateDocumentDto.title;
    if (updateDocumentDto.partnerName !== undefined) data.partnerName = updateDocumentDto.partnerName;
    if (updateDocumentDto.partnerCountry !== undefined) data.partnerCountry = updateDocumentDto.partnerCountry;
    if (updateDocumentDto.partnerAddress !== undefined) data.partnerAddress = updateDocumentDto.partnerAddress;
    if (updateDocumentDto.partnerField !== undefined) data.partnerField = updateDocumentDto.partnerField;
    if (updateDocumentDto.description !== undefined) data.description = updateDocumentDto.description;
    if (updateDocumentDto.content !== undefined) data.content = updateDocumentDto.content;
    if (updateDocumentDto.proposingUnit !== undefined) data.proposingUnit = updateDocumentDto.proposingUnit;
    if (updateDocumentDto.signingLevel !== undefined) data.signingLevel = updateDocumentDto.signingLevel;
    if (updateDocumentDto.signedBy !== undefined) data.signedBy = updateDocumentDto.signedBy;
    if (updateDocumentDto.isHighLevelDelegation !== undefined) data.isHighLevelDelegation = updateDocumentDto.isHighLevelDelegation;
    if (updateDocumentDto.cooperationField !== undefined) data.cooperationField = updateDocumentDto.cooperationField;
    if (updateDocumentDto.proposalReason !== undefined) data.proposalReason = updateDocumentDto.proposalReason;
    if (updateDocumentDto.handlingStatus !== undefined) data.handlingStatus = updateDocumentDto.handlingStatus;

    // Update date fields
    if (updateDocumentDto.signedDate !== undefined) {
      data.signedDate = updateDocumentDto.signedDate ? new Date(updateDocumentDto.signedDate) : null;
    }
    if (updateDocumentDto.effectiveDate !== undefined) {
      data.effectiveDate = updateDocumentDto.effectiveDate ? new Date(updateDocumentDto.effectiveDate) : null;
    }
    if (updateDocumentDto.expirationDate !== undefined) {
      data.expirationDate = updateDocumentDto.expirationDate ? new Date(updateDocumentDto.expirationDate) : null;
    }

    // Update attachments
    if (updateDocumentDto.attachments !== undefined) {
      data.attachments = updateDocumentDto.attachments;
    }

    // Update partner relation
    if (updateDocumentDto.partnerId !== undefined) {
      if (updateDocumentDto.partnerId) {
        data.partner = { connect: { id: updateDocumentDto.partnerId } };
      } else {
        data.partner = { disconnect: true };
      }
    }

    // Update unit relation
    if (updateDocumentDto.unitId !== undefined) {
      if (updateDocumentDto.unitId) {
        data.unit = { connect: { id: updateDocumentDto.unitId } };
      } else {
        data.unit = { disconnect: true };
      }
    }

    const document = await this.prisma.document.update({
      where: { id },
      data,
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.updated', {
      document,
      user,
      timestamp: new Date(),
    });

    return document;
  }

  /**
   * Hủy document (soft delete - chuyển status sang CANCELLED)
   */
  async cancel(id: string, user: DocumentUser): Promise<void> {
    if (!user.actions.includes('DOCUMENT_DELETE')) {
      throw new ForbiddenException('You do not have permission to cancel documents');
    }

    const document = await this.findOne(id, user);

    // Only allow cancel if status is DRAFT or SUBMITTED
    const allowedStatuses: DocumentStatus[] = [DocumentStatus.DRAFT, DocumentStatus.SUBMITTED];
    if (!allowedStatuses.includes(document.status)) {
      throw new BadRequestException('Document can only be cancelled when status is DRAFT or SUBMITTED');
    }

    // Only creator or admin can cancel
    if (!user.actions.includes('DOCUMENT_DELETE_ALL') && document.createdById !== user.id) {
      throw new ForbiddenException('Only the creator or admin can cancel this document');
    }

    await this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.CANCELLED },
    });

    // Emit event
    this.eventEmitter.emit('document.cancelled', {
      documentId: id,
      user,
      timestamp: new Date(),
    });
  }

  // ==================== Workflow Operations ====================

  /**
   * Submit document để review (DRAFT → SUBMITTED)
   */
  async submit(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    const document = await this.findOne(id, user);

    // Only creator can submit
    if (document.createdById !== user.id) {
      throw new ForbiddenException('Only the creator can submit this document');
    }

    // Only allow submit if status is DRAFT
    if (document.status !== DocumentStatus.DRAFT) {
      throw new BadRequestException('Document can only be submitted when status is DRAFT');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.SUBMITTED },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.submitted', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Bắt đầu review process (SUBMITTED → REVIEWING)
   */
  async startReview(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_UPDATE')) {
      throw new ForbiddenException('You do not have permission to start review');
    }

    const document = await this.findOne(id, user);

    // Only allow start review if status is SUBMITTED
    if (document.status !== DocumentStatus.SUBMITTED) {
      throw new BadRequestException('Document can only be reviewed when status is SUBMITTED');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.REVIEWING },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.review.started', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Approve document (REVIEWING → APPROVED)
   */
  async approve(
    id: string,
    approveDto: ApproveDocumentDto,
    user: DocumentUser
  ): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to approve documents');
    }

    const document = await this.findOne(id, user);

    // Only allow approve if status is REVIEWING
    if (document.status !== DocumentStatus.REVIEWING) {
      throw new BadRequestException('Document can only be approved when status is REVIEWING');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.APPROVED,
        approvedBy: {
          connect: { id: user.id },
        },
        approvedAt: new Date(),
      },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.approved', {
      document: updatedDocument,
      user,
      approveDto,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Reject document (REVIEWING → DRAFT)
   */
  async reject(
    id: string,
    rejectDto: ApproveDocumentDto,
    user: DocumentUser
  ): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to reject documents');
    }

    const document = await this.findOne(id, user);

    // Only allow reject if status is REVIEWING
    if (document.status !== DocumentStatus.REVIEWING) {
      throw new BadRequestException('Document can only be rejected when status is REVIEWING');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.DRAFT,
        approvedBy: {
          disconnect: true,
        },
        approvedAt: null,
      },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.rejected', {
      document: updatedDocument,
      user,
      rejectDto,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Sign document (APPROVED → SIGNED)
   */
  async sign(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to sign documents');
    }

    const document = await this.findOne(id, user);

    // Only allow sign if status is APPROVED
    if (document.status !== DocumentStatus.APPROVED) {
      throw new BadRequestException('Document can only be signed when status is APPROVED');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.SIGNED,
        signedDate: new Date(),
      },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.signed', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Activate document (SIGNED → ACTIVE)
   */
  async activate(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_ACTIVATE')) {
      throw new ForbiddenException('You do not have permission to activate documents');
    }

    const document = await this.findOne(id, user);

    // Only allow activate if status is SIGNED
    if (document.status !== DocumentStatus.SIGNED) {
      throw new BadRequestException('Document can only be activated when status is SIGNED');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.ACTIVE,
        effectiveDate: document.effectiveDate || new Date(),
      },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.activated', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Mark document as expired (ACTIVE → EXPIRED)
   */
  async expire(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to expire documents');
    }

    const document = await this.findOne(id, user);

    // Only allow expire if status is ACTIVE
    if (document.status !== DocumentStatus.ACTIVE) {
      throw new BadRequestException('Document can only be expired when status is ACTIVE');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.EXPIRED },
      include: this.documentInclude,
    });

    // Emit event
    this.eventEmitter.emit('document.expired', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Cron job: Check và nhắc nhở documents sắp hết hạn
   * Chạy mỗi ngày lúc 9:00 AM
   */
  @Cron('0 9 * * *')
  async checkExpiringDocuments(): Promise<void> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30); // Check documents expiring in 30 days

    const expiringDocuments = await this.prisma.document.findMany({
      where: {
        status: DocumentStatus.ACTIVE,
        expirationDate: {
          gte: today,
          lte: futureDate,
        },
        reminderSent: false,
      },
      include: this.documentInclude,
    });

    for (const document of expiringDocuments) {
      // Emit event for notification service
      this.eventEmitter.emit('document.expiring', {
        document,
        daysUntilExpiration: Math.ceil(
          (document.expirationDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ),
        timestamp: new Date(),
      });

      // Mark reminder as sent
      await this.prisma.document.update({
        where: { id: document.id },
        data: { reminderSent: true },
      });
    }
  }
}
