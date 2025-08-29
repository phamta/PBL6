import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { VisaExtensionStatus, VisaType } from '../entities/visa-extension.entity';

export class VisaExtensionFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(VisaExtensionStatus)
  status?: VisaExtensionStatus;

  @IsOptional()
  @IsEnum(VisaType)
  visaType?: VisaType;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsDateString()
  submissionDateFrom?: string;

  @IsOptional()
  @IsDateString()
  submissionDateTo?: string;

  @IsOptional()
  @IsDateString()
  expiryDateFrom?: string;

  @IsOptional()
  @IsDateString()
  expiryDateTo?: string;

  @IsOptional()
  @IsString()
  applicantId?: string;

  @IsOptional()
  @IsString()
  reviewerId?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
