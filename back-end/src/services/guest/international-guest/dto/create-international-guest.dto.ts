import { IsString, IsDateString, IsOptional, IsIn, IsEmail } from 'class-validator';

export class CreateInternationalGuestDto {
  @IsString()
  @IsIn(['Prof.', 'Dr.', 'Mr.', 'Ms.', 'Mrs.'])
  title: string;

  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  quocGia: string;

  @IsString()
  @IsIn(['Male', 'Female'])
  gender: string;

  @IsString()
  passportNumber: string;

  @IsString()
  jobPosition: string;

  @IsString()
  affiliation: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsDateString()
  thoiGianDen: string;

  @IsDateString()
  thoiGianVe: string;

  @IsString()
  mucDichLamViec: string;

  @IsString()
  khoaDonViMoi: string;

  @IsOptional()
  @IsString()
  passportFile?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}