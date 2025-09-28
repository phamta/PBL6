import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * DTO đăng ký tài khoản mới
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Email đăng ký',
    example: 'newuser@dntu.edu.vn',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
  })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;

  @ApiProperty({
    description: 'ID đơn vị',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID đơn vị phải là chuỗi' })
  unitId?: string;
}