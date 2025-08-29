import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisaExtensionService } from './visa-extension.service';
import { VisaExtensionController } from './visa-extension.controller';
import { VisaExtensionDocumentService } from './visa-extension-document.service';
import { VisaExtension } from './entities/visa-extension.entity';
import { VisaExtensionDocument } from './entities/visa-extension-document.entity';
import { VisaExtensionHistory } from './entities/visa-extension-history.entity';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisaExtension,
      VisaExtensionDocument,
      VisaExtensionHistory,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [VisaExtensionController],
  providers: [
    VisaExtensionService,
    VisaExtensionDocumentService,
    EmailService,
    NotificationService,
  ],
  exports: [VisaExtensionService, VisaExtensionDocumentService],
})
export class VisaExtensionModule {}
