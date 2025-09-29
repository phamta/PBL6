import { IsOptional, IsString, IsBoolean, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Permission name',
    example: 'Visa Management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Permission name must be a string' })
  @Length(2, 50, { message: 'Permission name must be between 2 and 50 characters' })
  name?: string;

  @ApiProperty({
    description: 'Unique permission code identifier',
    example: 'visa_management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Permission code must be a string' })
  @Length(2, 50, { message: 'Permission code must be between 2 and 50 characters' })
  @Matches(/^[a-z][a-z0-9_]*$/, { message: 'Permission code must start with letter and contain only lowercase letters, numbers, and underscores' })
  code?: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Manage visa applications and extensions',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Permission description must be a string' })
  @Length(5, 200, { message: 'Permission description must be between 5 and 200 characters' })
  description?: string;

  @ApiProperty({
    description: 'Whether the permission is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}