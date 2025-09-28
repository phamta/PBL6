import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO query units với pagination và filter
 */
export class QueryUnitsDto {
  @ApiPropertyOptional({ 
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn 0' })
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Số items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn 0' })
  @Max(100, { message: 'Limit không được vượt quá 100' })
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Tìm kiếm theo tên hoặc mã đơn vị',
    example: 'Khoa học'
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo ID đơn vị cha',
    example: 'parent-unit-id'
  })
  @IsOptional()
  @IsString({ message: 'Parent ID phải là chuỗi' })
  parentId?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo cấp độ',
    example: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Level phải là số nguyên' })
  level?: number;

  @ApiPropertyOptional({ 
    description: 'Lọc theo trạng thái hoạt động',
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Sắp xếp theo field',
    example: 'name',
    enum: ['name', 'code', 'level', 'createdAt', 'updatedAt']
  })
  @IsOptional()
  @IsString({ message: 'Sort by phải là chuỗi' })
  sortBy?: 'name' | 'code' | 'level' | 'createdAt' | 'updatedAt' = 'createdAt';

  @ApiPropertyOptional({ 
    description: 'Thứ tự sắp xếp',
    example: 'asc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString({ message: 'Sort order phải là chuỗi' })
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({ 
    description: 'Bao gồm thông tin đơn vị con',
    example: true,
    default: false
  })
  @IsOptional()
  @Type(() => Boolean)
  includeChildren?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Bao gồm thông tin users trong đơn vị',
    example: true,
    default: false
  })
  @IsOptional()
  @Type(() => Boolean)
  includeUsers?: boolean = false;
}