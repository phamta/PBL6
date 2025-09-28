import { IsString, IsEmail, IsOptional, MinLength, IsUUID, IsEnum } from 'class-validator';
import { UserStatus } from '../../../common/enums/user.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class AssignRoleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  roleId: string;
}

export class CreateRoleDto {
  @IsString()
  roleName: string;
}

export class UpdateRoleDto {
  @IsString()
  roleName: string;
}

export class SystemSettingsDto {
  general?: {
    siteName?: string;
    siteUrl?: string;
    maintenanceMode?: boolean;
    registrationEnabled?: boolean;
  };
  email?: {
    smtpHost?: string;
    smtpPort?: number;
    fromEmail?: string;
    fromName?: string;
  };
  security?: {
    passwordMinLength?: number;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
  };
  features?: {
    enableNotifications?: boolean;
    enableFileUploads?: boolean;
    maxFileSize?: number;
  };
}

export class BatchDeleteUsersDto {
  @IsUUID('all', { each: true })
  userIds: string[];
}

export class BatchUpdateUserStatusDto {
  @IsUUID('all', { each: true })
  userIds: string[];

  @IsString()
  status: string;
}

export class ClearLogsDto {
  @IsString()
  olderThan: string; // format: "30d", "7d", etc
}
