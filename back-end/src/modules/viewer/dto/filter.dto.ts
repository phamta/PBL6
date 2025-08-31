import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class MOUFilterDto {
  @IsOptional()
  @IsNumberString()
  year?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  partnerUniversity?: string;

  @IsOptional()
  @IsEnum(['APPROVED'], { message: 'Status must be APPROVED for viewer' })
  status?: string = 'APPROVED';

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => Math.min(parseInt(value) || 10, 50))
  limit?: number = 10;
}

export class VisitorFilterDto {
  @IsOptional()
  @IsNumberString()
  year?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsEnum(['APPROVED'], { message: 'Status must be APPROVED for viewer' })
  status?: string = 'APPROVED';

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => Math.min(parseInt(value) || 10, 50))
  limit?: number = 10;
}

export class TranslationFilterDto {
  @IsOptional()
  @IsNumberString()
  year?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  sourceLanguage?: string;

  @IsOptional()
  @IsString()
  targetLanguage?: string;

  @IsOptional()
  @IsEnum(['COMPLETED'], { message: 'Status must be COMPLETED for viewer' })
  status?: string = 'COMPLETED';

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => Math.min(parseInt(value) || 10, 50))
  limit?: number = 10;
}

export class VisaStatisticsDto {
  @IsOptional()
  @IsNumberString()
  year?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  visaType?: string;

  @IsOptional()
  @IsNumberString()
  expiringInDays?: number = 30;
}
