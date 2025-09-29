import { IsOptional, IsString, IsEnum, IsBoolean, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationStatus } from '@prisma/client';

export class FilterNotificationDto {
  @ApiProperty({
    description: 'Số trang hiện tại',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page phải là số nguyên' })
  @Min(1, { message: 'Page phải >= 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng item trên mỗi trang',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải >= 1' })
  @Max(100, { message: 'Limit không được > 100' })
  limit?: number = 20;

  @ApiProperty({
    description: 'Tìm kiếm theo nội dung hoặc recipient',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search phải là chuỗi' })
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiProperty({
    description: 'Lọc theo loại thông báo',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType, { message: 'Type không hợp lệ' })
  type?: NotificationType;

  @ApiProperty({
    description: 'Lọc theo trạng thái',
    enum: NotificationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationStatus, { message: 'Status không hợp lệ' })
  status?: NotificationStatus;

  @ApiProperty({
    description: 'Lọc theo người gửi',
    example: 'cm1a2b3c4d5e6f7g8h9i0j1k',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'SentById phải là chuỗi' })
  sentById?: string;

  @ApiProperty({
    description: 'Lọc từ ngày tạo (ISO date)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'CreatedFrom phải là ISO date string' })
  createdFrom?: string;

  @ApiProperty({
    description: 'Lọc đến ngày tạo (ISO date)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'CreatedTo phải là ISO date string' })
  createdTo?: string;

  @ApiProperty({
    description: 'Sắp xếp theo field',
    enum: ['createdAt', 'sentAt', 'status'],
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'SortBy phải là chuỗi' })
  sortBy?: 'createdAt' | 'sentAt' | 'status' = 'createdAt';

  @ApiProperty({
    description: 'Thứ tự sắp xếp',
    enum: ['asc', 'desc'],
    default: 'desc',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'SortOrder phải là chuỗi' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class FilterTemplateDto {
  @ApiProperty({
    description: 'Số trang hiện tại',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page phải là số nguyên' })
  @Min(1, { message: 'Page phải >= 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng item trên mỗi trang',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải >= 1' })
  @Max(100, { message: 'Limit không được > 100' })
  limit?: number = 20;

  @ApiProperty({
    description: 'Tìm kiếm theo tên template',
    example: 'document_expiring',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search phải là chuỗi' })
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiProperty({
    description: 'Lọc theo loại thông báo',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType, { message: 'Type không hợp lệ' })
  type?: NotificationType;

  @ApiProperty({
    description: 'Lọc theo trạng thái hoạt động',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;

  @ApiProperty({
    description: 'Sắp xếp theo field',
    enum: ['name', 'type', 'createdAt', 'updatedAt'],
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'SortBy phải là chuỗi' })
  sortBy?: 'name' | 'type' | 'createdAt' | 'updatedAt' = 'createdAt';

  @ApiProperty({
    description: 'Thứ tự sắp xếp',
    enum: ['asc', 'desc'],
    default: 'desc',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'SortOrder phải là chuỗi' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}