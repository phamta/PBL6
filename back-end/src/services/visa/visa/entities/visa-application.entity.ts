import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../../identity/user/entities/user.entity';
import { VisaDocument } from './visa-document.entity';
import { VisaHistory } from './visa-history.entity';
import { VisaReminder } from './visa-reminder.entity';

export enum VisaStatus {
  PENDING = 'pending',
  SPECIALIST_REVIEW = 'specialist_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
}

@Entity('visa_application')
export class VisaApplication {
  @PrimaryGeneratedColumn('uuid', { name: 'visa_id' })
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'passport_no', length: 50 })
  passportNo: string;

  @Column({ name: 'visa_type', length: 100 })
  visaType: string;

  @Column({ length: 100 })
  country: string;

  @Column({ name: 'expire_date', type: 'date', nullable: true })
  expireDate: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: VisaStatus.PENDING,
  })
  status: VisaStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => VisaDocument, (document) => document.visaApplication, { cascade: true })
  documents: VisaDocument[];

  @OneToMany(() => VisaHistory, (history) => history.visaApplication, { cascade: true })
  history: VisaHistory[];

  @OneToMany(() => VisaReminder, (reminder) => reminder.visaApplication, { cascade: true })
  reminders: VisaReminder[];
}
