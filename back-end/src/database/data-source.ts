import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../modules/user/entities/role.entity';
import { Mou, MouDocument, MouHistory } from '../modules/mou/entities/mou.entity';
import { VisaApplication, VisaDocument, VisaHistory, VisaReminder } from '../modules/visa/entities/visa-application.entity';
import { VisitorGroup, VisitorMember, VisitorReport } from '../modules/visitor/entities/visitor.entity';
import { TranslationRequest, TranslationFile, TranslationHistory } from '../modules/translation/entities/translation.entity';
import { VisaExtension } from '../modules/visa-extension/entities/visa-extension.entity';
import { VisaExtensionHistory } from '../modules/visa-extension/entities/visa-extension-history.entity';
import { VisaExtensionDocument } from '../modules/visa-extension/entities/visa-extension-document.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    User,
    Role,
    Mou,
    MouDocument,
    MouHistory,
    VisaApplication,
    VisaDocument, 
    VisaHistory,
    VisaReminder,
    VisitorGroup,
    VisitorMember,
    VisitorReport,
    TranslationRequest,
    TranslationFile,
    TranslationHistory,
    VisaExtension,
    VisaExtensionHistory,
    VisaExtensionDocument,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: true,
  logging: true,
});
