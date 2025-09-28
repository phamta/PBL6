import { IsString, IsOptional } from 'class-validator';

export class CreateTranslationCertificateDto {
  @IsString()
  donViDeXuat: string;

  @IsString()
  tenTaiLieuGoc: string;

  @IsString()
  ngonNguNguon: string;

  @IsString()
  ngonNguDich: string;

  @IsString()
  lyDoXacNhan: string;

  @IsOptional()
  @IsString()
  fileTaiLieuGoc?: string;

  @IsOptional()
  @IsString()
  fileBanDich?: string;

  @IsString()
  nguoiDich: string;

  @IsString()
  ghiChuKhac: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}