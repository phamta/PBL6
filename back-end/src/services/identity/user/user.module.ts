import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserApplicationService } from './user-application.service';
import { UserController } from './user.controller';
import { UserApplicationController } from './user-application.controller';
import { 
  User, 
  Role, 
  UserRole,
  MOUApplication,
  VisitorApplication,
  TranslationRequest 
} from './entities';
import { VisaApplication, VisaHistory } from '../visa/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Role, 
      UserRole,
      VisaApplication,
      VisaHistory,
      MOUApplication,
      VisitorApplication,
      TranslationRequest
    ])
  ],
  controllers: [UserController, UserApplicationController],
  providers: [UserService, UserApplicationService],
  exports: [UserService, UserApplicationService],
})
export class UserModule {}
