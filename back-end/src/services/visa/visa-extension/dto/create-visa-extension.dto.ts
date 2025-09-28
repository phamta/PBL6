import { IsString, IsDateString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateVisaExtensionDto {
  @IsString()
  hoTen: string;

  @IsDateString()
  ngaySinh: string;

  @IsString()
  quocTich: string;

  @IsString()
  soHoChieu: string;

  @IsDateString()
  ngayCapHoChieu: string;

  @IsString()
  noiCapHoChieu: string;

  @IsDateString()
  ngayHetHanHoChieu: string;

  @IsString()
  loaiVisa: string;

  @IsString()
  soVisa: string;

  @IsDateString()
  ngayCapVisa: string;

  @IsDateString()
  ngayHetHanVisa: string;

  @IsDateString()
  ngayNhapCanh: string;

  @IsString()
  cuaKhauNhapCanh: string;

  @IsString()
  mucDichNhapCanh: string;

  @IsString()
  diaChiOVietNam: string;

  @IsString()
  lyDoXinGiaHan: string;

  @IsNumber()
  thoiGianGiaHanMongMuon: number;

  @IsOptional()
  @IsString()
  donViBaoLanh?: string;

  @IsOptional()
  @IsString()
  diaChiDonViBaoLanh?: string;

  @IsOptional()
  @IsString()
  nguoiDaiDienBaoLanh?: string;

  @IsString()
  soDienThoaiLienHe: string;

  @IsEmail()
  emailLienHe: string;

  @IsOptional()
  @IsString()
  cacGiayToDinhKem?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}
