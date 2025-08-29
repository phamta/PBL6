import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { TranslationStatus, DocumentType } from '../entities/translation.entity';

export class CreateTranslationDto {
  @IsString()
  documentTitle: string;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsString()
  originalLanguage: string;

  @IsString()
  targetLanguage: string;

  @IsString()
  translatedBy: string;

  @IsDateString()
  translationDate: string;

  @IsOptional()
  @IsEnum(TranslationStatus)
  status?: TranslationStatus;

  @IsOptional()
  @IsString()
  originalDocument?: string;

  @IsOptional()
  @IsString()
  translatedDocument?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  verifiedBy?: string;

  @IsOptional()
  @IsDateString()
  verificationDate?: string;
}
