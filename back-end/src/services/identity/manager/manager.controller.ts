import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { ManagerService } from './manager.service';
import { 
  ApproveVisaDto, 
  ApproveMouDto, 
  ApproveVisitorDto, 
  ApproveTranslationDto,
  RejectRequestDto, 
  SendInstructionDto 
} from './dto';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANAGER)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  // =============== DASHBOARD ===============
  
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.managerService.getDashboardStats();
  }

  // =============== QUẢN LÝ VISA ===============
  
  @Get('visa')
  async getVisaApplicationsForReview(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.managerService.getVisaApplicationsForReview(page, limit);
  }

  @Get('visa/:id')
  async getVisaDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.managerService.getVisaDetails(id);
  }

  @Patch('visa/:id/approve')
  async approveVisa(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveDto: ApproveVisaDto,
    @Request() req: any,
  ) {
    return this.managerService.approveVisa(id, approveDto, req.user.id);
  }

  @Patch('visa/:id/reject')
  async rejectVisa(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rejectDto: RejectRequestDto,
    @Request() req: any,
  ) {
    return this.managerService.rejectVisa(id, rejectDto, req.user.id);
  }

  @Get('visa/expiring/:days')
  async getExpiringVisas(@Param('days') days: number = 30) {
    return this.managerService.getExpiringVisas(days);
  }

  @Get('visa/statistics')
  async getVisaStatistics() {
    return this.managerService.getVisaStatistics();
  }

  // =============== QUẢN LÝ MOU ===============
  
  @Get('mou')
  async getMouApplicationsForReview(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.managerService.getMouApplicationsForReview(page, limit);
  }

  // TODO: Add MOU approval/rejection endpoints when MOU entity is ready

  // =============== QUẢN LÝ VISITOR GROUP ===============
  
  @Get('visitor')
  async getVisitorGroupsForReview(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.managerService.getVisitorGroupsForReview(page, limit);
  }

  // TODO: Add Visitor Group approval/rejection endpoints when entity is ready

  // =============== QUẢN LÝ TRANSLATION ===============
  
  @Get('translation')
  async getTranslationRequestsForReview(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.managerService.getTranslationRequestsForReview(page, limit);
  }

  // TODO: Add Translation approval/rejection endpoints when entity is ready

  // =============== CHỈ ĐẠO & THÔNG BÁO ===============
  
  @Post('instructions')
  async sendInstruction(
    @Body() instructionDto: SendInstructionDto,
    @Request() req: any,
  ) {
    return this.managerService.sendInstruction(instructionDto, req.user.id);
  }

  @Get('instructions')
  async getInstructionHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.managerService.getInstructionHistory(page, limit);
  }

  @Get('specialists')
  async getSpecialists() {
    return this.managerService.getSpecialists();
  }

  // =============== BÁOÁO & THỐNG KÊ ===============
  
  @Get('reports')
  async getReports() {
    return this.managerService.getDashboardStats();
  }
}
