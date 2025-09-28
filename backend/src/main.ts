import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Khởi tạo ứng dụng NestJS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng')
    .setDescription(`
      ## API Documentation for International Cooperation Management System
      
      **Chức năng chính:**
      - 🔐 Authentication & Authorization (JWT)
      - 📄 Quản lý MOU và văn bản hợp tác (UC002, UC003)
      - 🛂 Quản lý Visa và gia hạn (UC004, UC005)
      - 🌐 Quản lý đoàn khách quốc tế (UC006)
      - 📋 Xác nhận bản dịch (UC007)
      - 📊 Thống kê và báo cáo (UC008)
      - ⚙️ Cấu hình hệ thống (UC009)
      - 📧 Thông báo và nhắc hạn tự động
      - 📝 Ghi log hoạt động người dùng
      
      **Roles:**
      - SYSTEM_ADMIN: Quản trị hệ thống
      - DEPARTMENT_OFFICER: Cán bộ phòng KHCN&ĐN
      - LEADERSHIP: Lãnh đạo
      - FACULTY_STAFF: Cán bộ khoa/viện
      - STUDENT: Sinh viên
    `)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer(process.env.API_URL || 'http://localhost:3001', 'Development')
    .addTag('Authentication', 'Đăng nhập, đăng ký, quản lý phiên')
    .addTag('User Management', 'Quản lý người dùng')
    .addTag('Document Management', 'Quản lý MOU và văn bản hợp tác')
    .addTag('Visa Management', 'Quản lý Visa và gia hạn')
    .addTag('Guest Management', 'Quản lý đoàn khách quốc tế')
    .addTag('Translation Management', 'Quản lý xác nhận bản dịch')
    .addTag('Report Management', 'Thống kê và báo cáo')
    .addTag('System Configuration', 'Cấu hình hệ thống')
    .addTag('Notifications', 'Thông báo và nhắc hạn')
    .addTag('Activity Logs', 'Ghi log hoạt động')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Start server
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
  🚀 Hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng
  📍 Server đang chạy tại: http://localhost:${port}
  📚 API Documentation: http://localhost:${port}/api/docs
  🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Check DATABASE_URL'}
  🔧 Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap().catch((error) => {
  console.error('❌ Lỗi khởi tạo ứng dụng:', error);
  process.exit(1);
});