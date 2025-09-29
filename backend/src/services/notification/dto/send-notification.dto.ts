import { IsString, IsEnum, IsOptional, IsNotEmpty, IsEmail, IsObject, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Loại thông báo',
    enum: NotificationType,
    example: 'EMAIL',
  })
  @IsEnum(NotificationType, { message: 'Loại thông báo không hợp lệ' })
  type: NotificationType;

  @ApiProperty({
    description: 'Người nhận (email cho EMAIL, userId cho SYSTEM, phone cho SMS)',
    example: 'user@example.com',
  })
  @IsString({ message: 'Recipient phải là chuỗi' })
  @IsNotEmpty({ message: 'Recipient không được để trống' })
  @ValidateIf((o) => o.type === 'EMAIL')
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @Transform(({ value }) => value?.trim())
  recipient: string;

  @ApiProperty({
    description: 'ID của template (nếu sử dụng template có sẵn)',
    example: 'cm1a2b3c4d5e6f7g8h9i0j1k',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Template ID phải là chuỗi' })
  templateId?: string;

  @ApiProperty({
    description: 'Tiêu đề thông báo (bắt buộc nếu không dùng template hoặc type = EMAIL)',
    example: 'Thông báo quan trọng',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Subject phải là chuỗi' })
  @Transform(({ value }) => value?.trim())
  subject?: string;

  @ApiProperty({
    description: 'Nội dung thông báo (bắt buộc nếu không dùng template)',
    example: 'Đây là nội dung thông báo quan trọng dành cho bạn.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Content phải là chuỗi' })
  content?: string;

  @ApiProperty({
    description: 'Dữ liệu để thay thế vào template (key-value pairs)',
    example: {
      fullName: 'Nguyễn Văn A',
      documentTitle: 'Chứng chỉ tiếng Anh',
      expiryDate: '2024-12-31'
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Variables phải là object' })
  variables?: Record<string, any>;
}