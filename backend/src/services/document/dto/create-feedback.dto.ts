import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

/**
 * DTO for creating feedback on MOU documents
 * Dành cho Phòng KHCN&ĐN gửi góp ý cho hồ sơ MOU
 */
export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Nội dung góp ý',
    example: 'Cần bổ sung thêm thông tin về phạm vi hợp tác và thời gian thực hiện dự án.'
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content: string;

  @ApiProperty({
    description: 'Tệp đính kèm góp ý (array of file paths)',
    type: [String],
    required: false,
    example: ['/uploads/feedback/notes-2024.pdf']
  })
  @IsOptional()
  @IsArray({ message: 'Attachments must be an array' })
  @IsString({ each: true, message: 'Each attachment must be a string' })
  attachments?: string[];
}