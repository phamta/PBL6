import { IsNotEmpty, IsString, IsOptional, IsBoolean, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionDto {
  @ApiProperty({
    description: 'Action name',
    example: 'Create Document',
  })
  @IsNotEmpty({ message: 'Action name is required' })
  @IsString({ message: 'Action name must be a string' })
  @Length(2, 50, { message: 'Action name must be between 2 and 50 characters' })
  name: string;

  @ApiProperty({
    description: 'Unique action code identifier (format: resource.action)',
    example: 'document.create',
  })
  @IsNotEmpty({ message: 'Action code is required' })
  @IsString({ message: 'Action code must be a string' })
  @Length(3, 50, { message: 'Action code must be between 3 and 50 characters' })
  @Matches(/^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/, { message: 'Action code must follow format: resource.action (e.g., document.create)' })
  code: string;

  @ApiProperty({
    description: 'Action description',
    example: 'Ability to create new documents',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Action description must be a string' })
  @Length(5, 200, { message: 'Action description must be between 5 and 200 characters' })
  description?: string;

  @ApiProperty({
    description: 'Whether the action is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}