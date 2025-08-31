import { IsString, IsOptional, IsDateString, IsArray, IsEnum } from 'class-validator';

export enum TranslationType {
  ACADEMIC_TRANSCRIPT = 'academic_transcript',
  DIPLOMA_CERTIFICATE = 'diploma_certificate',
  RESEARCH_PAPER = 'research_paper',
  OFFICIAL_DOCUMENT = 'official_document',
  CONTRACT_AGREEMENT = 'contract_agreement',
  LEGAL_DOCUMENT = 'legal_document',
  OTHER = 'other'
}

export enum SourceLanguage {
  VIETNAMESE = 'vi',
  ENGLISH = 'en',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  FRENCH = 'fr',
  GERMAN = 'de',
  SPANISH = 'es',
  OTHER = 'other'
}

export enum TargetLanguage {
  VIETNAMESE = 'vi',
  ENGLISH = 'en',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  FRENCH = 'fr',
  GERMAN = 'de',
  SPANISH = 'es',
  OTHER = 'other'
}

export class CreateTranslationRequestDto {
  @IsString()
  documentTitle: string;

  @IsEnum(TranslationType)
  translationType: TranslationType;

  @IsEnum(SourceLanguage)
  sourceLanguage: SourceLanguage;

  @IsEnum(TargetLanguage)
  targetLanguage: TargetLanguage;

  @IsOptional()
  @IsString()
  sourceLanguageOther?: string;

  @IsOptional()
  @IsString()
  targetLanguageOther?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsString()
  urgencyLevel?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];
}

export class UpdateTranslationRequestDto {
  @IsOptional()
  @IsString()
  documentTitle?: string;

  @IsOptional()
  @IsEnum(TranslationType)
  translationType?: TranslationType;

  @IsOptional()
  @IsEnum(SourceLanguage)
  sourceLanguage?: SourceLanguage;

  @IsOptional()
  @IsEnum(TargetLanguage)
  targetLanguage?: TargetLanguage;

  @IsOptional()
  @IsString()
  sourceLanguageOther?: string;

  @IsOptional()
  @IsString()
  targetLanguageOther?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsString()
  urgencyLevel?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalDocuments?: string[];
}
