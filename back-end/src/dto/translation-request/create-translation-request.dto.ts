import {
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { DocumentType, LanguagePair } from '../../entities/translation-request.entity';

export class CreateTranslationRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  originalDocumentTitle: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsEnum(LanguagePair)
  languagePair: LanguagePair;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  purpose: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  submittingUnit: string;

  @IsOptional()
  @IsString()
  originalFilePath?: string;

  @IsOptional()
  @IsString()
  translatedFilePath?: string;
}
