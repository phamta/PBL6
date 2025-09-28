import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Guest Service - Quản lý đoàn khách quốc tế
 * UC006: Quản lý đoàn vào
 */
@Injectable()
export class GuestService {
  constructor(private prisma: PrismaService) {}

  /**
   * UC006: Đăng ký đoàn khách quốc tế
   */
  async registerGuest(createGuestDto: any, userId: string) {
    // Implementation here
    return { message: 'Đăng ký đoàn khách thành công' };
  }

  /**
   * Duyệt đoàn khách
   */
  async approveGuest(id: string, userId: string) {
    // Implementation here
    return { message: 'Duyệt đoàn khách thành công' };
  }

  // More methods...
}