import { IsOptional, IsString, IsBoolean, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Department Officer',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Role name must be a string' })
  @Length(2, 50, { message: 'Role name must be between 2 and 50 characters' })
  name?: string;

  @ApiProperty({
    description: 'Unique role code identifier',
    example: 'department_officer',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Role code must be a string' })
  @Length(2, 30, { message: 'Role code must be between 2 and 30 characters' })
  @Matches(/^[a-z][a-z0-9_]*$/, { message: 'Role code must start with letter and contain only lowercase letters, numbers, and underscores' })
  code?: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Officer responsible for department operations',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Role description must be a string' })
  @Length(5, 200, { message: 'Role description must be between 5 and 200 characters' })
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