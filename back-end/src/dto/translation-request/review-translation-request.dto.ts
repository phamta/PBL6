import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { TranslationStatus } from '../../entities/translation-request.entity';

export class ReviewTranslationRequestDto {
  @IsEnum(TranslationStatus)
  status: TranslationStatus;

  @IsOptional()
  @IsString()
  reviewNotes?: string;

  @IsOptional()
  @IsString()
  reviewComments?: string;

  @IsOptional()
  @IsNumber()
  qualityRating?: number;

  @IsOptional()
  @IsString()
  clientFeedback?: string;

  @IsString()
  reviewedById: string;
}
