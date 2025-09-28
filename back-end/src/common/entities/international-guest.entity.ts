import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../services/identity/user/entities/user.entity';

@Entity('international_guests')
export class InternationalGuest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Prof., Dr., Mr., Ms.

  @Column()
  fullName: string; // Họ tên đầy đủ

  @Column()
  dateOfBirth: Date; // Ngày sinh

  @Column()
  quocGia: string; // Quốc gia

  @Column()
  gender: string; // Giới tính (Male, Female)

  @Column()
  passportNumber: string; // Số hộ chiếu

  @Column()
  jobPosition: string; // Vị trí công việc

  @Column()
  affiliation: string; // Cơ quan

  @Column()
  email: string; // Email

  @Column()
  phoneNumber: string; // Số điện thoại

  @Column()
  thoiGianDen: Date; // Thời gian đến

  @Column()
  thoiGianVe: Date; // Thời gian về

  @Column()
  mucDichLamViec: string; // Mục đích làm việc

  @Column()
  khoaDonViMoi: string; // Khoa/Đơn vị mời

  @Column({ nullable: true })
  passportFile: string; // File hộ chiếu

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