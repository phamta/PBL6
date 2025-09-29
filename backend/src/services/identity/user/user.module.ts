import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';

/**
 * User Module - Module quản lý users
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}