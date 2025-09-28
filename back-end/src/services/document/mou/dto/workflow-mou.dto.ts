import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MouStatus } from '../entities/mou.entity';

export class ReviewMouDto {
  @IsEnum(MouStatus)
  status: MouStatus;

  @IsString()
  @IsOptional()
  reviewComments?: string;
}

export class ApproveMouDto {
  @IsEnum(MouStatus)
  status: MouStatus.APPROVED | MouStatus.REJECTED;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class SignMouDto {
  @IsString()
  signedDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class FilterMouDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  partnerCountry?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
