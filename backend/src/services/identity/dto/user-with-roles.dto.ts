import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO cho Role information
 */
export class RoleDto {
  @ApiProperty({ description: 'ID của role', example: 'role-uuid-here' })
  id: string;

  @ApiProperty({ description: 'Tên role', example: 'System Admin' })
  name: string;

  @ApiProperty({ description: 'Mô tả role', example: 'Quản trị viên hệ thống' })
  description: string;
}

/**
 * DTO cho User with RBAC roles
 */
export class UserWithRolesDto {
  @ApiProperty({ description: 'ID của user', example: 'user-uuid-here' })
  id: string;

  @ApiProperty({ description: 'Email của user', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Tên đầy đủ', example: 'Nguyễn Văn A' })
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789' })
  phoneNumber: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Danh sách roles của user', type: [RoleDto] })
  roles: RoleDto[];

  @ApiProperty({ description: 'Thông tin unit', required: false })
  unit?: {
    id: string;
    name: string;
    code: string;
  };
}