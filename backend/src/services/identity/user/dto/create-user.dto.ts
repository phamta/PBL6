import { IsString, IsEmail, IsOptional, IsUUID, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

/**
 * DTO tạo user mới
 */
export class CreateUserDto {
  @ApiProperty({ description: 'Email của user', example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ description: 'Tên đầy đủ', example: 'Nguyễn Văn A' })
  @IsString({ message: 'Tên đầy đủ phải là chuỗi' })
  fullName: string;

  @ApiProperty({ 
    description: 'Vai trò của user', 
    enum: UserRole,
    example: 'STUDENT' 
  })
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role: UserRole;

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