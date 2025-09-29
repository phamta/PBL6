import { IsNotEmpty, IsString, IsOptional, IsBoolean, Length, Matches, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role display name',
    example: 'System Administrator',
  })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  @Length(2, 100, { message: 'Role name must be between 2 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Role unique code identifier',
    example: 'system_admin',
  })
  @IsNotEmpty({ message: 'Role code is required' })
  @IsString({ message: 'Role code must be a string' })
  @Length(2, 50, { message: 'Role code must be between 2 and 50 characters' })
  @Matches(/^[a-z0-9_]+$/, { message: 'Role code must contain only lowercase letters, numbers, and underscores' })
  code: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Full system access with administrative privileges',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(5, 500, { message: 'Description must be between 5 and 500 characters' })
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

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Role display name',
    example: 'System Administrator',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Role name must be a string' })
  @Length(2, 100, { message: 'Role name must be between 2 and 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Full system access with administrative privileges',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(5, 500, { message: 'Description must be between 5 and 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Whether the role is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}

export class AssignPermissionsToRoleDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the role',
    example: ['perm_123', 'perm_456'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Permission IDs are required' })
  @IsArray({ message: 'Permission IDs must be an array' })
  @IsString({ each: true, message: 'Each permission ID must be a string' })
  permissionIds: string[];
}