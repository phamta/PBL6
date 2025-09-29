import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../identity/auth/auth.module';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from '../../database/prisma.service';

/**
 * Document Module - Quản lý MOU và quy trình duyệt văn bản (RBAC-enabled)
 * 
 * Module này cung cấp:
 * - Quản lý đề xuất MOU với action-based permissions
 * - Quy trình duyệt linh hoạt theo roles/permissions
 * - Workflow: DRAFT → SUBMITTED → REVIEWING → APPROVED → SIGNED → ACTIVE
 * - Thống kê và báo cáo dựa trên quyền hạn
 * - Hệ thống nhắc nhở hết hạn
 * - Event-driven notification integration
 * - Permission-based access control với @RequireAction decorators
 */
@Module({
  imports: [
    // AuthModule để cung cấp JwtService cho guards
    AuthModule,
    // EventEmitter để gửi notifications và logging
    EventEmitterModule,
    // Schedule module cho cronjobs
    ScheduleModule.forRoot(),
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    PrismaService,
  ],
  exports: [
    DocumentService,
    // Export service để các module khác có thể sử dụng
    // Ví dụ: NotificationService có thể listen events
    // ReportService có thể query documents
  ],
})
export class DocumentModule {}