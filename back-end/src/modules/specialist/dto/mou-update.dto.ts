import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MOUStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export class UpdateMOUStatusDto {
  @IsEnum(MOUStatus)
  status: MOUStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AddMOUCommentDto {
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  type?: 'feedback' | 'suggestion' | 'requirement';
}
