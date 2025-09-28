import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { SystemActivityLogService } from './system-activity-log.service';

@Controller('system-activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemActivityLogController {
  constructor(private readonly systemActivityLogService: SystemActivityLogService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.systemActivityLogService.findAll(+page, +limit);
  }

  @Get('by-user/:userId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST, UserRole.VIEWER)
  findByUser(
    @Query('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.systemActivityLogService.findByUser(+userId, +page, +limit);
  }
}