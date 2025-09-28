import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Database Module - Module global cho Prisma service
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}