import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

/**
 * DTO cập nhật thông tin người dùng (Profile update)
 * Không bao gồm role assignment - dành cho user tự cập nhật profile
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'Họ và tên',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'ID đơn vị',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID đơn vị phải là chuỗi' })
  unitId?: string;
}

/**
 * DTO đổi mật khẩu
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mật khẩu hiện tại',
  })
  @IsString({ message: 'Mật khẩu hiện tại phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  currentPassword: string;

  @ApiProperty({
    description: 'Mật khẩu mới',
    minLength: 6,
  })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  newPassword: string;
}