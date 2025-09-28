import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO cập nhật user
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
    description: 'Vai trò mới', 
    enum: UserRole,
    example: 'STAFF' 
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;

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