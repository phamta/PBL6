import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveTranslationDto {
  @ApiPropertyOptional({ 
    description: 'Ghi chú của người duyệt', 
    example: 'Đã kiểm tra và chấp thuận yêu cầu dịch thuật',
    maxLength: 1000 
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class RejectTranslationDto {
  @ApiProperty({ 
    description: 'Lý do từ chối', 
    example: 'Tài liệu không đầy đủ hoặc không rõ ràng',
    maxLength: 1000 
  })
  @IsString()
  @MaxLength(1000)
  reason: string;

  @ApiPropertyOptional({ 
    description: 'Ghi chú thêm từ người từ chối', 
    example: 'Vui lòng cung cấp bản scan chất lượng cao',
    maxLength: 1000 
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}