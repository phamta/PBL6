import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
// import { VisaModule } from './modules/visa/visa.module';
// import { MouModule } from './modules/mou/mou.module';
// import { VisitorModule } from './modules/visitor/visitor.module';
// import { TranslationModule } from './modules/translation/translation.module';
import { TranslationRequestModule } from './modules/translation-request.module';
// import { ReportModule } from './modules/report/report.module';
// import { VisaExtensionModule } from './modules/visa-extension/visa-extension.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseSeederService } from './database/database-seeder.service';
import { DatabaseResetService } from './modules/database/database-reset.service';
import { DatabaseResetController } from './modules/database/database-reset.controller';
import { DebugController } from './debug/debug.controller';
import { User } from './modules/user/entities/user.entity';
// import { Mou } from './modules/mou/entities/mou.entity';
// import { VisaApplication } from './modules/visa/entities/visa-application.entity';
// import { Visitor } from './modules/visitor/entities/visitor.entity';
// import { Translation } from './modules/translation/entities/translation.entity';
import { TranslationRequest } from './entities/translation-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, TranslationRequest]),
    AuthModule,
    UserModule,
    // VisaModule,
    // MouModule,
    // VisitorModule,
    // TranslationModule,
    TranslationRequestModule,
    // ReportModule,
    // VisaExtensionModule,
  ],
  controllers: [DatabaseResetController, DebugController],
  providers: [DatabaseSeederService, DatabaseResetService],
})
export class AppModule {}
