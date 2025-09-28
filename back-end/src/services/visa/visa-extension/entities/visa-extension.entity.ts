import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../../identity/user/entities/user.entity';
import { VisaExtensionDocument } from './visa-extension-document.entity';
import { VisaExtensionHistory } from './visa-extension-history.entity';

export enum VisaExtensionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ADDITIONAL_REQUIRED = 'additional_required',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXTENDED = 'extended',
}

export enum VisaType {
  TOURIST = 'tourist',
  BUSINESS = 'business',
  STUDENT = 'student',
  WORK = 'work',
  DIPLOMATIC = 'diplomatic',
  TRANSIT = 'transit',
}

export enum StudyProgram {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  EXCHANGE = 'exchange',
  SHORT_TERM = 'short_term',
  RESEARCH = 'research',
}

@Entity('visa_extensions')
export class VisaExtension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_number', unique: true, nullable: true })
  applicationNumber?: string;

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
  donViBaoLanh?: string;

  @Column({ name: 'dia_chi_don_vi_bao_lanh', type: 'text', nullable: true })
  diaChiDonViBaoLanh?: string;

  @Column({ name: 'nguoi_dai_dien_bao_lanh', length: 255, nullable: true })
  nguoiDaiDienBaoLanh?: string;

  @Column({ name: 'so_dien_thoai_lien_he', length: 20 })
  soDienThoaiLienHe: string;

  @Column({ name: 'email_lien_he', length: 255 })
  emailLienHe: string;

  @Column({ name: 'cac_giay_to_dinh_kem', type: 'text', nullable: true })
  cacGiayToDinhKem?: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  ghiChu?: string;

  @Column({ name: 'trang_thai', enum: ['pending', 'approved', 'rejected', 'processing'], default: 'pending' })
  trangThai: string;

  @Column({ name: 'submission_date', type: 'timestamp', nullable: true })
  submissionDate?: Date;

  @Column({ name: 'review_date', type: 'timestamp', nullable: true })
  reviewDate?: Date;

  @Column({ name: 'approval_date', type: 'timestamp', nullable: true })
  approvalDate?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'additional_requirements', type: 'text', nullable: true })
  additionalRequirements?: string;

  @Column({ name: 'official_document_number', nullable: true })
  officialDocumentNumber?: string;

  @Column({ name: 'new_visa_expiry_date', type: 'date', nullable: true })
  newVisaExpiryDate?: Date;

  @Column({ name: 'processing_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  processingFee?: number;

  @Column({ name: 'payment_status', default: 'unpaid' })
  paymentStatus?: string;

  @Column({ name: 'payment_date', type: 'timestamp', nullable: true })
  paymentDate?: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer?: User;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId?: string;

  @OneToMany(() => VisaExtensionDocument, (document) => document.visaExtension, {
    cascade: true,
  })
  documents: VisaExtensionDocument[];

  @OneToMany(() => VisaExtensionHistory, (history) => history.visaExtension, {
    cascade: true,
  })
  history: VisaExtensionHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
