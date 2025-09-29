import { IsString, IsEnum, IsOptional, IsNotEmpty, Length, IsObject, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class GenerateReportDto {
  @ApiProperty({
    description: 'Tên báo cáo',
    example: 'Báo cáo tổng hợp MOU năm 2024',
    maxLength: 255,
  })
  @IsString({ message: 'Tên báo cáo phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên báo cáo không được để trống' })
  @Length(1, 255, { message: 'Tên báo cáo phải từ 1-255 ký tự' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Loại báo cáo',
    enum: ReportType,
    example: 'MOU_SUMMARY',
  })
  @IsEnum(ReportType, { message: 'Loại báo cáo không hợp lệ' })
  type: ReportType;

  @ApiProperty({
    description: 'Tham số và bộ lọc báo cáo (JSON object)',
    example: {
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      status: 'ACTIVE',
      department: 'HTQT',
      includeExpired: false
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Parameters phải là object' })
  parameters?: ReportParameters;
}

export interface ReportParameters {
  // Date range filters
  dateFrom?: string;
  dateTo?: string;
  
  // Status filters
  status?: string | string[];
  
  // Entity-specific filters
  department?: string;
  category?: string;
  priority?: string;
  
  // MOU-specific
  mouType?: string;
  partnerCountry?: string;
  
  // Visa-specific  
  visaType?: string;
  nationality?: string;
  
  // Guest-specific
  guestType?: string;
  organization?: string;
  
  // Translation-specific
  sourceLanguage?: string;
  targetLanguage?: string;
  documentType?: string;
  
  // Activity-specific
  actionType?: string;
  userId?: string;
  
  // Additional options
  includeExpired?: boolean;
  includeInactive?: boolean;
  groupBy?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}