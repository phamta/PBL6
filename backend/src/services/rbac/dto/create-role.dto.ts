import { IsNotEmpty, IsString, IsOptional, IsBoolean, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'System Administrator',
  })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  @Length(2, 50, { message: 'Role name must be between 2 and 50 characters' })
  name: string;

  @ApiProperty({
    description: 'Unique role code identifier',
    example: 'system_admin',
  })
  @IsNotEmpty({ message: 'Role code is required' })
  @IsString({ message: 'Role code must be a string' })
  @Length(2, 30, { message: 'Role code must be between 2 and 30 characters' })
  @Matches(/^[a-z][a-z0-9_]*$/, { message: 'Role code must start with letter and contain only lowercase letters, numbers, and underscores' })
  code: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Full system administrator with all permissions',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Role description must be a string' })
  @Length(5, 200, { message: 'Role description must be between 5 and 200 characters' })
  description?: string;

  @ApiProperty({
    description: 'Whether the role is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}