import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewerService } from './viewer.service';
import { ViewerController } from './viewer.controller';
import { VisaApplication } from '../visa/entities/visa-application.entity';
import { MOUApplication } from '../user/entities/mou-application.entity';
import { VisitorApplication } from '../user/entities/visitor-application.entity';
import { TranslationRequest } from '../user/entities/translation-request.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisaApplication,
      MOUApplication,
      VisitorApplication,
      TranslationRequest,
      User,
    ])
  ],
  controllers: [ViewerController],
  providers: [ViewerService],
  exports: [ViewerService],
})
export class ViewerModule {}
