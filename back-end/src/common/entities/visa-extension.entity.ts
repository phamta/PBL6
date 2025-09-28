import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../services/identity/user/entities/user.entity';

@Entity('visa_extensions')
export class VisaExtension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ho_ten', length: 255 })
  hoTen: string;

  @Column({ name: 'ngay_sinh', type: 'date' })
  ngaySinh: Date;

  @Column({ name: 'quoc_tich', length: 100 })
  quocTich: string;

  @Column({ name: 'so_ho_chieu', length: 50 })
  soHoChieu: string;

  @Column({ name: 'ngay_cap_ho_chieu', type: 'date' })
  ngayCapHoChieu: Date;

  @Column({ name: 'noi_cap_ho_chieu', length: 255 })
  noiCapHoChieu: string;

  @Column({ name: 'ngay_het_han_ho_chieu', type: 'date' })
  ngayHetHanHoChieu: Date;

  @Column({ name: 'loai_visa', length: 50 })
  loaiVisa: string;

  @Column({ name: 'so_visa', length: 50 })
  soVisa: string;

  @Column({ name: 'ngay_cap_visa', type: 'date' })
  ngayCapVisa: Date;

  @Column({ name: 'ngay_het_han_visa', type: 'date' })
  ngayHetHanVisa: Date;

  @Column({ name: 'ngay_nhap_canh', type: 'date' })
  ngayNhapCanh: Date;

  @Column({ name: 'cua_khau_nhap_canh', length: 255 })
  cuaKhauNhapCanh: string;

  @Column({ name: 'muc_dich_nhap_canh', type: 'text' })
  mucDichNhapCanh: string;

  @Column({ name: 'dia_chi_o_viet_nam', type: 'text' })
  diaChiOVietNam: string;

  @Column({ name: 'ly_do_xin_gia_han', type: 'text' })
  lyDoXinGiaHan: string;

  @Column({ name: 'thoi_gian_gia_han_mong_muon', type: 'integer' })
  thoiGianGiaHanMongMuon: number;

  @Column({ name: 'don_vi_bao_lanh', length: 255, nullable: true })
  donViBaoLanh: string;

  @Column({ name: 'dia_chi_don_vi_bao_lanh', type: 'text', nullable: true })
  diaChiDonViBaoLanh: string;

  @Column({ name: 'nguoi_dai_dien_bao_lanh', length: 255, nullable: true })
  nguoiDaiDienBaoLanh: string;

  @Column({ name: 'so_dien_thoai_lien_he', length: 20 })
  soDienThoaiLienHe: string;

  @Column({ name: 'email_lien_he', length: 255 })
  emailLienHe: string;

  @Column({ name: 'cac_giay_to_dinh_kem', type: 'text', nullable: true })
  cacGiayToDinhKem: string;

  @Column({ name: 'trang_thai', enum: ['pending', 'approved', 'rejected', 'processing'], default: 'pending' })
  trangThai: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  ghiChu: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}