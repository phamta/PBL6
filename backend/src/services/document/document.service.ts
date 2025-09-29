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
  };
  approvedBy?: {
    id: string;
    fullName: string;
    email: string;
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

  // ==================== CRUD Operations ====================

  /**
   * Tạo document mới với trạng thái DRAFT
   */
  async create(createDocumentDto: CreateDocumentDto, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_CREATE')) {
      throw new ForbiddenException('You do not have permission to create documents');
    }

    const document = await this.prisma.document.create({
      data: {
        ...createDocumentDto,
        status: DocumentStatus.DRAFT,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
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
   * Lấy danh sách documents với filter và pagination
   */
  async findAll(filterDto: FilterDocumentDto, user: DocumentUser): Promise<PaginatedDocuments> {
    if (!user.actions.includes('DOCUMENT_READ')) {
      throw new ForbiddenException('You do not have permission to view documents');
    }

    const { 
      page = 1, 
      limit = 10, 
      status, 
      type, 
      partnerName, 
      partnerCountry, 
      year
    } = filterDto;

    // Build where clause with permission-based filtering
    const where: Prisma.DocumentWhereInput = {};

    // Permission-based filtering
    if (!user.actions.includes('DOCUMENT_READ_ALL')) {
      if (user.actions.includes('DOCUMENT_READ_UNIT') && user.unitId) {
        // Can view documents from same unit
        where.OR = [
          { createdById: user.id },
          { createdBy: { unitId: user.unitId } }
        ];
      } else {
        // Can only view own documents
        where.createdById = user.id;
      }
    }

    // Apply filters
    if (status) where.status = status;
    if (type) where.type = type;
    if (partnerName) where.partnerName = { contains: partnerName, mode: 'insensitive' };
    if (partnerCountry) where.partnerCountry = { contains: partnerCountry, mode: 'insensitive' };
    if (year) {
      where.createdAt = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: Math.min(limit, 100), // Max 100 items per page
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
    if (!user.actions.includes('DOCUMENT_READ')) {
      throw new ForbiddenException('You do not have permission to view document statistics');
    }

    // Build permission-based where clause
    const baseWhere: Prisma.DocumentWhereInput = {};
    if (!user.actions.includes('DOCUMENT_READ_ALL')) {
      if (user.actions.includes('DOCUMENT_READ_UNIT') && user.unitId) {
        baseWhere.OR = [
          { createdById: user.id },
          { createdBy: { unitId: user.unitId } }
        ];
      } else {
        baseWhere.createdById = user.id;
      }
    }

    const [
      totalDocuments,
      statusStats,
      typeStats,
      expiringDocuments,
      myDocuments
    ] = await Promise.all([
      this.prisma.document.count({ where: baseWhere }),
      
      this.prisma.document.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { status: true },
      }),
      
      this.prisma.document.groupBy({
        by: ['type'],
        where: baseWhere,
        _count: { type: true },
      }),
      
      this.prisma.document.count({
        where: {
          ...baseWhere,
          status: DocumentStatus.ACTIVE,
          expirationDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            gte: new Date(),
          },
        },
      }),
      
      this.prisma.document.count({
        where: { createdById: user.id },
      }),
    ]);

    const byStatus = statusStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    const byType = typeStats.reduce((acc, stat) => {
      acc[stat.type] = stat._count.type;
      return acc;
    }, {} as Record<string, number>);

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
    if (!user.actions.includes('DOCUMENT_READ')) {
      throw new ForbiddenException('You do not have permission to view documents');
    }

    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Check permission to view this specific document
    if (!user.actions.includes('DOCUMENT_READ_ALL')) {
      if (user.actions.includes('DOCUMENT_READ_UNIT') && user.unitId) {
        // Can view documents from same unit or own documents
        const canView = document.createdById === user.id || 
                       (document.createdBy as any).unitId === user.unitId;
        if (!canView) {
          throw new ForbiddenException('You do not have permission to view this document');
        }
      } else {
        // Can only view own documents
        if (document.createdById !== user.id) {
          throw new ForbiddenException('You do not have permission to view this document');
        }
      }
    }

    return document;
  }

  /**
   * Cập nhật document (chỉ khi status = DRAFT và là creator)
   */
  async update(id: string, updateDocumentDto: UpdateDocumentDto, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_UPDATE')) {
      throw new ForbiddenException('You do not have permission to update documents');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT documents can be updated');
    }

    if (document.createdById !== user.id) {
      throw new ForbiddenException('You can only update your own documents');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Emit event
    this.eventEmitter.emit('document.updated', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Hủy document (DRAFT hoặc SUBMITTED)
   */
  async cancel(id: string, user: DocumentUser): Promise<void> {
    if (!user.actions.includes('DOCUMENT_DELETE')) {
      throw new ForbiddenException('You do not have permission to cancel documents');
    }

    const document = await this.findOne(id, user);

    const allowedStatuses = [DocumentStatus.DRAFT, DocumentStatus.SUBMITTED];
    if (!allowedStatuses.includes(document.status as any)) {
      throw new BadRequestException('Only DRAFT or SUBMITTED documents can be cancelled');
    }

    if (document.createdById !== user.id && !user.actions.includes('DOCUMENT_DELETE_ALL')) {
      throw new ForbiddenException('You can only cancel your own documents');
    }

    await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.CANCELLED,
        updatedAt: new Date(),
      },
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
    if (!user.actions.includes('DOCUMENT_CREATE')) {
      throw new ForbiddenException('You do not have permission to submit documents');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT documents can be submitted');
    }

    if (document.createdById !== user.id) {
      throw new ForbiddenException('You can only submit your own documents');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.SUBMITTED,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
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
   * Bắt đầu review process (SUBMITTED  REVIEWING)
   */
  async startReview(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_UPDATE')) {
      throw new ForbiddenException('You do not have permission to start document review');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.SUBMITTED) {
      throw new BadRequestException('Only SUBMITTED documents can be reviewed');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.REVIEWING,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.eventEmitter.emit('document.reviewing', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Approve document (REVIEWING  APPROVED)
   */
  async approve(id: string, approveDto: ApproveDocumentDto, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to approve documents');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.REVIEWING) {
      throw new BadRequestException('Only REVIEWING documents can be approved');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.APPROVED,
        approvedById: user.id,
        approvedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.eventEmitter.emit('document.approved', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Reject document (REVIEWING  DRAFT)
   */
  async reject(id: string, rejectDto: ApproveDocumentDto, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to reject documents');
    }

    const document = await this.findOne(id, user);

    const allowedStatuses = [DocumentStatus.SUBMITTED, DocumentStatus.REVIEWING, DocumentStatus.APPROVED];
    if (!allowedStatuses.includes(document.status as any)) {
      throw new BadRequestException('Only SUBMITTED, REVIEWING, or APPROVED documents can be rejected');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.DRAFT,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.eventEmitter.emit('document.rejected', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Sign document (APPROVED  SIGNED)
   */
  async sign(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to sign documents');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.APPROVED) {
      throw new BadRequestException('Only APPROVED documents can be signed');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.SIGNED,
        signedDate: new Date(),
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.eventEmitter.emit('document.signed', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Activate document (SIGNED  ACTIVE)
   */
  async activate(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_ACTIVATE')) {
      throw new ForbiddenException('You do not have permission to activate documents');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.SIGNED) {
      throw new BadRequestException('Only SIGNED documents can be activated');
    }

    const updateData: any = { 
      status: DocumentStatus.ACTIVE,
      updatedAt: new Date(),
    };

    if (!document.effectiveDate) {
      updateData.effectiveDate = new Date();
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.eventEmitter.emit('document.activated', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Mark document as expired (ACTIVE  EXPIRED)
   */
  async expire(id: string, user: DocumentUser): Promise<DocumentWithRelations> {
    if (!user.actions.includes('DOCUMENT_APPROVE')) {
      throw new ForbiddenException('You do not have permission to expire documents');
    }

    const document = await this.findOne(id, user);

    if (document.status !== DocumentStatus.ACTIVE) {
      throw new BadRequestException('Only ACTIVE documents can be expired');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: { 
        status: DocumentStatus.EXPIRED,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.eventEmitter.emit('document.expired', {
      document: updatedDocument,
      user,
      timestamp: new Date(),
    });

    return updatedDocument;
  }

  /**
   * Check for expiring documents and send notifications
   * Runs daily at 9:00 AM
   */
  @Cron('0 9 * * *')
  async checkExpiringDocuments(): Promise<void> {
    console.log('Running daily check for expiring documents...');

    const expiringIn30Days = await this.prisma.document.findMany({
      where: {
        status: DocumentStatus.ACTIVE,
        expirationDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          gte: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const expiringIn7Days = await this.prisma.document.findMany({
      where: {
        status: DocumentStatus.ACTIVE,
        expirationDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          gte: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const expiredDocuments = await this.prisma.document.findMany({
      where: {
        status: DocumentStatus.ACTIVE,
        expirationDate: {
          lt: new Date(),
        },
      },
    });

    if (expiringIn30Days.length > 0) {
      this.eventEmitter.emit('documents.expiring.30days', {
        documents: expiringIn30Days,
        timestamp: new Date(),
      });
    }

    if (expiringIn7Days.length > 0) {
      this.eventEmitter.emit('documents.expiring.7days', {
        documents: expiringIn7Days,
        timestamp: new Date(),
      });
    }

    if (expiredDocuments.length > 0) {
      await this.prisma.document.updateMany({
        where: {
          id: { in: expiredDocuments.map(d => d.id) },
        },
        data: {
          status: DocumentStatus.EXPIRED,
        },
      });

      this.eventEmitter.emit('documents.auto.expired', {
        count: expiredDocuments.length,
        documentIds: expiredDocuments.map(d => d.id),
        timestamp: new Date(),
      });

      console.log(`Auto-expired ${expiredDocuments.length} overdue documents`);
    }

    console.log(`Expiring documents check completed: ${expiringIn30Days.length} in 30 days, ${expiringIn7Days.length} in 7 days, ${expiredDocuments.length} auto-expired`);
  }
}
