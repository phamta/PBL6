import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { TranslationStatus, DocumentType, LanguagePair } from '../../entities/translation-request.entity';

export enum ReportFormat {
  EXCEL = 'excel',
  PDF = 'pdf',
}

export class TranslationReportDto {
  @IsOptional()
  @IsString()
  submittingUnit?: string;

  @IsOptional()
  @IsEnum(TranslationStatus)
  status?: TranslationStatus;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsOptional()
  @IsEnum(LanguagePair)
  languagePair?: LanguagePair;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;
}
