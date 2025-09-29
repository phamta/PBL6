import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString, IsInt, Min, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateGuestMemberDto } from './create-guest-member.dto';

export class CreateGuestDto {
  @ApiPropertyOptional({ 
    description: 'Tên đoàn khách (nếu là đoàn)', 
    example: 'Đoàn công tác ABC Company' 
  })
  @IsString()
  @IsOptional()
  groupName?: string;

  @ApiProperty({ 
    description: 'Mục đích chuyến thăm', 
    example: 'Hợp tác học thuật và nghiên cứu' 
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ 
    description: 'Ngày đến (ISO 8601)', 
    example: '2024-01-15T09:00:00.000Z' 
  })
  @IsDateString()
  arrivalDate: string;

  @ApiProperty({ 
    description: 'Ngày về (ISO 8601)', 
    example: '2024-01-20T17:00:00.000Z' 
  })
  @IsDateString()
  departureDate: string;

  @ApiProperty({ 
    description: 'Người liên hệ chính', 
    example: 'Trần Thị B' 
  })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ 
    description: 'Email liên hệ', 
    example: 'contact@example.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiPropertyOptional({ 
    description: 'Số điện thoại liên hệ', 
    example: '+84901234567' 
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ 
    description: 'Tổng số thành viên', 
    example: 5,
    default: 1 
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  totalMembers?: number;

  @ApiPropertyOptional({ 
    description: 'Ghi chú thêm', 
    example: 'Cần hỗ trợ phiên dịch tiếng Anh' 
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'File đính kèm (JSON array of file paths)', 
    example: ['uploads/invitation.pdf', 'uploads/passport.jpg'] 
  })
  @IsOptional()
  attachments?: any;

  @ApiPropertyOptional({ 
    description: 'Danh sách thành viên trong đoàn',
    type: [CreateGuestMemberDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGuestMemberDto)
  @IsOptional()
  members?: CreateGuestMemberDto[];
}