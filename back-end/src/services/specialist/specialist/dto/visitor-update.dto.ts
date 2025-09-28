import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum VisitorStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export class UpdateVisitorStatusDto {
  @IsEnum(VisitorStatus)
  status: VisitorStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
