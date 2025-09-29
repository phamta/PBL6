import { IsNotEmpty, IsString, IsEnum, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ApprovalAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class ApproveVisaDto {
  @ApiProperty({
    description: 'Approval action to take',
    enum: ApprovalAction,
    example: ApprovalAction.APPROVE,
  })
  @IsNotEmpty({ message: 'Action is required' })
  @IsEnum(ApprovalAction, { message: 'Action must be either APPROVE or REJECT' })
  action: ApprovalAction;

  @ApiProperty({
    description: 'Comments or notes about the approval decision',
    example: 'All documentation verified. Approved for 1 year duration.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Comments must be a string' })
  @Length(5, 1000, { message: 'Comments must be between 5 and 1000 characters' })
  comments?: string;

  @ApiProperty({
    description: 'ID of the user making the approval decision',
    example: 'user_456',
  })
  @IsNotEmpty({ message: 'Approved by user ID is required' })
  @IsString({ message: 'Approved by must be a string' })
  approvedBy: string;
}