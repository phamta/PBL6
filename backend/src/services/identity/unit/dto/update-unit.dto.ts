import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsBoolean, IsUUID } from 'class-validator';
import { CreateUnitDto } from './create-unit.dto';

/**
 * DTO cập nhật unit
 */
export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiPropertyOptional({ description: 'Tên đơn vị mới', example: 'Phòng KHCN&ĐN (cập nhật)' })
  @IsOptional()
  @IsString({ message: 'Tên đơn vị phải là chuỗi' })
  name?: string;

  @ApiPropertyOptional({ description: 'Mã đơn vị mới', example: 'KHCN_DN' })
  @IsOptional()
  @IsString({ message: 'Mã đơn vị phải là chuỗi' })
  code?: string;

  @ApiPropertyOptional({ description: 'ID đơn vị cha mới' })
  @IsOptional()
  @IsUUID(4, { message: 'ID đơn vị cha không hợp lệ' })
  parentId?: string;

  @ApiPropertyOptional({ 
    description: 'Cấp độ mới của đơn vị',
    example: 1
  })
  @IsOptional()
  @IsInt({ message: 'Cấp độ phải là số nguyên' })
  level?: number;

  @ApiPropertyOptional({ 
    description: 'Trạng thái hoạt động mới',
    example: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  isActive?: boolean;
}