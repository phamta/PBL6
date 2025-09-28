import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { VisaApplication } from '../visa/entities/visa-application.entity';
import { VisaHistory } from '../visa/entities/visa-history.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisaApplication,
      VisaHistory,
      User,
    ]),
  ],
  controllers: [SpecialistController],
  providers: [SpecialistService],
  exports: [SpecialistService],
})
export class SpecialistModule {}
