import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export enum ReportFormat {
  EXCEL = 'excel',
  PDF = 'pdf',
  WORD = 'word',
}

export enum ReportPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export class VisitorReportDto {
  @IsOptional()
  @IsString()
  invitingUnit?: string;

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
  format?: ReportFormat;

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
