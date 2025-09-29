import { PartialType } from '@nestjs/swagger';
import { CreateTranslationDto } from './create-translation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TranslationStatus } from '@prisma/client';

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {
  @ApiPropertyOptional({ 
    description: 'Trạng thái dịch thuật (chỉ admin/manager mới được thay đổi)',
    enum: TranslationStatus,
    example: TranslationStatus.APPROVED 
  })
  @IsEnum(TranslationStatus)
  @IsOptional()
  status?: TranslationStatus;
}