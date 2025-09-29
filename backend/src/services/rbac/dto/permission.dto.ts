import { IsNotEmpty, IsString, IsOptional, IsBoolean, Length, Matches, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission display name',
    example: 'Document Management',
  })
  @IsNotEmpty({ message: 'Permission name is required' })
  @IsString({ message: 'Permission name must be a string' })
  @Length(2, 100, { message: 'Permission name must be between 2 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Permission unique code identifier',
    example: 'document_management',
  })
  @IsNotEmpty({ message: 'Permission code is required' })
  @IsString({ message: 'Permission code must be a string' })
  @Length(2, 50, { message: 'Permission code must be between 2 and 50 characters' })
  @Matches(/^[a-z0-9_]+$/, { message: 'Permission code must contain only lowercase letters, numbers, and underscores' })
  code: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows management of documents including MOU, agreements, and contracts',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(5, 500, { message: 'Description must be between 5 and 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Whether the permission is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Permission display name',
    example: 'Document Management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Permission name must be a string' })
  @Length(2, 100, { message: 'Permission name must be between 2 and 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows management of documents including MOU, agreements, and contracts',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(5, 500, { message: 'Description must be between 5 and 500 characters' })
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

export class AssignActionsToPermissionDto {
  @ApiProperty({
    description: 'Array of action IDs to assign to the permission',
    example: ['action_123', 'action_456'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Action IDs are required' })
  @IsArray({ message: 'Action IDs must be an array' })
  @IsString({ each: true, message: 'Each action ID must be a string' })
  actionIds: string[];
}