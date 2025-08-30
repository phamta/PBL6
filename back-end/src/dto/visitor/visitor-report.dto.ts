import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  WORD = 'word',
}

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export class VisitorReportDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat = ReportFormat.PDF;

  @IsOptional()
  @IsString()
  filterByStatus?: string;

  @IsOptional()
  @IsString()
  filterByCountry?: string;

  @IsOptional()
  @IsString()
  filterByOrganization?: string;

  @IsOptional()
  @IsString()
  invitingUnit?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsString()
  quarter?: string;
}
