import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ViewerService, DashboardStats } from './viewer.service';
import {
  MOUFilterDto,
  VisitorFilterDto,
  TranslationFilterDto,
  VisaStatisticsDto,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('viewer')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  // ===================
  // DASHBOARD
  // ===================

  @Get('dashboard')
  async getDashboard(): Promise<DashboardStats> {
    return await this.viewerService.getDashboardStats();
  }

  // ===================
  // MOU QUERIES
  // ===================

  @Get('mou')
  async getMOUs(@Query(ValidationPipe) filterDto: MOUFilterDto) {
    return await this.viewerService.getMOUs(filterDto);
  }

  @Get('mou/:id')
  async getMOUById(@Param('id') id: string) {
    const mou = await this.viewerService.getMOUById(id);
    if (!mou) {
      throw new NotFoundException('MOU not found or not approved');
    }
    return mou;
  }

  // ===================
  // VISA QUERIES
  // ===================

  @Get('visa/statistics')
  async getVisaStatistics(@Query(ValidationPipe) filterDto: VisaStatisticsDto) {
    return await this.viewerService.getVisaStatistics(filterDto);
  }

  @Get('visa/expiring')
  async getExpiringVisas(
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return await this.viewerService.getExpiringVisas(days || 30);
  }

  // ===================
  // VISITOR QUERIES
  // ===================

  @Get('visitor')
  async getVisitors(@Query(ValidationPipe) filterDto: VisitorFilterDto) {
    return await this.viewerService.getVisitors(filterDto);
  }

  @Get('visitor/statistics')
  async getVisitorStatistics() {
    return await this.viewerService.getVisitorStatistics();
  }

  // ===================
  // TRANSLATION QUERIES
  // ===================

  @Get('translation')
  async getTranslations(@Query(ValidationPipe) filterDto: TranslationFilterDto) {
    return await this.viewerService.getTranslations(filterDto);
  }

  @Get('translation/statistics')
  async getTranslationStatistics() {
    return await this.viewerService.getTranslationStatistics();
  }
}
