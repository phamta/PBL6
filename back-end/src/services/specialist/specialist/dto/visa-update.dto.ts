import { IsEnum, IsString, IsOptional } from 'class-validator';
import { VisaStatus } from '../../visa/entities/visa-application.entity';

export class UpdateVisaStatusDto {
  @IsEnum(VisaStatus)
  status: VisaStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateNA5DocumentDto {
  @IsString()
  documentType: 'NA5' | 'NA6';

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
