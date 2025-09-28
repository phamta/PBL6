import { IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO thay đổi mật khẩu
 */
export class ChangePasswordDto {
  @ApiProperty({ 
    description: 'Mật khẩu hiện tại',
    example: 'currentPassword123'
  })
  @IsString({ message: 'Mật khẩu hiện tại phải là chuỗi' })
  currentPassword: string;

  @ApiProperty({ 
    description: 'Mật khẩu mới (ít nhất 6 ký tự, có chữ hoa, chữ thường và số)',
    example: 'NewPassword123'
  })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    { message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số' }
  )
  newPassword: string;
}

/**
 * DTO reset mật khẩu (cho admin)
 */
export class ResetPasswordDto {
  @ApiProperty({ 
    description: 'Mật khẩu mới (ít nhất 6 ký tự, có chữ hoa, chữ thường và số)',
    example: 'ResetPassword123'
  })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    { message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số' }
  )
  newPassword: string;

  @ApiPropertyOptional({ 
    description: 'Buộc user đổi mật khẩu lần đăng nhập tiếp theo',
    default: true
  })
  @IsOptional()
  forceChangeOnNextLogin?: boolean = true;
}