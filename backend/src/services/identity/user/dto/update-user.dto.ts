import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean, IsUUID, IsArray } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO cập nhật user với RBAC
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Email mới', example: 'newemail@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({ description: 'Tên đầy đủ mới', example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString({ message: 'Tên đầy đủ phải là chuỗi' })
  fullName?: string;

  @ApiPropertyOptional({ 
    description: 'Danh sách ID roles mới cho user', 
    type: [String],
    example: ['role-id-1', 'role-id-3'] 
  })
  @IsOptional()
  @IsArray({ message: 'Role IDs phải là mảng' })
  @IsUUID(4, { each: true, message: 'Mỗi role ID phải là UUID hợp lệ' })
  roleIds?: string[];

  @ApiPropertyOptional({ description: 'ID unit mới' })
  @IsOptional()
  @IsUUID(4, { message: 'ID unit không hợp lệ' })
  unitId?: string;

  @ApiPropertyOptional({ 
    description: 'Trạng thái hoạt động mới', 
    example: false 
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  isActive?: boolean;
}