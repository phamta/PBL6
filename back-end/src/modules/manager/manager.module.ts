import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { User } from '../user/entities/user.entity';
import { VisaApplication } from '../visa/entities/visa-application.entity';
import { VisaHistory } from '../visa/entities/visa-history.entity';
import { ManagerInstruction } from './entities/manager-instruction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      VisaApplication,
      VisaHistory,
      ManagerInstruction,
    ]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
