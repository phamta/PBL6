import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LoggingService } from './services/logging.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { UserRole } from '../user/entities/user-role.entity';
import { VisaApplication } from '../visa/entities/visa-application.entity';
import { SystemLog } from './entities/system-log.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Role, 
      UserRole, 
      VisaApplication, 
      SystemLog,
      SystemSettings,
    ]),
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, LoggingService],
  exports: [AdminService, LoggingService],
})
export class AdminModule {}
