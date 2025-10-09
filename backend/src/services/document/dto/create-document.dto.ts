import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray, IsBoolean } from 'class-validator';
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
    description: 'Partner address',
    required: false,
    example: '7-3-1 Hongo, Bunkyo-ku, Tokyo 113-8654, Japan'
  })
  @IsOptional()
  @IsString({ message: 'Partner address must be a string' })
  partnerAddress?: string;

  @ApiProperty({
    description: 'Partner field/sector of activity',
    required: false,
    example: 'Higher Education, Research & Development'
  })
  @IsOptional()
  @IsString({ message: 'Partner field must be a string' })
  partnerField?: string;

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
    description: 'Proposing unit/department',
    required: false,
    example: 'Faculty of Information Technology'
  })
  @IsOptional()
  @IsString({ message: 'Proposing unit must be a string' })
  proposingUnit?: string;

  @ApiProperty({
    description: 'Signing level (e.g., University, Faculty, Department)',
    required: false,
    example: 'University Level'
  })
  @IsOptional()
  @IsString({ message: 'Signing level must be a string' })
  signingLevel?: string;

  @ApiProperty({
    description: 'Person/entity who signed the document',
    required: false,
    example: 'President Dr. Nguyen Van A'
  })
  @IsOptional()
  @IsString({ message: 'Signed by must be a string' })
  signedBy?: string;

  @ApiProperty({
    description: 'Indicates if this involves a high-level delegation',
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Is high level delegation must be a boolean' })
  isHighLevelDelegation?: boolean;

  @ApiProperty({
    description: 'Field/area of cooperation',
    required: false,
    example: 'Student Exchange, Joint Research, Faculty Development'
  })
  @IsOptional()
  @IsString({ message: 'Cooperation field must be a string' })
  cooperationField?: string;

  @ApiProperty({
    description: 'Reason for proposal',
    required: false,
    example: 'To strengthen international collaboration in AI research'
  })
  @IsOptional()
  @IsString({ message: 'Proposal reason must be a string' })
  proposalReason?: string;

  @ApiProperty({
    description: 'Current handling status',
    required: false,
    example: 'Under Review by Leadership'
  })
  @IsOptional()
  @IsString({ message: 'Handling status must be a string' })
  handlingStatus?: string;

  @ApiProperty({
    description: 'Partner ID (if linking to existing partner record)',
    required: false,
    example: 'cuid-partner-123'
  })
  @IsOptional()
  @IsString({ message: 'Partner ID must be a string' })
  partnerId?: string;

  @ApiProperty({
    description: 'Unit ID (if linking to specific unit/department)',
    required: false,
    example: 'cuid-unit-456'
  })
  @IsOptional()
  @IsString({ message: 'Unit ID must be a string' })
  unitId?: string;

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