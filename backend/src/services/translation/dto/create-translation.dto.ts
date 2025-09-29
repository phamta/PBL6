import { IsString, IsNotEmpty, IsOptional, IsEmail, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTranslationDto {
  @ApiProperty({ 
    description: 'Tên người đăng ký', 
    example: 'Nguyễn Văn A' 
  })
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @ApiProperty({ 
    description: 'Email người đăng ký', 
    example: 'nguyen.vana@example.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  applicantEmail: string;

  @ApiPropertyOptional({ 
    description: 'Số điện thoại người đăng ký', 
    example: '+84901234567' 
  })
  @IsString()
  @IsOptional()
  applicantPhone?: string;

  @ApiProperty({ 
    description: 'Tiêu đề tài liệu', 
    example: 'Bằng tốt nghiệp Đại học' 
  })
  @IsString()
  @IsNotEmpty()
  documentTitle: string;

  @ApiProperty({ 
    description: 'Ngôn ngữ gốc', 
    example: 'Vietnamese' 
  })
  @IsString()
  @IsNotEmpty()
  sourceLanguage: string;

  @ApiProperty({ 
    description: 'Ngôn ngữ đích cần dịch', 
    example: 'English' 
  })
  @IsString()
  @IsNotEmpty()
  targetLanguage: string;

  @ApiProperty({ 
    description: 'Loại tài liệu', 
    example: 'Diploma' 
  })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({ 
    description: 'Mục đích sử dụng', 
    example: 'Nộp hồ sơ du học' 
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiPropertyOptional({ 
    description: 'Mức độ khẩn cấp', 
    enum: ['NORMAL', 'URGENT', 'VERY_URGENT'],
    default: 'NORMAL' 
  })
  @IsString()
  @IsIn(['NORMAL', 'URGENT', 'VERY_URGENT'])
  @IsOptional()
  urgentLevel?: string = 'NORMAL';

  @ApiProperty({ 
    description: 'Đường dẫn tệp gốc', 
    example: 'uploads/documents/original_diploma.pdf' 
  })
  @IsString()
  @IsNotEmpty()
  originalFile: string;

  @ApiPropertyOptional({ 
    description: 'File đính kèm (JSON array of file paths)', 
    example: ['uploads/passport.jpg', 'uploads/invitation.pdf'] 
  })
  @IsOptional()
  attachments?: any;

  @ApiPropertyOptional({ 
    description: 'Ghi chú thêm', 
    example: 'Cần dịch công chứng' 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}