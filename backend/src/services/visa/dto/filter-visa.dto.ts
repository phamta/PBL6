import { IsOptional, IsString, IsDateString, IsEnum, IsNumberString, Length, Min, Max, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { VisaStatus } from '@prisma/client';

export class FilterVisaDto {
  @ApiProperty({
    description: 'Search term for holder name or visa number',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  @Length(1, 100, { message: 'Search term must be between 1 and 100 characters' })
  search?: string;

  @ApiProperty({
    description: 'Filter by visa status',
    enum: VisaStatus,
    example: VisaStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(VisaStatus, { message: 'Status must be a valid visa status' })
  status?: VisaStatus;

  @ApiProperty({
    description: 'Filter by multiple visa statuses',
    enum: VisaStatus,
    isArray: true,
    example: [VisaStatus.ACTIVE, VisaStatus.EXPIRING],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Statuses must be an array' })
  @IsEnum(VisaStatus, { each: true, message: 'Each status must be a valid visa status' })
  statuses?: VisaStatus[];

  @ApiProperty({
    description: 'Filter by holder country',
    example: 'United States',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Holder country must be a string' })
  @Length(2, 50, { message: 'Holder country must be between 2 and 50 characters' })
  holderCountry?: string;

  @ApiProperty({
    description: 'Filter by sponsor unit',
    example: 'University of Technology',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Sponsor unit must be a string' })
  @Length(2, 100, { message: 'Sponsor unit must be between 2 and 100 characters' })
  sponsorUnit?: string;

  @ApiProperty({
    description: 'Filter by issue date from (inclusive)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Issue date from must be a valid date string' })
  issueDateFrom?: string;

  @ApiProperty({
    description: 'Filter by issue date to (inclusive)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Issue date to must be a valid date string' })
  issueDateTo?: string;

  @ApiProperty({
    description: 'Filter by expiration date from (inclusive)',
    example: '2024-06-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Expiration date from must be a valid date string' })
  expirationDateFrom?: string;

  @ApiProperty({
    description: 'Filter by expiration date to (inclusive)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Expiration date to must be a valid date string' })
  expirationDateTo?: string;

  @ApiProperty({
    description: 'Filter visas expiring within specified days',
    example: '30',
    required: false,
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Expiring within days must be a number string' })
  expiringWithinDays?: string;

  @ApiProperty({
    description: 'Filter by created by user ID',
    example: 'user_123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Created by must be a string' })
  createdBy?: string;

  @ApiProperty({
    description: 'Filter by approved by user ID',
    example: 'user_456',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Approved by must be a string' })
  approvedBy?: string;

  @ApiProperty({
    description: 'Sort field',
    example: 'expirationDate',
    enum: ['holderName', 'holderCountry', 'visaNumber', 'issueDate', 'expirationDate', 'sponsorUnit', 'status', 'createdAt'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Sort by must be a string' })
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Page number for pagination',
    example: '1',
    required: false,
    default: '1',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Page must be a number string' })
  @Transform(({ value }) => value || '1')
  page?: string;

  @ApiProperty({
    description: 'Number of items per page',
    example: '10',
    required: false,
    default: '10',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Limit must be a number string' })
  @Transform(({ value }) => {
    const num = parseInt(value || '10', 10);
    return Math.min(Math.max(num, 1), 100).toString(); // Limit between 1-100
  })
  limit?: string;
}