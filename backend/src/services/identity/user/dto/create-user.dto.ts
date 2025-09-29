import { IsString, IsEmail, IsOptional, IsUUID, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO tạo user mới với RBAC
 */
export class CreateUserDto {
  @ApiProperty({ description: 'Email của user', example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ description: 'Tên đầy đủ', example: 'Nguyễn Văn A' })
  @IsString({ message: 'Tên đầy đủ phải là chuỗi' })
  fullName: string;

  @ApiProperty({ 
    description: 'Danh sách ID của các role được gán cho user', 
    type: [String],
    example: ['role-id-1', 'role-id-2'] 
  })
  @IsArray({ message: 'Role IDs phải là mảng' })
  @IsUUID(4, { each: true, message: 'Mỗi role ID phải là UUID hợp lệ' })
  roleIds: string[];

  @ApiPropertyOptional({ description: 'ID của unit/đơn vị' })
  @IsOptional()
  @IsUUID(4, { message: 'ID unit không hợp lệ' })
  unitId?: string;

  @ApiPropertyOptional({ 
    description: 'Trạng thái hoạt động', 
    default: true,
    example: true 
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là boolean' })
  isActive?: boolean = true;
}