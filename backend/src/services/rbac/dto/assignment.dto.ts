import { IsNotEmpty, IsString, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleToUserDto {
  @ApiProperty({
    description: 'User ID to assign role to',
    example: 'user_123',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @ApiProperty({
    description: 'Role ID to assign',
    example: 'role_123',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsString({ message: 'Role ID must be a string' })
  roleId: string;
}

export class AssignMultipleRolesDto {
  @ApiProperty({
    description: 'User ID to assign roles to',
    example: 'user_123',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @ApiProperty({
    description: 'Array of role IDs to assign',
    example: ['role_123', 'role_456'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Role IDs are required' })
  @IsArray({ message: 'Role IDs must be an array' })
  @IsString({ each: true, message: 'Each role ID must be a string' })
  roleIds: string[];
}

export class AssignPermissionToRoleDto {
  @ApiProperty({
    description: 'Role ID to assign permission to',
    example: 'role_123',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsString({ message: 'Role ID must be a string' })
  roleId: string;

  @ApiProperty({
    description: 'Permission ID to assign',
    example: 'permission_123',
  })
  @IsNotEmpty({ message: 'Permission ID is required' })
  @IsString({ message: 'Permission ID must be a string' })
  permissionId: string;
}

export class AssignMultiplePermissionsDto {
  @ApiProperty({
    description: 'Role ID to assign permissions to',
    example: 'role_123',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsString({ message: 'Role ID must be a string' })
  roleId: string;

  @ApiProperty({
    description: 'Array of permission IDs to assign',
    example: ['permission_123', 'permission_456'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Permission IDs are required' })
  @IsArray({ message: 'Permission IDs must be an array' })
  @IsString({ each: true, message: 'Each permission ID must be a string' })
  permissionIds: string[];
}

export class AssignActionToPermissionDto {
  @ApiProperty({
    description: 'Permission ID to assign action to',
    example: 'permission_123',
  })
  @IsNotEmpty({ message: 'Permission ID is required' })
  @IsString({ message: 'Permission ID must be a string' })
  permissionId: string;

  @ApiProperty({
    description: 'Action ID to assign',
    example: 'action_123',
  })
  @IsNotEmpty({ message: 'Action ID is required' })
  @IsString({ message: 'Action ID must be a string' })
  actionId: string;
}

export class AssignMultipleActionsDto {
  @ApiProperty({
    description: 'Permission ID to assign actions to',
    example: 'permission_123',
  })
  @IsNotEmpty({ message: 'Permission ID is required' })
  @IsString({ message: 'Permission ID must be a string' })
  permissionId: string;

  @ApiProperty({
    description: 'Array of action IDs to assign',
    example: ['action_123', 'action_456'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Action IDs are required' })
  @IsArray({ message: 'Action IDs must be an array' })
  @IsString({ each: true, message: 'Each action ID must be a string' })
  actionIds: string[];
}