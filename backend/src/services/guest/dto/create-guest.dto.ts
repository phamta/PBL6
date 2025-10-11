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

  // ==================== NEW FIELDS ====================

  @ApiPropertyOptional({ 
    description: 'Mục đích chuyến thăm chi tiết', 
    example: 'Tham gia hội thảo khoa học quốc tế' 
  })
  @IsString()
  @IsOptional()
  visitPurpose?: string;

  @ApiPropertyOptional({ 
    description: 'Đơn vị tiếp đón', 
    example: 'Phòng Hợp tác Quốc tế' 
  })
  @IsString()
  @IsOptional()
  hostDepartment?: string;

  @ApiPropertyOptional({ 
    description: 'Số thư mời', 
    example: 'INV-2024-001' 
  })
  @IsString()
  @IsOptional()
  invitationLetterNo?: string;

  @ApiPropertyOptional({ 
    description: 'Đường dẫn file NA2 (giấy tờ nhập cảnh)', 
    example: 'uploads/na2-document.pdf' 
  })
  @IsString()
  @IsOptional()
  immigrationDocNA2?: string;

  @ApiPropertyOptional({ 
    description: 'Đường dẫn file NA5 (giấy đề nghị visa)', 
    example: 'uploads/na5-document.pdf' 
  })
  @IsString()
  @IsOptional()
  visaRequestDocNA5?: string;

  @ApiPropertyOptional({ 
    description: 'Đường dẫn file báo cáo', 
    example: 'uploads/visit-report.pdf' 
  })
  @IsString()
  @IsOptional()
  reportFile?: string;

  @ApiPropertyOptional({ 
    description: 'ID đối tác (nếu có)', 
    example: 'cuid-partner-123' 
  })
  @IsString()
  @IsOptional()
  partnerId?: string;

  @ApiPropertyOptional({ 
    description: 'ID đơn vị (nếu có)', 
    example: 'cuid-unit-456' 
  })
  @IsString()
  @IsOptional()
  unitId?: string;
}