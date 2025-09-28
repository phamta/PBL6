import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './services/identity/auth/auth.module';
import { UserModule } from './services/identity/user/user.module';
import { AdminModule } from './services/identity/admin/admin.module';
import { ManagerModule } from './services/identity/manager/manager.module';
import { SpecialistModule } from './services/specialist/specialist/specialist.module';
import { HealthModule } from './services/health/health/health.module';
import { InternationalGuestModule } from './services/guest/international-guest/international-guest.module';
import { TranslationCertificateModule } from './services/document/translation-certificate/translation-certificate.module';
import { SystemActivityLogModule } from './services/activity/system-activity-log/system-activity-log.module';
import { getConfig } from './config/app.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [getConfig],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    AdminModule,
    ManagerModule,
    SpecialistModule,
    HealthModule,
    InternationalGuestModule,
    TranslationCertificateModule,
    SystemActivityLogModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
