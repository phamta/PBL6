import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { VisaStatus } from '@prisma/client';

/**
 * Visa Service - Quản lý visa và gia hạn
 * UC004: Thông báo tự động gia hạn visa
 * UC005: Gia hạn visa
 */
@Injectable()
export class VisaService {
  constructor(private prisma: PrismaService) {}

  /**
   * UC004: Lấy danh sách visa sắp hết hạn
   */
  async getExpiringVisas(daysBeforeExpiration: number = 30) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysBeforeExpiration);

    return await this.prisma.visa.findMany({
      where: {
        status: VisaStatus.ACTIVE,
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
   * UC005: Tạo yêu cầu gia hạn visa
   */
  async createExtension(visaId: string, newExpirationDate: Date, reason: string) {
    const visa = await this.prisma.visa.findUnique({
      where: { id: visaId },
    });

    if (!visa) {
      throw new Error('Không tìm thấy visa');
    }

    const extension = await this.prisma.visaExtension.create({
      data: {
        visaId,
        newExpirationDate,
        reason,
        status: 'PENDING',
      },
      include: {
        visa: true,
      },
    });

    return {
      message: 'Tạo yêu cầu gia hạn visa thành công',
      extension,
    };
  }

  /**
   * Duyệt gia hạn visa
   */
  async approveExtension(extensionId: string, userId: string) {
    const extension = await this.prisma.visaExtension.findUnique({
      where: { id: extensionId },
      include: { visa: true },
    });

    if (!extension) {
      throw new Error('Không tìm thấy yêu cầu gia hạn');
    }

    // Cập nhật extension
    const updatedExtension = await this.prisma.visaExtension.update({
      where: { id: extensionId },
      data: {
        status: 'APPROVED',
      },
    });

    // Cập nhật visa
    await this.prisma.visa.update({
      where: { id: extension.visaId },
      data: {
        expirationDate: extension.newExpirationDate,
        status: VisaStatus.EXTENDED,
      },
    });

    return {
      message: 'Duyệt gia hạn visa thành công',
      extension: updatedExtension,
    };
  }

  /**
   * Sinh công văn NA5/NA6 (placeholder)
   */
  async generateOfficialDocument(extensionId: string, type: 'NA5' | 'NA6') {
    // TODO: Implement document generation logic
    return {
      message: `Sinh công văn ${type} thành công`,
      filePath: `/documents/${type}_${extensionId}.pdf`,
    };
  }

  // Thêm các methods khác...
}