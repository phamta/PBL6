import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * DTO for approval/rejection actions
 * Dành cho Department Officer và Leadership thực hiện approve/reject
 */
export class ApproveDocumentDto {
  @ApiProperty({
    description: 'Approval/rejection reason or comments',
    example: 'Document approved after review. All requirements are met.'
  })
  @IsString({ message: 'Comment must be a string' })
  @IsNotEmpty({ message: 'Comment cannot be empty' })
  comment: string;

  @ApiProperty({
    description: 'Additional notes for the approval/rejection',
    required: false,
    example: 'Please ensure all parties sign the final version.'
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiProperty({
    description: 'Recommended next steps',
    required: false,
    example: 'Forward to Leadership for final signature'
  })
  @IsOptional()
  @IsString({ message: 'Next steps must be a string' })
  nextSteps?: string;
}