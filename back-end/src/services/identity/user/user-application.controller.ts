import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  Logger,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserApplicationService, UserStats } from './user-application.service';
import { ApiResponse, ResponseBuilder } from '../../../common/dto/response.dto';
import {
  CreateVisaApplicationDto,
  UpdateVisaApplicationDto,
  CreateMOUDto,
  UpdateMOUDto,
  CreateVisitorGroupDto,
  UpdateVisitorGroupDto,
  CreateTranslationRequestDto,
  UpdateTranslationRequestDto,
} from './dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user-applications')
export class UserApplicationController {
  private readonly logger = new Logger(UserApplicationController.name);

  constructor(
    private readonly userApplicationService: UserApplicationService,
  ) {}

  // ===================
  // DASHBOARD & STATISTICS
  // ===================

  @Get('dashboard')
  async getDashboard(@Request() req): Promise<ApiResponse<UserStats>> {
    try {
      this.logger.log(`Getting dashboard for user: ${req.user.userId}`);
      const stats = await this.userApplicationService.getUserStats(req.user.userId);
      return ResponseBuilder.success(stats, 'Dashboard data retrieved successfully');
    } catch (error) {
      this.logger.error(`Error getting dashboard for user ${req.user.userId}:`, error);
      throw error;
    }
  }

  // ===================
  // VISA MANAGEMENT
  // ===================

  @Post('visa-applications')
  async createVisaApplication(
    @Request() req,
    @Body(ValidationPipe) createDto: CreateVisaApplicationDto,
  ): Promise<ApiResponse> {
    try {
      this.logger.log(`Creating visa application for user: ${req.user.userId}`);
      const result = await this.userApplicationService.createVisaApplication(
        req.user.userId,
        createDto
      );
      return ResponseBuilder.success(result, 'Visa application created successfully');
    } catch (error) {
      this.logger.error(`Error creating visa application for user ${req.user.userId}:`, error);
      throw error;
    }
  }

  @Get('visa-applications')
  async getUserVisaApplications(@Request() req): Promise<ApiResponse> {
    try {
      this.logger.log(`Getting visa applications for user: ${req.user.userId}`);
      const applications = await this.userApplicationService.getUserVisaApplications(req.user.userId);
      return ResponseBuilder.success(applications, 'Visa applications retrieved successfully');
    } catch (error) {
      this.logger.error(`Error getting visa applications for user ${req.user.userId}:`, error);
      throw error;
    }
  }

  @Get('visa-applications/expiring/:days')
  async getExpiringVisas(
    @Request() req,
    @Param('days', ParseIntPipe) days: number,
  ) {
    return await this.userApplicationService.getUpcomingVisaExpirations(
      req.user.userId,
      days
    );
  }

  @Get('visa-applications/:id')
  async getVisaApplication(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.getUserVisaApplication(id, req.user.userId);
  }

  @Patch('visa-applications/:id')
  async updateVisaApplication(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateVisaApplicationDto,
  ) {
    return await this.userApplicationService.updateVisaApplication(
      id,
      req.user.userId,
      updateDto
    );
  }

  // ===================
  // MOU MANAGEMENT
  // ===================

  @Post('mou-applications')
  async createMOU(
    @Request() req,
    @Body(ValidationPipe) createDto: CreateMOUDto,
  ) {
    return await this.userApplicationService.createMOU(req.user.userId, createDto);
  }

  @Get('mou-applications')
  async getUserMOUs(@Request() req) {
    return await this.userApplicationService.getUserMOUs(req.user.userId);
  }

  @Get('mou-applications/:id')
  async getMOU(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.getUserMOU(id, req.user.userId);
  }

  @Patch('mou-applications/:id')
  async updateMOU(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateMOUDto,
  ) {
    return await this.userApplicationService.updateMOU(id, req.user.userId, updateDto);
  }

  @Patch('mou-applications/:id/submit')
  @HttpCode(HttpStatus.OK)
  async submitMOU(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.submitMOU(id, req.user.userId);
  }

  // ===================
  // VISITOR GROUP MANAGEMENT
  // ===================

  @Post('visitor-groups')
  async createVisitorGroup(
    @Request() req,
    @Body(ValidationPipe) createDto: CreateVisitorGroupDto,
  ) {
    return await this.userApplicationService.createVisitorGroup(req.user.userId, createDto);
  }

  @Get('visitor-groups')
  async getUserVisitorGroups(@Request() req) {
    return await this.userApplicationService.getUserVisitorGroups(req.user.userId);
  }

  @Get('visitor-groups/:id')
  async getVisitorGroup(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.getUserVisitorGroup(id, req.user.userId);
  }

  @Patch('visitor-groups/:id')
  async updateVisitorGroup(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateVisitorGroupDto,
  ) {
    return await this.userApplicationService.updateVisitorGroup(
      id,
      req.user.userId,
      updateDto
    );
  }

  @Patch('visitor-groups/:id/submit')
  @HttpCode(HttpStatus.OK)
  async submitVisitorGroup(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.submitVisitorGroup(id, req.user.userId);
  }

  // ===================
  // TRANSLATION REQUEST MANAGEMENT
  // ===================

  @Post('translation-requests')
  async createTranslationRequest(
    @Request() req,
    @Body(ValidationPipe) createDto: CreateTranslationRequestDto,
  ) {
    return await this.userApplicationService.createTranslationRequest(
      req.user.userId,
      createDto
    );
  }

  @Get('translation-requests')
  async getUserTranslationRequests(@Request() req) {
    return await this.userApplicationService.getUserTranslationRequests(req.user.userId);
  }

  @Get('translation-requests/:id')
  async getTranslationRequest(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.getUserTranslationRequest(id, req.user.userId);
  }

  @Patch('translation-requests/:id')
  async updateTranslationRequest(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateTranslationRequestDto,
  ) {
    return await this.userApplicationService.updateTranslationRequest(
      id,
      req.user.userId,
      updateDto
    );
  }

  @Patch('translation-requests/:id/submit')
  @HttpCode(HttpStatus.OK)
  async submitTranslationRequest(@Request() req, @Param('id') id: string) {
    return await this.userApplicationService.submitTranslationRequest(id, req.user.userId);
  }
}
