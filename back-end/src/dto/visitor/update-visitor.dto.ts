import { CreateVisitorDto } from './create-visitor.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVisitorDto extends PartialType(CreateVisitorDto) {
  @IsOptional()
  @IsString()
  passportScanPath?: string;

  @IsOptional()
  @IsString()
  documentPath?: string;
}
