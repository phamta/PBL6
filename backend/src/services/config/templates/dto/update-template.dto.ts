import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean } from "class-validator";

export class UpdateTemplateDto {
  @ApiProperty({
    description: "Template name",
    required: false,
    example: "Tờ trình ký kết MOU (Updated)",
  })
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  name?: string;

  @ApiProperty({
    description: "Template category",
    required: false,
    example: "Tờ trình",
  })
  @IsOptional()
  @IsString({ message: "Category must be a string" })
  category?: string;

  @ApiProperty({
    description: "Whether this template is mandatory",
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: "isMandatory must be a boolean" })
  isMandatory?: boolean;

  @ApiProperty({
    description: "Whether this template is active",
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;

  @ApiProperty({
    description: "Template description",
    required: false,
    example: "Updated description",
  })
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
