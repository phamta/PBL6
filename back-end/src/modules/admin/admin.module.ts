import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { UserRole } from '../user/entities/user-role.entity';
import { VisaApplication } from '../visa/entities/visa-application.entity';
import { SystemLog } from './entities/system-log.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, VisaApplication, SystemLog]),
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
