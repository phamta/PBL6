import { IsString, IsEnum, IsOptional, IsBoolean, IsNotEmpty, Length, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Tên template (duy nhất)',
    example: 'document_expiring_reminder',
    maxLength: 255,
  })
  @IsString({ message: 'Tên template phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên template không được để trống' })
  @Length(1, 255, { message: 'Tên template phải từ 1-255 ký tự' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Loại thông báo',
    enum: NotificationType,
    example: 'EMAIL',
  })
  @IsEnum(NotificationType, { message: 'Loại thông báo không hợp lệ' })
  type: NotificationType;

  @ApiProperty({
    description: 'Tiêu đề thông báo (dành cho EMAIL)',
    example: 'Nhắc nhở: Tài liệu sắp hết hạn',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là chuỗi' })
  @Length(1, 500, { message: 'Tiêu đề phải từ 1-500 ký tự' })
  @Transform(({ value }) => value?.trim())
  subject?: string;

  @ApiProperty({
    description: 'Nội dung template với biến thay thế ({{variableName}})',
    example: 'Xin chào {{fullName}}, tài liệu "{{documentTitle}}" của bạn sẽ hết hạn vào ngày {{expiryDate}}.',
  })
  @IsString({ message: 'Nội dung phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiProperty({
    description: 'Danh sách biến có thể sử dụng trong template',
    example: ['fullName', 'documentTitle', 'expiryDate', 'recipientEmail'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Variables phải là mảng' })
  @IsString({ each: true, message: 'Mỗi variable phải là chuỗi' })
  variables?: string[];

  @ApiProperty({
    description: 'Template có hoạt động hay không',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean = true;
}