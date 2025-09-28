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

// Services
import { IdentityModule } from './services/identity/identity.module';
import { DocumentModule } from './services/document/document.module';
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

    // TODO: Add other service modules:
    // VisaModule,
    // GuestModule,
    // TranslationModule,
    // ReportModule,
    // SystemConfigModule,
    // NotificationModule,
    // ActivityModule,
  ],
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