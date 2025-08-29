import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('mou/excel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  async exportMouExcel(@Query() filters: any, @Res() res: Response) {
    const buffer = await this.reportService.generateExcelReport(filters);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=mou-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    res.send(buffer);
  }

  @Get('mou/pdf')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  async exportMouPDF(@Query() filters: any, @Res() res: Response) {
    const buffer = await this.reportService.generatePDFReport(filters);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=mou-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    res.send(buffer);
  }

  @Get('dashboard/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  async getDashboardStats() {
    return this.reportService.getDashboardStats();
  }
}
