import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiResponse, ResponseBuilder } from '../../common/dto/response.dto';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  version: string;
}

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async checkHealth(): Promise<ApiResponse<HealthStatus>> {
    const startTime = Date.now();
    
    try {
      // Check database connection
      await this.dataSource.query('SELECT 1');
      const dbResponseTime = Date.now() - startTime;
      
      // Get memory usage
      const memUsage = process.memoryUsage();
      const totalMem = memUsage.heapTotal;
      const usedMem = memUsage.heapUsed;
      
      const healthStatus: HealthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: 'connected',
          responseTime: dbResponseTime,
        },
        memory: {
          used: Math.round(usedMem / 1024 / 1024), // MB
          total: Math.round(totalMem / 1024 / 1024), // MB
          percentage: Math.round((usedMem / totalMem) * 100),
        },
        version: process.env.npm_package_version || '1.0.0',
      };
      
      return ResponseBuilder.success(healthStatus, 'System is healthy');
      
    } catch (error) {
      const healthStatus: HealthStatus = {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: 'disconnected',
        },
        memory: {
          used: 0,
          total: 0,
          percentage: 0,
        },
        version: process.env.npm_package_version || '1.0.0',
      };
      
      return ResponseBuilder.error('System health check failed', [error.message]);
    }
  }

  @Get('ping')
  ping(): ApiResponse<{ message: string }> {
    return ResponseBuilder.success(
      { message: 'pong' },
      'Service is responding'
    );
  }
}
