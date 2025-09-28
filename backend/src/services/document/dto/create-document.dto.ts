import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { DocumentType } from '@prisma/client';

/**
 * DTO tạo document MOU mới
 */
export class CreateDocumentDto {
  @ApiProperty({
    description: 'Tiêu đề văn bản',
    example: 'Biên bản ghi nhớ hợp tác với Đại học ABC',
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({
    description: 'Loại văn bản',
    enum: DocumentType,
    default: DocumentType.MOU,
  })
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Loại văn bản không hợp lệ' })
  type?: DocumentType;

  @ApiProperty({
    description: 'Tên đối tác',
    example: 'Đại học ABC - Nhật Bản',
  })
  @IsString({ message: 'Tên đối tác phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên đối tác không được để trống' })
  partnerName: string;

  @ApiProperty({
    description: 'Quốc gia đối tác',
    example: 'Nhật Bản',
  })
  @IsString({ message: 'Quốc gia đối tác phải là chuỗi' })
  @IsNotEmpty({ message: 'Quốc gia đối tác không được để trống' })
  partnerCountry: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string;

  @ApiProperty({
    description: 'Nội dung chi tiết',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nội dung phải là chuỗi' })
  content?: string;

  @ApiProperty({
    description: 'Ngày ký kết (ISO string)',
    required: false,
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày ký kết không hợp lệ' })
  signedDate?: string;

  @ApiProperty({
    description: 'Ngày có hiệu lực (ISO string)',
    required: false,
    example: '2024-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày có hiệu lực không hợp lệ' })
  effectiveDate?: string;

  @ApiProperty({
    description: 'Ngày hết hạn (ISO string)',
    required: false,
    example: '2027-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn không hợp lệ' })
  expirationDate?: string;
}