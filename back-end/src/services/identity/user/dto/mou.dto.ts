import { IsString, IsOptional, IsDateString, IsArray, IsEnum } from 'class-validator';

export enum MOUType {
  ACADEMIC_COOPERATION = 'academic_cooperation',
  RESEARCH_COLLABORATION = 'research_collaboration',
  STUDENT_EXCHANGE = 'student_exchange',
  FACULTY_EXCHANGE = 'faculty_exchange',
  JOINT_PROGRAM = 'joint_program',
  OTHER = 'other'
}

export class CreateMOUDto {
  @IsString()
  title: string;

  @IsString()
  partnerOrganization: string;

  @IsString()
  partnerCountry: string;

  @IsEnum(MOUType)
  mouType: MOUType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  proposedStartDate: string;

  @IsOptional()
  @IsDateString()
  proposedEndDate?: string;

  @IsOptional()
  @IsString()
  expectedOutcomes?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  contactPersonEmail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];
}

export class UpdateMOUDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  partnerOrganization?: string;

  @IsOptional()
  @IsString()
  partnerCountry?: string;

  @IsOptional()
  @IsEnum(MOUType)
  mouType?: MOUType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  proposedStartDate?: string;

  @IsOptional()
  @IsDateString()
  proposedEndDate?: string;

  @IsOptional()
  @IsString()
  expectedOutcomes?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  contactPersonEmail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalDocuments?: string[];
}
