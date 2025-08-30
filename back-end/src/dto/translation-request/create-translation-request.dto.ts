import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { DocumentType, LanguagePair } from '../../entities/translation-request.entity';

export class CreateTranslationRequestDto {
  @IsString()
  documentTitle: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsEnum(LanguagePair)
  languagePair: LanguagePair;

  @IsOptional()
  @IsString()
  originalFilePath?: string;

  @IsOptional()
  @IsNumber()
  pagesCount?: number = 1;

  @IsOptional()
  @IsBoolean()
  urgentRequest?: boolean = false;

  @IsOptional()
  @IsDateString()
  expectedCompletionDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsString()
  submittedById: string;
}
