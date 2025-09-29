import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DocumentStatus, DocumentType } from '@prisma/client';

/**
 * DTO for filtering and pagination in document list
 * Dùng cho GET /documents với query parameters
 */
export class FilterDocumentDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by document status',
    enum: DocumentStatus,
    required: false,
    example: DocumentStatus.SUBMITTED
  })
  @IsOptional()
  @IsEnum(DocumentStatus, { message: 'Invalid status' })
  status?: DocumentStatus;

  @ApiProperty({
    description: 'Filter by document type',
    enum: DocumentType,
    required: false,
    example: DocumentType.MOU
  })
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Invalid document type' })
  type?: DocumentType;

  @ApiProperty({
    description: 'Filter by year (created year)',
    required: false,
    example: 2024
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Year must be a number' })
  year?: number;

  @ApiProperty({
    description: 'Filter by partner name (partial match)',
    required: false,
    example: 'University'
  })
  @IsOptional()
  @IsString({ message: 'Partner name must be a string' })
  partnerName?: string;

  @ApiProperty({
    description: 'Filter by partner country (partial match)',
    required: false,
    example: 'Japan'
  })
  @IsOptional()
  @IsString({ message: 'Partner country must be a string' })
  partnerCountry?: string;

  @ApiProperty({
    description: 'Filter by title (partial match)',
    required: false,
    example: 'MOU'
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({
    description: 'Filter by creator unit ID',
    required: false,
    example: 'unit-cntt-123'
  })
  @IsOptional()
  @IsString({ message: 'Unit ID must be a string' })
  unitId?: string;

  @ApiProperty({
    description: 'Filter by creator user ID',
    required: false,
    example: 'user-123'
  })
  @IsOptional()
  @IsString({ message: 'Creator ID must be a string' })
  createdBy?: string;

  @ApiProperty({
    description: 'Filter documents created from this date (ISO string)',
    required: false,
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid created from date' })
  createdFrom?: string;

  @ApiProperty({
    description: 'Filter documents created to this date (ISO string)',
    required: false,
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid created to date' })
  createdTo?: string;

  @ApiProperty({
    description: 'Filter documents expiring soon (within X days)',
    required: false,
    example: 30
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Expiring days must be a number' })
  @Min(1, { message: 'Expiring days must be at least 1' })
  expiringSoon?: number;

  @ApiProperty({
    description: 'Sort field',
    required: false,
    default: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'title', 'partnerName', 'status', 'expirationDate']
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    required: false,
    default: 'desc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}