import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { DocumentType } from '@prisma/client';

/**
 * DTO for creating a new document/MOU proposal
 * Dành cho Faculty Staff tạo đề xuất MOU mới
 */
export class CreateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Memorandum of Understanding with University of Tokyo'
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @ApiProperty({
    description: 'Document type',
    enum: DocumentType,
    default: DocumentType.MOU,
  })
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Invalid document type' })
  type?: DocumentType;

  @ApiProperty({
    description: 'Partner organization name',
    example: 'University of Tokyo'
  })
  @IsString({ message: 'Partner name must be a string' })
  @IsNotEmpty({ message: 'Partner name cannot be empty' })
  partnerName: string;

  @ApiProperty({
    description: 'Partner country',
    example: 'Japan'
  })
  @IsString({ message: 'Partner country must be a string' })
  @IsNotEmpty({ message: 'Partner country cannot be empty' })
  partnerCountry: string;

  @ApiProperty({
    description: 'Document description/summary',
    example: 'Academic cooperation agreement focusing on student exchange and joint research programs'
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @ApiProperty({
    description: 'Detailed content of the document',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiProperty({
    description: 'Valid from date (ISO string)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid valid from date' })
  validFrom?: string;

  @ApiProperty({
    description: 'Valid to date (ISO string)',
    required: false,
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid valid to date' })
  validTo?: string;

  @ApiProperty({
    description: 'Signed date (ISO string)',
    required: false,
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid signed date' })
  signedDate?: string;

  @ApiProperty({
    description: 'Effective date (ISO string)',
    required: false,
    example: '2024-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid effective date' })
  effectiveDate?: string;

  @ApiProperty({
    description: 'Expiration date (ISO string)',
    required: false,
    example: '2027-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid expiration date' })
  expirationDate?: string;

  @ApiProperty({
    description: 'File attachments (array of file paths)',
    type: [String],
    required: false,
    example: ['/uploads/mou-draft-2024.pdf', '/uploads/partner-profile.pdf']
  })
  @IsOptional()
  @IsArray({ message: 'Attachments must be an array' })
  @IsString({ each: true, message: 'Each attachment must be a string' })
  attachments?: string[];

  @ApiProperty({
    description: 'Additional notes',
    required: false,
    example: 'This MOU includes provisions for dual degree programs'
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'Contact person at partner organization',
    required: false,
    example: 'Dr. Tanaka Hiroshi, International Affairs Office'
  })
  @IsOptional()
  @IsString({ message: 'Partner contact must be a string' })
  partnerContact?: string;

  @ApiProperty({
    description: 'Expected benefits from this cooperation',
    required: false,
    example: 'Enhanced research collaboration, student mobility, faculty exchange'
  })
  @IsOptional()
  @IsString({ message: 'Expected benefits must be a string' })
  expectedBenefits?: string;
}