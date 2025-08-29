import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum MouStatus {
  PROPOSING = 'proposing',           // Đang đề xuất
  REVIEWING = 'reviewing',           // Đang duyệt
  PENDING_SUPPLEMENT = 'pending_supplement', // Yêu cầu bổ sung
  APPROVED = 'approved',             // Đã duyệt
  SIGNED = 'signed',                 // Đã ký
  REJECTED = 'rejected',             // Từ chối
  EXPIRED = 'expired',               // Hết hạn
  TERMINATED = 'terminated',         // Chấm dứt
  ACTIVE = 'active',                 // Tạm thời giữ để tương thích với data cũ
}

export enum MouType {
  ACADEMIC_COOPERATION = 'academic_cooperation',
  RESEARCH_COLLABORATION = 'research_collaboration',
  STUDENT_EXCHANGE = 'student_exchange',
  FACULTY_EXCHANGE = 'faculty_exchange',
  TRAINING_COOPERATION = 'training_cooperation',
  OTHER = 'other',
}

export enum MouPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('mous')
export class Mou {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  partnerOrganization: string;

  @Column()
  partnerCountry: string;

  @Column({ nullable: true })
  partnerContact: string;

  @Column({ nullable: true })
  partnerEmail: string;

  @Column({ nullable: true })
  partnerPhone: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: MouType,
    default: MouType.ACADEMIC_COOPERATION,
  })
  type: MouType;

  @Column({
    type: 'enum',
    enum: MouPriority,
    default: MouPriority.MEDIUM,
  })
  priority: MouPriority;

  @Column({ type: 'date', nullable: true })
  proposedDate: Date;

  @Column({ type: 'date', nullable: true })
  signedDate: Date;

  @Column({ type: 'date', nullable: true })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: MouStatus,
    default: MouStatus.PROPOSING,
  })
  status: MouStatus;

  @Column({ type: 'json', nullable: true })
  documents: string[];

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'text', nullable: true })
  objectives: string;

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ type: 'date', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  reviewComments: string;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'date', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  rejectedBy: string;

  @Column({ type: 'date', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  faculty: string;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignee: User;

  @Column({ nullable: true })
  assignedTo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
