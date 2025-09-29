import { IsNotEmpty, IsString, IsOptional, IsBoolean, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionDto {
  @ApiProperty({
    description: 'Action display name',
    example: 'Create Document',
  })
  @IsNotEmpty({ message: 'Action name is required' })
  @IsString({ message: 'Action name must be a string' })
  @Length(2, 100, { message: 'Action name must be between 2 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Action unique code identifier',
    example: 'document.create',
  })
  @IsNotEmpty({ message: 'Action code is required' })
  @IsString({ message: 'Action code must be a string' })
  @Length(3, 100, { message: 'Action code must be between 3 and 100 characters' })
  @Matches(/^[a-z0-9_.]+$/, { message: 'Action code must contain only lowercase letters, numbers, dots, and underscores' })
  code: string;

  @ApiProperty({
    description: 'Action description',
    example: 'Allows creating new documents such as MOU, agreements, and contracts',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(5, 500, { message: 'Description must be between 5 and 500 characters' })
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

export class UpdateActionDto {
  @ApiProperty({
    description: 'Action display name',
    example: 'Create Document',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Action name must be a string' })
  @Length(2, 100, { message: 'Action name must be between 2 and 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Action description',
    example: 'Allows creating new documents such as MOU, agreements, and contracts',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(5, 500, { message: 'Description must be between 5 and 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Whether the action is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}