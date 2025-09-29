import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesToUserDto {
  @ApiProperty({
    description: 'Array of role IDs to assign to the user',
    example: ['role_123', 'role_456'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Role IDs are required' })
  @IsArray({ message: 'Role IDs must be an array' })
  @IsString({ each: true, message: 'Each role ID must be a string' })
  roleIds: string[];

  @ApiProperty({
    description: 'ID of the user assigning the roles (for audit purposes)',
    example: 'admin_123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Assigned by must be a string' })
  assignedBy?: string;
}

export class RemoveRoleFromUserDto {
  @ApiProperty({
    description: 'Role ID to remove from the user',
    example: 'role_123',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsString({ message: 'Role ID must be a string' })
  roleId: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: {
    role: {
      id: string;
      name: string;
      code: string;
      description?: string;
    };
    assignedAt: Date;
  }[];
  permissions: string[]; // Array of action codes
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  permissions: {
    permission: {
      id: string;
      name: string;
      code: string;
      description?: string;
      actions: {
        action: {
          id: string;
          name: string;
          code: string;
          description?: string;
        };
      }[];
    };
  }[];
}