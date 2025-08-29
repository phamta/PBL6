import { IsString, IsDateString, IsOptional, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
import { MouStatus, MouType, MouPriority } from '../entities/mou.entity';

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

  @IsString()
  @IsOptional()
  partnerContact?: string;

  @IsString()
  @IsOptional()
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  partnerPhone?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

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
