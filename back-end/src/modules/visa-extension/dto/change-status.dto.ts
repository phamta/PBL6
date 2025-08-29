import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { VisaExtensionStatus } from '../entities/visa-extension.entity';

export class ChangeStatusDto {
  @IsEnum(VisaExtensionStatus)
  status: VisaExtensionStatus;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  additionalRequirements?: string;

  @IsOptional()
  @IsString()
  officialDocumentNumber?: string;

  @IsOptional()
  @IsDateString()
  newVisaExpiryDate?: string;
}
