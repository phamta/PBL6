import { IsString, IsDateString, IsOptional, IsEnum, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { MouStatus, MouType, MouPriority } from '../entities/mou.entity';
import { MouType as AppMouType, MouStatus as AppMouStatus } from '../entities/mou-application.entity';

export class CreateMouDto {
  // New fields matching the UI form
  @IsString()
  @IsNotEmpty()
  donViDeXuat: string; // Đơn vị đề xuất

  @IsString()
  @IsNotEmpty()
  tenDoiTac: string; // Tên đối tác

  @IsString()
  @IsNotEmpty()
  quocGia: string; // Quốc gia

  @IsString()
  @IsNotEmpty()
  diaChi: string; // Địa chỉ

  @IsNumber()
  @IsNotEmpty()
  namThanhLap: number; // Năm thành lập

  @IsString()
  @IsNotEmpty()
  linhVucHoatDong: string; // Lĩnh vực hoạt động

  @IsString()
  @IsNotEmpty()
  congNgheThongTin: string; // Công nghệ thông tin

  @IsString()
  @IsNotEmpty()
  capKi: string; // Cấp ký

  @IsString()
  @IsNotEmpty()
  loaiVanBanKyKet: string; // Loại văn bản ký kết

  @IsString()
  @IsNotEmpty()
  lyDoVaMucDichKyKet: string; // Lý do và mục đích ký kết

  @IsString()
  @IsNotEmpty()
  nguoiLienHePhuTrachHopTac: string; // Người liên hệ phụ trách hợp tác

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cacTepDinhKem?: string[]; // Các tệp đính kèm

  @IsOptional()
  @IsString()
  trangThai?: string; // Trạng thái

  @IsOptional()
  @IsString()
  ghiChu?: string; // Ghi chú

  // Legacy fields for backward compatibility
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  partnerOrganization?: string;

  @IsString()
  @IsOptional()
  partnerCountry?: string;

  @IsEnum(AppMouType)
  @IsOptional()
  mouType?: AppMouType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  proposedStartDate?: string;

  @IsDateString()
  @IsOptional()
  proposedEndDate?: string;

  @IsString()
  @IsOptional()
  expectedOutcomes?: string;

  @IsString()
  @IsOptional()
  contactPersonName?: string;

  @IsString()
  @IsOptional()
  contactPersonEmail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentPaths?: string[];

  @IsString()
  @IsOptional()
  partnerContact?: string;

  @IsString()
  @IsOptional()
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  partnerPhone?: string;

  @IsEnum(MouType)
  @IsOptional()
  type?: MouType;

  @IsEnum(MouPriority)
  @IsOptional()
  priority?: MouPriority;

  @IsDateString()
  @IsOptional()
  proposedDate?: string;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsOptional()
  @IsEnum(MouStatus)
  status?: MouStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @IsOptional()
  @IsString()
  terms?: string;

  @IsString()
  @IsOptional()
  objectives?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  benefits?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  faculty?: string;
}
