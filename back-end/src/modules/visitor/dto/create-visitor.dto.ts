import { IsString, IsDateString, IsOptional, IsEnum, IsArray, IsNumber, IsEmail } from 'class-validator';
import { VisitorStatus } from '../entities/visitor.entity';
import { VisitPurpose, VisitorStatus as AppVisitorStatus } from '../entities/visitor-application.entity';

export class CreateVisitorDto {
  @IsString()
  groupName: string;

  @IsString()
  organization: string;

  @IsString()
  organizationCountry: string;

  @IsEnum(VisitPurpose)
  @IsOptional()
  visitPurpose?: VisitPurpose;

  @IsDateString()
  visitStartDate: string;

  @IsDateString()
  visitEndDate: string;

  @IsNumber()
  numberOfPeople: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsEmail()
  contactPersonEmail?: string;

  @IsOptional()
  @IsString()
  contactPersonPhone?: string;

  @IsOptional()
  @IsString()
  accommodation?: string;

  @IsOptional()
  @IsString()
  transportation?: string;

  @IsOptional()
  members?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];

  // Legacy fields for backward compatibility
  @IsString()
  @IsOptional()
  organizationName?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsDateString()
  @IsOptional()
  arrivalDate?: string;

  @IsDateString()
  @IsOptional()
  departureDate?: string;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;

  @IsOptional()
  @IsString()
  itinerary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  membersList?: string[];

  @IsNumber()
  @IsOptional()
  numberOfMembers?: number;
}
