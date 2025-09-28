import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemActivityLog } from '../../common/entities/system-activity-log.entity';
import { SystemActivityLogService } from './system-activity-log.service';
import { SystemActivityLogController } from './system-activity-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemActivityLog])],
  controllers: [SystemActivityLogController],
  providers: [SystemActivityLogService],
  exports: [SystemActivityLogService],
})
export class SystemActivityLogModule {}