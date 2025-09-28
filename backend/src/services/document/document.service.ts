import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus, DocumentType } from '@prisma/client';

/**
 * Document Service - Xử lý quản lý MOU và văn bản hợp tác
 * UC002: Khởi tạo đề xuất MOU
 * UC003: Duyệt MOU
 */
@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  /**
   * UC002: Tạo đề xuất MOU mới
   */
  async create(createDocumentDto: CreateDocumentDto, userId: string) {
    const document = await this.prisma.document.create({
      data: {
        ...createDocumentDto,
        signedDate: createDocumentDto.signedDate ? new Date(createDocumentDto.signedDate) : null,
        effectiveDate: createDocumentDto.effectiveDate ? new Date(createDocumentDto.effectiveDate) : null,
        expirationDate: createDocumentDto.expirationDate ? new Date(createDocumentDto.expirationDate) : null,
        createdById: userId,
        status: DocumentStatus.DRAFT,
      },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return {
      message: 'Tạo đề xuất MOU thành công',
      document,
    };
  }

  /**
   * Lấy danh sách documents với phân trang và lọc
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: DocumentStatus,
    type?: DocumentType,
    partnerCountry?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (partnerCountry) {
      where.partnerCountry = {
        contains: partnerCountry,
        mode: 'insensitive',
      };
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
          approvedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      documents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết một document
   */
  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        approvedBy: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy văn bản');
    }

    return document;
  }

  /**
   * Cập nhật document
   */
  async update(id: string, updateDocumentDto: UpdateDocumentDto, userId: string) {
    const document = await this.findOne(id);

    // Kiểm tra quyền sửa
    if (document.createdById !== userId && document.status !== DocumentStatus.DRAFT) {
      throw new ForbiddenException('Không có quyền sửa văn bản này');
    }

    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        ...updateDocumentDto,
        signedDate: updateDocumentDto.signedDate ? new Date(updateDocumentDto.signedDate) : undefined,
        effectiveDate: updateDocumentDto.effectiveDate ? new Date(updateDocumentDto.effectiveDate) : undefined,
        expirationDate: updateDocumentDto.expirationDate ? new Date(updateDocumentDto.expirationDate) : undefined,
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

    return {
      message: 'Cập nhật văn bản thành công',
      document: updatedDocument,
    };
  }

  /**
   * UC003: Duyệt MOU
   */
  async approve(id: string, userId: string) {
    const document = await this.findOne(id);

    if (document.status !== DocumentStatus.SUBMITTED && document.status !== DocumentStatus.REVIEWING) {
      throw new ForbiddenException('Văn bản không ở trạng thái chờ duyệt');
    }

    const approvedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.APPROVED,
        approvedById: userId,
        approvedAt: new Date(),
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

    return {
      message: 'Duyệt MOU thành công',
      document: approvedDocument,
    };
  }

  /**
   * Từ chối MOU
   */
  async reject(id: string, userId: string, reason?: string) {
    const document = await this.findOne(id);

    if (document.status !== DocumentStatus.SUBMITTED && document.status !== DocumentStatus.REVIEWING) {
      throw new ForbiddenException('Văn bản không ở trạng thái chờ duyệt');
    }

    const rejectedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.DRAFT,
        approvedById: userId,
        approvedAt: new Date(),
        // Có thể thêm field reason nếu cần
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

    return {
      message: 'Từ chối MOU thành công',
      document: rejectedDocument,
      reason,
    };
  }

  /**
   * Nộp MOU để duyệt
   */
  async submit(id: string, userId: string) {
    const document = await this.findOne(id);

    if (document.createdById !== userId) {
      throw new ForbiddenException('Không có quyền nộp văn bản này');
    }

    if (document.status !== DocumentStatus.DRAFT) {
      throw new ForbiddenException('Văn bản không ở trạng thái nháp');
    }

    const submittedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.SUBMITTED,
      },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return {
      message: 'Nộp MOU để duyệt thành công',
      document: submittedDocument,
    };
  }

  /**
   * Xóa document
   */
  async remove(id: string, userId: string) {
    const document = await this.findOne(id);

    if (document.createdById !== userId && document.status !== DocumentStatus.DRAFT) {
      throw new ForbiddenException('Không có quyền xóa văn bản này');
    }

    await this.prisma.document.delete({
      where: { id },
    });

    return {
      message: `Đã xóa văn bản: ${document.title}`,
    };
  }

  /**
   * Lấy documents sắp hết hạn (cho notification service)
   */
  async getExpiringDocuments(daysBeforeExpiration: number = 30) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysBeforeExpiration);

    return await this.prisma.document.findMany({
      where: {
        status: DocumentStatus.ACTIVE,
        expirationDate: {
          lte: expirationDate,
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
  }

  /**
   * Đánh dấu đã gửi nhắc nhở
   */
  async markReminderSent(id: string) {
    await this.prisma.document.update({
      where: { id },
      data: { reminderSent: true },
    });
  }

  /**
   * Thống kê documents
   */
  async getDocumentStats() {
    const [
      totalDocuments,
      activeDocuments,
      draftDocuments,
      expiredDocuments,
      statusStats,
      typeStats,
    ] = await Promise.all([
      this.prisma.document.count(),
      this.prisma.document.count({ where: { status: DocumentStatus.ACTIVE } }),
      this.prisma.document.count({ where: { status: DocumentStatus.DRAFT } }),
      this.prisma.document.count({ where: { status: DocumentStatus.EXPIRED } }),
      this.prisma.document.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.document.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
    ]);

    return {
      summary: {
        totalDocuments,
        activeDocuments,
        draftDocuments,
        expiredDocuments,
      },
      statusDistribution: statusStats.map((stat) => ({
        status: stat.status,
        count: stat._count.id,
      })),
      typeDistribution: typeStats.map((stat) => ({
        type: stat.type,
        count: stat._count.id,
      })),
    };
  }
}