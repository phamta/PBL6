import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationListener } from './notification.listener';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../identity/auth/auth.module';

/**
 * NotificationModule - Module quản lý thông báo và template
 * 
 * Features:
 * - Template management: Tạo, cập nhật, xóa notification template
 * - Notification sending: Gửi EMAIL, SYSTEM, SMS notifications
 * - Event-driven notifications: Auto-trigger từ events
 * - Logging: Track tất cả notification đã gửi
 * - User notifications: System notification cho từng user
 * - Statistics: Thống kê và báo cáo
 * - RBAC: Action-based permissions
 * 
 * Dependencies:
 * - PrismaModule: Database access cho NotificationTemplate, NotificationLog, UserNotification
 * - AuthModule: Authentication và authorization với JwtService
 * - EventEmitterModule: Event-driven architecture
 * 
 * Providers:
 * - NotificationService: Business logic
 * - NotificationListener: Event handlers
 * 
 * Controllers:
 * - NotificationController: REST API endpoints
 * 
 * Event Listeners:
 * - document.created → system notification for department officers
 * - document.expiring → email reminder for creator
 * - visa.created → system notification for department officers  
 * - visa.expiring → email reminder for holder & creator
 * - translation.approved → email confirmation for applicant
 * - translation.completed → email notification for applicant
 * - guest.created → system notification & email confirmation
 * - guest.visit_reminder → reminder notifications
 * - system.config.updated → admin notifications
 * - system.error → error alerts for admins
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventEmitterModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationListener,
  ],
  exports: [
    NotificationService,
  ],
})
export class NotificationModule {}