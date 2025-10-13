import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../identity/auth/auth.module';
import { RbacModule } from '../rbac/rbac.module'; // Thêm import này

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RbacModule, // Thêm để ActionGuard có thể sử dụng RbacService
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}