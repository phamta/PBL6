import { IsString, IsDateString, IsOptional, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
import { MouStatus, MouType, MouPriority } from '../entities/mou.entity';
import { MouType as AppMouType, MouStatus as AppMouStatus } from '../entities/mou-application.entity';

export class CreateMouDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  partnerOrganization: string;

  @IsString()
  @IsNotEmpty()
  partnerCountry: string;

  @IsEnum(AppMouType)
  @IsOptional()
  mouType?: AppMouType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  proposedStartDate: string;

  @IsDateString()
  @IsOptional()
  proposedEndDate?: string;

  @IsString()
  @IsOptional()
  expectedOutcomes?: string;

  @IsString()
  @IsOptional()
  contactPersonName?: string;

  @IsString()
  @IsOptional()
  contactPersonEmail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];

  // Legacy fields for backward compatibility
  @IsString()
  @IsOptional()
  partnerContact?: string;

  @IsString()
  @IsOptional()
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  partnerPhone?: string;

  @IsEnum(MouType)
  @IsOptional()
  type?: MouType;

  @IsEnum(MouPriority)
  @IsOptional()
  priority?: MouPriority;

  @IsDateString()
  @IsOptional()
  proposedDate?: string;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsOptional()
  @IsEnum(MouStatus)
  status?: MouStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @IsOptional()
  @IsString()
  terms?: string;

  @IsString()
  @IsOptional()
  objectives?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  benefits?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  faculty?: string;
}
