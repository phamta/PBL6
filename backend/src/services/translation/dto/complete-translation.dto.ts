import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteTranslationDto {
  @ApiProperty({ 
    description: 'Đường dẫn file đã dịch', 
    example: 'uploads/translated/diploma_english.pdf' 
  })
  @IsString()
  @IsNotEmpty()
  translatedFile: string;

  @ApiPropertyOptional({ 
    description: 'Đường dẫn file chứng nhận/công chứng (nếu có)', 
    example: 'uploads/certification/notarized_diploma.pdf' 
  })
  @IsString()
  @IsOptional()
  certificationFile?: string;

  @ApiPropertyOptional({ 
    description: 'Ghi chú hoàn thành từ người thực hiện', 
    example: 'Đã dịch thuật và công chứng hoàn tất',
    maxLength: 1000 
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}