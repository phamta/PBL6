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
