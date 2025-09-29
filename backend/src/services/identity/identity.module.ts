import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UnitModule } from './unit/unit.module';
import { RbacModule } from '../rbac/rbac.module';
import { PrismaModule } from '../../database/prisma.module';

/**
 * Identity Module - Module tổng hợp cho Identity Service
 * Bao gồm Authentication, User Management và Unit Management
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    UnitModule,
    RbacModule,
  ],
  exports: [
    AuthModule,
    UserModule,
    UnitModule,
    RbacModule,
  ],
})
export class IdentityModule {}