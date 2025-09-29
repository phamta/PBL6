import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '../identity/auth/auth.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [
    // AuthModule để cung cấp JwtService cho guards
    AuthModule,
    // EventEmitter để gửi notifications và logging  
    EventEmitterModule,
  ],
  controllers: [GuestController],
  providers: [
    GuestService,
    PrismaService,
  ],
  exports: [
    GuestService,
  ],
})
export class GuestModule {}