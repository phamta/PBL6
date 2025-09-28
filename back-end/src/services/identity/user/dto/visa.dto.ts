import { IsString, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisaApplicationDto {
  @IsString()
  passportNo: string;

  @IsString()
  visaType: string;

  @IsString()
  country: string;

  @IsDateString()
  expireDate: string;

  @IsOptional()
  @IsDateString()
  currentVisaExpiry?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];
}

export class UpdateVisaApplicationDto {
  @IsOptional()
  @IsString()
  passportNo?: string;

  @IsOptional()
  @IsString()
  visaType?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  expireDate?: string;

  @IsOptional()
  @IsDateString()
  currentVisaExpiry?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalDocuments?: string[];
}
