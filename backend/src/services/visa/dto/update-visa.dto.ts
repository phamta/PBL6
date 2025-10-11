import { IsOptional, IsString, IsDateString, Length, Matches, IsArray, IsEnum, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VisaStatus } from '@prisma/client';

export class UpdateVisaDto {
  @ApiProperty({
    description: 'Full name of the visa holder',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Holder name must be a string' })
  @Length(2, 100, { message: 'Holder name must be between 2 and 100 characters' })
  holderName?: string;

  @ApiProperty({
    description: 'Country of the visa holder',
    example: 'United States',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Holder country must be a string' })
  @Length(2, 50, { message: 'Holder country must be between 2 and 50 characters' })
  holderCountry?: string;

  @ApiProperty({
    description: 'Passport number of the visa holder',
    example: 'A12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Passport number must be a string' })
  @Length(6, 20, { message: 'Passport number must be between 6 and 20 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Passport number must contain only uppercase letters and numbers' })
  passportNumber?: string;

  @ApiProperty({
    description: 'Visa number (unique identifier)',
    example: 'VN2024001234',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Visa number must be a string' })
  @Length(8, 20, { message: 'Visa number must be between 8 and 20 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Visa number must contain only uppercase letters and numbers' })
  visaNumber?: string;

  @ApiProperty({
    description: 'Visa issue date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Issue date must be a valid date string' })
  issueDate?: string;

  @ApiProperty({
    description: 'Visa expiration date',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Expiration date must be a valid date string' })
  expirationDate?: string;

  @ApiProperty({
    description: 'Purpose of visit',
    example: 'Academic research collaboration',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Purpose must be a string' })
  @Length(10, 500, { message: 'Purpose must be between 10 and 500 characters' })
  purpose?: string;

  @ApiProperty({
    description: 'Sponsor unit or organization',
    example: 'University of Technology Ho Chi Minh City',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Sponsor unit must be a string' })
  @Length(2, 100, { message: 'Sponsor unit must be between 2 and 100 characters' })
  sponsorUnit?: string;

  @ApiProperty({
    description: 'Visa status',
    enum: VisaStatus,
    example: VisaStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(VisaStatus, { message: 'Status must be a valid visa status' })
  status?: VisaStatus;

  @ApiProperty({
    description: 'Array of attachment file paths',
    example: ['visa-application.pdf', 'passport-copy.pdf'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Attachments must be an array' })
  @IsString({ each: true, message: 'Each attachment must be a string' })
  attachments?: string[];

  // ==================== NEW FIELDS ====================

  @ApiProperty({
    description: 'Date of birth of visa holder',
    example: '1990-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Type of visa',
    example: 'Work Visa',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Visa type must be a string' })
  @Length(2, 50, { message: 'Visa type must be between 2 and 50 characters' })
  visaType?: string;

  @ApiProperty({
    description: 'Entry date to Vietnam',
    example: '2024-02-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Entry date must be a valid date string' })
  entryDate?: string;

  @ApiProperty({
    description: 'Program name (for students/researchers)',
    example: 'Computer Science PhD Program',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Program must be a string' })
  @Length(2, 200, { message: 'Program must be between 2 and 200 characters' })
  program?: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Faculty of Information Technology',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  @Length(2, 100, { message: 'Department must be between 2 and 100 characters' })
  department?: string;

  @ApiProperty({
    description: 'Supervisor name (for students/researchers)',
    example: 'Prof. Nguyen Van A',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Supervisor name must be a string' })
  @Length(2, 100, { message: 'Supervisor name must be between 2 and 100 characters' })
  supervisorName?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(8, 20, { message: 'Phone must be between 8 and 20 characters' })
  phone?: string;

  @ApiProperty({
    description: 'Extension request date',
    example: '2024-10-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Extension request date must be a valid date string' })
  extensionRequestDate?: string;

  @ApiProperty({
    description: 'Extension reason',
    example: 'Need more time to complete research project',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Extension reason must be a string' })
  @Length(10, 500, { message: 'Extension reason must be between 10 and 500 characters' })
  extensionReason?: string;

  @ApiProperty({
    description: 'Whether NA5 document request is needed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'NA5 request must be a boolean' })
  na5Request?: boolean;

  @ApiProperty({
    description: 'Partner ID (if linking to existing partner)',
    example: 'cuid-partner-123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Partner ID must be a string' })
  partnerId?: string;

  @ApiProperty({
    description: 'Unit ID (if linking to specific unit/department)',
    example: 'cuid-unit-456',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Unit ID must be a string' })
  unitId?: string;
}