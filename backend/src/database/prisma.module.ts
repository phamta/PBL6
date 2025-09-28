import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma Module - Quản lý kết nối database
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}