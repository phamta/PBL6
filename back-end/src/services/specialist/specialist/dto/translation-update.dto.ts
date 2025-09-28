import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum TranslationStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export class UpdateTranslationStatusDto {
  @IsEnum(TranslationStatus)
  status: TranslationStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AddTranslationCommentDto {
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  type?: 'feedback' | 'suggestion' | 'requirement';
}
