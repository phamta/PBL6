import {
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { VisitorGender, VisitorPurpose } from '../../entities/visitor.entity';

export class CreateVisitorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nationality: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9]{6,9}$/, {
    message: 'Passport number must be 6-9 characters long and contain only uppercase letters and numbers',
  })
  passportNumber: string;

  @IsEnum(VisitorGender)
  gender: VisitorGender;

  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  position: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  organization: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'Phone number must be a valid international format',
  })
  phoneNumber: string;

  @IsDateString()
  arrivalDateTime: string;

  @IsDateString()
  departureDateTime: string;

  @IsEnum(VisitorPurpose)
  purpose: VisitorPurpose;

  @IsOptional()
  @IsString()
  purposeDetails?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  invitingUnit: string;

  @IsOptional()
  @IsString()
  passportScanPath?: string;

  @IsOptional()
  @IsString()
  documentPath?: string;
}
