import { PartialType } from '@nestjs/mapped-types';
import { CreateVisaExtensionDto } from './create-visa-extension.dto';
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { VisaExtensionStatus } from '../entities/visa-extension.entity';

export class UpdateVisaExtensionDto extends PartialType(CreateVisaExtensionDto) {
  @IsOptional()
  @IsEnum(VisaExtensionStatus)
  status?: VisaExtensionStatus;

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

  @IsOptional()
  @IsString()
  reviewerId?: string;
}
