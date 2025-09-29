import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Database
import { DatabaseModule } from './database/database.module';

// Config
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

// Common
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// Controllers
import { AppController } from './app.controller';

// Services  
import { IdentityModule } from './services/identity/identity.module';
import { DocumentModule } from './services/document/document.module';
import { VisaModule } from './services/visa/visa.module';
import { GuestModule } from './services/guest/guest.module';
import { TranslationModule } from './services/translation/translation.module';
import { NotificationModule } from './services/notification/notification.module';
import { ReportModule } from './services/report/report.module';
// Import other service modules here when they're complete

/**
 * Root Application Module
 * Tích hợp tất cả services theo kiến trúc SOA
 */
@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Schedule and Events
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),

    // Business Services
    IdentityModule,
    DocumentModule,
    VisaModule,
    GuestModule,
    TranslationModule,
    NotificationModule,
    ReportModule,

    // TODO: Add other service modules:
    // SystemConfigModule,
    // ActivityModule,
  ],
  controllers: [AppController],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global Response Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}