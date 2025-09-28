import { IsString, IsOptional, IsInt, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO tạo unit mới
 */
export class CreateUnitDto {
  @ApiProperty({ description: 'Tên đơn vị', example: 'Phòng Khoa học Công nghệ và Đối ngoại' })
  @IsString({ message: 'Tên đơn vị phải là chuỗi' })
  name: string;

  @ApiPropertyOptional({ description: 'Mã đơn vị', example: 'KHCN&DN' })
  @IsOptional()
  @IsString({ message: 'Mã đơn vị phải là chuỗi' })
  code?: string;

  @ApiPropertyOptional({ description: 'ID đơn vị cha (để tạo cấu trúc phân cấp)' })
  @IsOptional()
  @IsUUID(4, { message: 'ID đơn vị cha không hợp lệ' })
  parentId?: string;

  @ApiPropertyOptional({ 
    description: 'Cấp độ của đơn vị (0: gốc, 1: cấp 1, ...)',
    example: 0,
    default: 0
  })
  @IsOptional()
  @IsInt({ message: 'Cấp độ phải là số nguyên' })
  level?: number = 0;

  @ApiPropertyOptional({ 
    description: 'Trạng thái hoạt động',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  isActive?: boolean = true;
}