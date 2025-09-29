import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../identity/auth/auth.module';

/**
 * ReportModule - Module quản lý báo cáo và thống kê
 * 
 * Tính năng:
 * - Tạo báo cáo tổng hợp theo nhiều loại (MOU, Visa, Guest, Translation, Activity, Custom)
 * - Quản lý file báo cáo (tạo, tải xuống, xóa)
 * - Thống kê và phân tích dữ liệu
 * - Tích hợp với hệ thống RBAC và EventEmitter
 * - Hỗ trợ filtering, pagination, sorting
 * 
 * Dependencies:
 * - PrismaModule: Truy cập cơ sở dữ liệu
 * - AuthModule: Authentication và authorization với JwtService
 * - EventEmitterModule: Phát sự kiện báo cáo
 * 
 * Exports:
 * - ReportService: Để sử dụng trong các module khác nếu cần
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventEmitterModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}