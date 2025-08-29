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

export enum VisaStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
}

@Entity('visa_applications')
export class VisaApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicantName: string;

  @Column()
  nationality: string;

  @Column()
  passportNumber: string;

  @Column({ type: 'date' })
  currentVisaExpiry: Date;

  @Column({ type: 'date' })
  requestedExtensionDate: Date;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({
    type: 'enum',
    enum: VisaStatus,
    default: VisaStatus.PENDING,
  })
  status: VisaStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  documents: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.visaApplications)
  @JoinColumn({ name: 'userId' })
  user: User;
}
