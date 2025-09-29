import { IsOptional, IsString, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GuestStatus } from '@prisma/client';

export class FilterGuestDto {
  @ApiPropertyOptional({ 
    description: 'Tìm kiếm theo tên đoàn hoặc người liên hệ', 
    example: 'ABC Company' 
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo trạng thái',
    enum: GuestStatus 
  })
  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;

  @ApiPropertyOptional({ 
    description: 'Lọc theo quốc tịch', 
    example: 'Vietnamese' 
  })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc từ ngày đến (ISO 8601)', 
    example: '2024-01-01' 
  })
  @IsDateString()
  @IsOptional()
  arrivalDateFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc đến ngày đến (ISO 8601)', 
    example: '2024-12-31' 
  })
  @IsDateString()
  @IsOptional()
  arrivalDateTo?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc từ ngày về (ISO 8601)', 
    example: '2024-01-01' 
  })
  @IsDateString()
  @IsOptional()
  departureDateFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc đến ngày về (ISO 8601)', 
    example: '2024-12-31' 
  })
  @IsDateString()
  @IsOptional()
  departureDateTo?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo người tạo', 
    example: 'user-id-123' 
  })
  @IsString()
  @IsOptional()
  createdById?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo người duyệt', 
    example: 'user-id-456' 
  })
  @IsString()
  @IsOptional()
  approvedById?: string;

  @ApiPropertyOptional({ 
    description: 'Số trang (bắt đầu từ 1)', 
    example: 1, 
    default: 1 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Số bản ghi mỗi trang (1-100)', 
    example: 20, 
    default: 20 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ 
    description: 'Sắp xếp theo trường (createdAt, arrivalDate, departureDate)', 
    example: 'createdAt' 
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    description: 'Thứ tự sắp xếp', 
    enum: ['asc', 'desc'],
    default: 'desc' 
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}