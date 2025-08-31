import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('mou/excel')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.REPORT_EXPORT)
  async exportMouExcel(@Query() filters: any, @Res() res: Response) {
    const buffer = await this.reportService.generateExcelReport(filters);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=mou-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    res.send(buffer);
  }

  @Get('mou/pdf')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.REPORT_EXPORT)
  async exportMouPDF(@Query() filters: any, @Res() res: Response) {
    const buffer = await this.reportService.generatePDFReport(filters);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=mou-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    res.send(buffer);
  }

  @Get('dashboard/stats')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.REPORT_STATS)
  async getDashboardStats() {
    return this.reportService.getDashboardStats();
  }
}
