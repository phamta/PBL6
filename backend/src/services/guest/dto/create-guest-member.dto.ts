import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGuestMemberDto {
  @ApiProperty({ 
    description: 'Họ tên đầy đủ của thành viên', 
    example: 'Nguyễn Văn A' 
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ 
    description: 'Quốc tịch của thành viên', 
    example: 'Vietnamese' 
  })
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({ 
    description: 'Số hộ chiếu', 
    example: 'C1234567' 
  })
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @ApiPropertyOptional({ 
    description: 'Chức vụ của thành viên', 
    example: 'Manager' 
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ 
    description: 'Tổ chức/Công ty', 
    example: 'ABC Company' 
  })
  @IsString()
  @IsOptional()
  organization?: string;

  @ApiPropertyOptional({ 
    description: 'Email liên hệ', 
    example: 'nguyen.vana@example.com' 
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Số điện thoại', 
    example: '+84901234567' 
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Ngày sinh (ISO 8601)', 
    example: '1990-01-01' 
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}