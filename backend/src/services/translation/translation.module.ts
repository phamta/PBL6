import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../identity/auth/auth.module';

/**
 * Translation Module - Module quản lý translation requests
 * 
 * Features:
 * - Translation CRUD operations
 * - Workflow management: PENDING → APPROVED → COMPLETED
 * - File handling: originalFile, translatedFile, certificationFile
 * - RBAC với action-based permissions
 * - Event-driven notifications
 * - Statistics và reporting
 * 
 * Dependencies:
 * - PrismaModule: Database access
 * - AuthModule: Authentication và authorization
 * - EventEmitterModule: Event-driven architecture
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventEmitterModule,
  ],
  controllers: [TranslationController],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}