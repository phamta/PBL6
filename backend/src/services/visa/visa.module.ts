import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../identity/auth/auth.module';
import { VisaController } from './visa.controller';
import { VisaService } from './visa.service';
import { VisaSchedulerService } from './visa-scheduler.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [
    // AuthModule để cung cấp JwtService cho guards
    AuthModule,
    // EventEmitter để gửi notifications và logging  
    EventEmitterModule,
    // Schedule module cho cronjobs
    ScheduleModule.forRoot(),
  ],
  controllers: [VisaController],
  providers: [
    VisaService,
    VisaSchedulerService,
    PrismaService,
  ],
  exports: [
    VisaService,
    VisaSchedulerService,
  ],
})
export class VisaModule {}