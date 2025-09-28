import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/auth/guards/roles.guard';
import { Roles } from '../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user.enum';
import { SpecialistService, SpecialistStats } from './specialist.service';
import {
  UpdateVisaStatusDto,
  CreateNA5DocumentDto,
  UpdateMOUStatusDto,
  AddMOUCommentDto,
  UpdateVisitorStatusDto,
  UpdateTranslationStatusDto,
  AddTranslationCommentDto,
} from './dto';

@Controller('specialist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SPECIALIST, UserRole.MANAGER) // Specialist và Manager đều có thể truy cập
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}

  // ===================
  // VISA ENDPOINTS
  // ===================

  @Get('visa')
  async getVisaApplications(@Request() req) {
    return await this.specialistService.getVisaApplications(req.user.id);
  }

  @Get('visa/:id')
  async getVisaApplication(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    return await this.specialistService.getVisaApplication(id, req.user.id);
  }

  @Patch('visa/:id/status')
  async updateVisaStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateVisaStatusDto,
    @Request() req,
  ) {
    return await this.specialistService.updateVisaStatus(id, req.user.id, updateDto);
  }

  @Post('visa/:id/na5')
  async createNA5Document(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createDto: CreateNA5DocumentDto,
    @Request() req,
  ) {
    return await this.specialistService.createNA5Document(id, req.user.id, createDto);
  }

  // ===================
  // MOU ENDPOINTS
  // ===================

  @Get('mou')
  async getMOUs(@Request() req) {
    return await this.specialistService.getMOUs(req.user.id);
  }

  @Patch('mou/:id/status')
  async updateMOUStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateMOUStatusDto,
    @Request() req,
  ) {
    return await this.specialistService.updateMOUStatus(id, req.user.id, updateDto);
  }

  @Post('mou/:id/comment')
  async addMOUComment(
    @Param('id') id: string,
    @Body() commentDto: AddMOUCommentDto,
    @Request() req,
  ) {
    return await this.specialistService.addMOUComment(id, req.user.id, commentDto);
  }

  // ===================
  // VISITOR ENDPOINTS
  // ===================

  @Get('visitor')
  async getVisitors(@Request() req) {
    return await this.specialistService.getVisitors(req.user.id);
  }

  @Get('visitor/:id')
  async getVisitor(
    @Param('id') id: string,
    @Request() req,
  ) {
    return await this.specialistService.getVisitor(id, req.user.id);
  }

  @Patch('visitor/:id/status')
  async updateVisitorStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateVisitorStatusDto,
    @Request() req,
  ) {
    return await this.specialistService.updateVisitorStatus(id, req.user.id, updateDto);
  }

  // ===================
  // TRANSLATION ENDPOINTS
  // ===================

  @Get('translation')
  async getTranslations(@Request() req) {
    return await this.specialistService.getTranslations(req.user.id);
  }

  @Patch('translation/:id/status')
  async updateTranslationStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateTranslationStatusDto,
    @Request() req,
  ) {
    return await this.specialistService.updateTranslationStatus(id, req.user.id, updateDto);
  }

  @Post('translation/:id/comment')
  async addTranslationComment(
    @Param('id') id: string,
    @Body() commentDto: AddTranslationCommentDto,
    @Request() req,
  ) {
    return await this.specialistService.addTranslationComment(id, req.user.id, commentDto);
  }

  // ===================
  // REPORTS ENDPOINT
  // ===================

  @Get('reports')
  async getSpecialistReports(@Request() req): Promise<SpecialistStats> {
    return await this.specialistService.getSpecialistReports(req.user.id);
  }
}
