import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from "class-validator";

export enum TemplateCategory {
  TO_TRINH = "Tờ trình",
  DU_THAO_MOU = "Dự thảo MOU",
  THU_MOI = "Thư mời",
  BAO_CAO = "Báo cáo",
  OTHER = "Khác",
}

export class CreateTemplateDto {
  @ApiProperty({
    description: "Template name",
    example: "Tờ trình ký kết MOU",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  name: string;

  @ApiProperty({
    description: "Template category",
    enum: TemplateCategory,
    example: TemplateCategory.TO_TRINH,
  })
  @IsEnum(TemplateCategory, { message: "Invalid template category" })
  @IsNotEmpty({ message: "Category cannot be empty" })
  category: string;

  @ApiProperty({
    description: "File type (DOCX, PDF, etc.)",
    required: false,
    example: "DOCX",
  })
  @IsOptional()
  @IsString({ message: "File type must be a string" })
  fileType?: string;

  @ApiProperty({
    description: "Whether this template is mandatory",
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: "isMandatory must be a boolean" })
  isMandatory?: boolean;

  @ApiProperty({
    description: "Template description",
    required: false,
    example: "Biểu mẫu tờ trình đề xuất ký kết MOU",
  })
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
