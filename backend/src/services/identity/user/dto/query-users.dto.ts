import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

/**
 * DTO query users với pagination và filter
 */
export class QueryUsersDto {
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
    description: 'Tìm kiếm theo tên hoặc email',
    example: 'Nguyễn'
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo vai trò',
    enum: UserRole,
    example: 'STUDENT'
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'Lọc theo ID unit',
    example: 'unit-uuid-here'
  })
  @IsOptional()
  @IsString({ message: 'Unit ID phải là chuỗi' })
  unitId?: string;

  @ApiPropertyOptional({ 
    description: 'Lọc theo trạng thái hoạt động',
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Sắp xếp theo field',
    example: 'createdAt',
    enum: ['fullName', 'email', 'createdAt', 'updatedAt']
  })
  @IsOptional()
  @IsString({ message: 'Sort by phải là chuỗi' })
  sortBy?: 'fullName' | 'email' | 'createdAt' | 'updatedAt' = 'createdAt';

  @ApiPropertyOptional({ 
    description: 'Thứ tự sắp xếp',
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString({ message: 'Sort order phải là chuỗi' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}