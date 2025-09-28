import { PartialType } from '@nestjs/mapped-types';
import { CreateTranslationCertificateDto } from './create-translation-certificate.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdateTranslationCertificateDto extends PartialType(CreateTranslationCertificateDto) {
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  trangThai?: string;
}