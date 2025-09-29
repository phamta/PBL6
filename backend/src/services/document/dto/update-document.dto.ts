import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

/**
 * DTO for updating document/MOU proposal
 * Chỉ cho phép cập nhật khi status = DRAFT
 * Không kế thừa CreateDocumentDto để tránh required fields
 */
export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    required: false,
    example: 'Updated Memorandum of Understanding with University of Tokyo'
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({
    description: 'Partner organization name',
    required: false,
    example: 'University of Tokyo - Updated'
  })
  @IsOptional()
  @IsString({ message: 'Partner name must be a string' })
  partnerName?: string;

  @ApiProperty({
    description: 'Partner country',
    required: false,
    example: 'Japan'
  })
  @IsOptional()
  @IsString({ message: 'Partner country must be a string' })
  partnerCountry?: string;

  @ApiProperty({
    description: 'Document description/summary',
    required: false,
    example: 'Updated academic cooperation agreement'
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

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
    example: ['/uploads/mou-draft-updated-2024.pdf', '/uploads/partner-profile-updated.pdf']
  })
  @IsOptional()
  @IsArray({ message: 'Attachments must be an array' })
  @IsString({ each: true, message: 'Each attachment must be a string' })
  attachments?: string[];

  @ApiProperty({
    description: 'Additional notes',
    required: false,
    example: 'Updated notes for this MOU'
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'Contact person at partner organization',
    required: false,
    example: 'Dr. Tanaka Hiroshi, International Affairs Office (Updated)'
  })
  @IsOptional()
  @IsString({ message: 'Partner contact must be a string' })
  partnerContact?: string;

  @ApiProperty({
    description: 'Expected benefits from this cooperation',
    required: false,
    example: 'Updated expected benefits and outcomes'
  })
  @IsOptional()
  @IsString({ message: 'Expected benefits must be a string' })
  expectedBenefits?: string;
}