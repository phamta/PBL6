import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get application info' })
  @ApiResponse({ status: 200, description: 'Application info retrieved successfully' })
  getHello(): object {
    return {
      message: 'Hệ thống Quản lý Hợp tác Quốc tế - ĐHBK Đà Nẵng',
      version: '1.0.0',
      status: 'running'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  healthCheck(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Identity Service',
      database: 'connected',
      uptime: process.uptime()
    };
  }
}