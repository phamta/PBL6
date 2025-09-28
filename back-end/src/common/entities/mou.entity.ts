import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../services/identity/user/entities/user.entity';

@Entity('mous')
export class MOU {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  donViDeXuat: string; // Đơn vị đề xuất

  @Column()
  tenDoiTac: string; // Tên đối tác

  @Column()
  quocGia: string; // Quốc gia

  @Column()
  diaChi: string; // Địa chỉ

  @Column()
  namThanhLap: number; // Năm thành lập

  @Column()
  linhVucHoatDong: string; // Lĩnh vực hoạt động

  @Column()
  congNgheThongTin: string; // Công nghệ thông tin

  @Column()
  capKi: string; // Cấp ký

  @Column()
  loaiVanBanKyKet: string; // Loại văn bản ký kết (MOU)

  @Column()
  lyDoVaMucDichKyKet: string; // Lý do và mục đích ký kết

  @Column()
  nguoiLienHePhuTrachHopTac: string; // Người liên hệ phụ trách hợp tác

  @Column({ nullable: true })
  cacTepDinhKem: string; // Các tệp đính kèm (JSON string)

  @Column({ default: 'draft' })
  trangThai: string; // draft, pending, approved, rejected

  @Column({ nullable: true })
  ghiChu: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}