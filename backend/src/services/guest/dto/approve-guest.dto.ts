import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveGuestDto {
  @ApiPropertyOptional({ 
    description: 'Ghi chú của người duyệt', 
    example: 'Đã kiểm tra và chấp thuận yêu cầu',
    maxLength: 1000 
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class RejectGuestDto {
  @ApiProperty({ 
    description: 'Lý do từ chối', 
    example: 'Thiếu tài liệu cần thiết',
    maxLength: 1000 
  })
  @IsString()
  @MaxLength(1000)
  reason: string;

  @ApiPropertyOptional({ 
    description: 'Ghi chú thêm từ người từ chối', 
    example: 'Vui lòng bổ sung thư mời chính thức',
    maxLength: 1000 
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}