import { IsString, IsDateString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { VisaStatus } from '../entities/visa-application.entity';

export class CreateVisaApplicationDto {
  @IsString()
  applicantName: string;

  @IsString()
  nationality: string;

  @IsString()
  passportNumber: string;

  @IsDateString()
  currentVisaExpiry: string;

  @IsDateString()
  requestedExtensionDate: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsEnum(VisaStatus)
  status?: VisaStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}
