import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternationalGuest } from '../../common/entities/international-guest.entity';
import { InternationalGuestService } from './international-guest.service';
import { InternationalGuestController } from './international-guest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InternationalGuest])],
  controllers: [InternationalGuestController],
  providers: [InternationalGuestService],
  exports: [InternationalGuestService],
})
export class InternationalGuestModule {}