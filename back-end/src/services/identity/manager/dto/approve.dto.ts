import { IsString, IsOptional } from 'class-validator';

export class ApproveVisaDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  officialDocumentPath?: string; // Đường dẫn file NA5/NA6 đã ký
}

export class ApproveMouDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  signedDocumentPath?: string; // Đường dẫn MOU đã ký

  @IsString()
  @IsOptional()
  effectiveDate?: string;
}

export class ApproveVisitorDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  approvalDocumentPath?: string;
}

export class ApproveTranslationDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  certificationDocumentPath?: string; // Văn bản xác nhận đã ký
}
