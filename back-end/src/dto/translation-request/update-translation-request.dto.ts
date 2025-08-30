import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { CreateTranslationRequestDto } from './create-translation-request.dto';
import { TranslationStatus } from '../../entities/translation-request.entity';

export class UpdateTranslationRequestDto extends PartialType(CreateTranslationRequestDto) {
  @IsOptional()
  @IsEnum(TranslationStatus)
  status?: TranslationStatus;

  @IsOptional()
  @IsString()
  translatedFilePath?: string;

  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @IsOptional()
  @IsNumber()
  actualCost?: number;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  assignedTranslatorId?: string;

  @IsOptional()
  @IsString()
  reviewedById?: string;
}
