import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../services/identity/user/entities/user.entity';

@Entity('system_activity_logs')
export class SystemActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenDoiTac: string; // Tên đối tác

  @Column()
  quocGia: string; // Quốc gia

  @Column()
  email: string; // Email

  @Column()
  soDienThoai: string; // Số điện thoại

  @Column()
  tinhTrang: string; // Tình trạng (Đã lưu, Đang xử lý, Đã ký)

  @Column()
  ngayXuLy: Date; // Ngày xử lý

  @Column({ nullable: true })
  ghiChu: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}