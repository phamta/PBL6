import { IsString, IsOptional } from 'class-validator';

export class RejectRequestDto {
  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
