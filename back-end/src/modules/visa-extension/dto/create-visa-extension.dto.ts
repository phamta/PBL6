import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Length,
  IsPhoneNumber,
} from 'class-validator';
import { VisaType, StudyProgram } from '../entities/visa-extension.entity';

export class CreateVisaExtensionDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  passportNumber: string;

  @IsNotEmpty()
  @IsDateString()
  passportIssueDate: string;

  @IsNotEmpty()
  @IsDateString()
  passportExpiryDate: string;

  @IsNotEmpty()
  @IsString()
  passportIssuePlace: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  currentVisaNumber: string;

  @IsNotEmpty()
  @IsEnum(VisaType)
  visaType: VisaType;

  @IsNotEmpty()
  @IsDateString()
  visaIssueDate: string;

  @IsNotEmpty()
  @IsDateString()
  visaExpiryDate: string;

  @IsNotEmpty()
  @IsString()
  visaIssuePlace: string;

  @IsOptional()
  @IsEnum(StudyProgram)
  studyProgram?: StudyProgram;

  @IsOptional()
  @IsString()
  universityName?: string;

  @IsOptional()
  @IsString()
  programDuration?: string;

  @IsOptional()
  @IsDateString()
  expectedGraduationDate?: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  reasonForExtension: string;

  @IsNotEmpty()
  @IsString()
  requestedExtensionPeriod: string;

  @IsNotEmpty()
  @IsString()
  contactAddress: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  contactPhone: string;

  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
