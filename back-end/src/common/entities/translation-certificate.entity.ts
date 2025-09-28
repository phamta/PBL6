import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../services/identity/user/entities/user.entity';

@Entity('translation_certificates')
export class TranslationCertificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  donViDeXuat: string; // Đơn vị đề xuất

  @Column()
  tenTaiLieuGoc: string; // Tên tài liệu gốc

  @Column()
  ngonNguNguon: string; // Ngôn ngữ nguồn (Tiếng Việt, Tiếng Anh, etc.)

  @Column()
  ngonNguDich: string; // Ngôn ngữ đích (Tiếng Anh, Tiếng Việt, etc.)

  @Column()
  lyDoXacNhan: string; // Lý do xác nhận

  @Column({ nullable: true })
  fileTaiLieuGoc: string; // File tài liệu gốc

  @Column({ nullable: true })
  fileBanDich: string; // File bản dịch

  @Column()
  nguoiDich: string; // Người dịch

  @Column()
  ghiChuKhac: string; // Ghi chú khác

  @Column({ default: 'pending' })
  trangThai: string; // pending, approved, rejected

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