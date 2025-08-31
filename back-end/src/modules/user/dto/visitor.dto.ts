import { IsString, IsOptional, IsDateString, IsArray, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum VisitorPurpose {
  ACADEMIC_CONFERENCE = 'academic_conference',
  RESEARCH_COLLABORATION = 'research_collaboration',
  INSTITUTIONAL_VISIT = 'institutional_visit',
  STUDENT_EXCHANGE = 'student_exchange',
  CULTURAL_EXCHANGE = 'cultural_exchange',
  BUSINESS_MEETING = 'business_meeting',
  OTHER = 'other'
}

export class VisitorMemberDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  passportNo?: string;
}

export class CreateVisitorGroupDto {
  @IsString()
  groupName: string;

  @IsString()
  organization: string;

  @IsString()
  organizationCountry: string;

  @IsEnum(VisitorPurpose)
  visitPurpose: VisitorPurpose;

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
  @IsString()
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VisitorMemberDto)
  members?: VisitorMemberDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];
}

export class UpdateVisitorGroupDto {
  @IsOptional()
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  organizationCountry?: string;

  @IsOptional()
  @IsEnum(VisitorPurpose)
  visitPurpose?: VisitorPurpose;

  @IsOptional()
  @IsDateString()
  visitStartDate?: string;

  @IsOptional()
  @IsDateString()
  visitEndDate?: string;

  @IsOptional()
  @IsNumber()
  numberOfPeople?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsString()
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VisitorMemberDto)
  members?: VisitorMemberDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalDocuments?: string[];
}
