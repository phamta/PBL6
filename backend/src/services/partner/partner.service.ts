import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Partner, Prisma } from '@prisma/client';

export interface PartnerWithRelations extends Partner {
  // Add any relations if needed
}

export interface PartnerListResult {
  partners: PartnerWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryPartnersDto {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  isActive?: boolean;
}

/**
 * Partner Service - Quản lý đối tác quốc tế
 *
 * Action permissions:
 * - PARTNER_READ: Xem danh sách đối tác
 * - PARTNER_CREATE: Tạo đối tác mới
 * - PARTNER_UPDATE: Cập nhật thông tin đối tác
 * - PARTNER_DELETE: Xóa đối tác
 */
@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách đối tác với pagination và filter
   */
  async getPartners(params?: QueryPartnersDto): Promise<PartnerListResult> {
    const {
      page = 1,
      limit = 10,
      search,
      country,
      isActive = true,
    } = params || {};

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PartnerWhereInput = {
      isActive,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    // Get total count
    const total = await this.prisma.partner.count({ where });

    // Get partners
    const partners = await this.prisma.partner.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      partners,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Lấy chi tiết đối tác theo ID
   */
  async getPartnerById(id: string): Promise<PartnerWithRelations> {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return partner;
  }

  /**
   * Lấy tất cả đối tác (không pagination) - dùng cho dropdown
   */
  async getAllPartners(): Promise<PartnerWithRelations[]> {
    return await this.prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}