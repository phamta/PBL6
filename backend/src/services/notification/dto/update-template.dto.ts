import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiProperty({
    description: 'Cập nhật trạng thái hoạt động của template',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;
}