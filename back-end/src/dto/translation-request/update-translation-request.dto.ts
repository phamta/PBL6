import { CreateTranslationRequestDto } from './create-translation-request.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTranslationRequestDto extends PartialType(CreateTranslationRequestDto) {
  @IsOptional()
  @IsString()
  originalFilePath?: string;

  @IsOptional()
  @IsString()
  translatedFilePath?: string;
}
