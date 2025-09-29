import { IsNotEmpty, IsString, IsDateString, IsOptional, Length, Matches, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVisaDto {
  @ApiProperty({
    description: 'Full name of the visa holder',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Holder name is required' })
  @IsString({ message: 'Holder name must be a string' })
  @Length(2, 100, { message: 'Holder name must be between 2 and 100 characters' })
  holderName: string;

  @ApiProperty({
    description: 'Country of the visa holder',
    example: 'United States',
  })
  @IsNotEmpty({ message: 'Holder country is required' })
  @IsString({ message: 'Holder country must be a string' })
  @Length(2, 50, { message: 'Holder country must be between 2 and 50 characters' })
  holderCountry: string;

  @ApiProperty({
    description: 'Passport number of the visa holder',
    example: 'A12345678',
  })
  @IsNotEmpty({ message: 'Passport number is required' })
  @IsString({ message: 'Passport number must be a string' })
  @Length(6, 20, { message: 'Passport number must be between 6 and 20 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Passport number must contain only uppercase letters and numbers' })
  passportNumber: string;

  @ApiProperty({
    description: 'Visa number (unique identifier)',
    example: 'VN2024001234',
  })
  @IsNotEmpty({ message: 'Visa number is required' })
  @IsString({ message: 'Visa number must be a string' })
  @Length(8, 20, { message: 'Visa number must be between 8 and 20 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Visa number must contain only uppercase letters and numbers' })
  visaNumber: string;

  @ApiProperty({
    description: 'Visa issue date',
    example: '2024-01-15',
  })
  @IsNotEmpty({ message: 'Issue date is required' })
  @IsDateString({}, { message: 'Issue date must be a valid date string' })
  issueDate: string;

  @ApiProperty({
    description: 'Visa expiration date',
    example: '2024-12-31',
  })
  @IsNotEmpty({ message: 'Expiration date is required' })
  @IsDateString({}, { message: 'Expiration date must be a valid date string' })
  expirationDate: string;

  @ApiProperty({
    description: 'Purpose of visit',
    example: 'Academic research collaboration',
  })
  @IsNotEmpty({ message: 'Purpose is required' })
  @IsString({ message: 'Purpose must be a string' })
  @Length(10, 500, { message: 'Purpose must be between 10 and 500 characters' })
  purpose: string;

  @ApiProperty({
    description: 'Sponsor unit or organization',
    example: 'University of Technology Ho Chi Minh City',
  })
  @IsNotEmpty({ message: 'Sponsor unit is required' })
  @IsString({ message: 'Sponsor unit must be a string' })
  @Length(2, 100, { message: 'Sponsor unit must be between 2 and 100 characters' })
  sponsorUnit: string;

  @ApiProperty({
    description: 'Array of attachment file paths',
    example: ['visa-application.pdf', 'passport-copy.pdf'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Attachments must be an array' })
  @IsString({ each: true, message: 'Each attachment must be a string' })
  attachments?: string[];

  @ApiProperty({
    description: 'ID of the user creating this visa record',
    example: 'user_123',
  })
  @IsNotEmpty({ message: 'Created by user ID is required' })
  @IsString({ message: 'Created by must be a string' })
  createdBy: string;
}