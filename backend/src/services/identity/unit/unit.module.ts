import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { PrismaModule } from '../../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';

/**
 * Unit Module - Module quản lý units/đơn vị
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitModule {}