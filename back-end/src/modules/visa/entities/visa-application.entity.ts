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
import { User } from '../../user/entities/user.entity';

export enum VisaStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
}

@Entity('visa_application')
export class VisaApplication {
  @PrimaryGeneratedColumn('uuid', { name: 'visa_id' })
  id: string;

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

  // Temporary properties for backward compatibility
  applicantName?: string;
  nationality?: string;
  passportNumber?: string;
  currentVisaExpiry?: Date;
  requestedExtensionDate?: Date;
  purpose?: string;
  notes?: string;
  documents?: string[];

  // Relations
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => VisaDocument, (document) => document.visaApplication)
  documents_rel: VisaDocument[];

  @OneToMany(() => VisaHistory, (history) => history.visaApplication)
  history: VisaHistory[];

  @OneToMany(() => VisaReminder, (reminder) => reminder.visaApplication)
  reminders: VisaReminder[];
}

@Entity('visa_document')
export class VisaDocument {
  @PrimaryGeneratedColumn('uuid', { name: 'doc_id' })
  id: string;

  @Column({ name: 'doc_type', length: 100 })
  docType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column('uuid', { name: 'visa_id' })
  visaId: string;

  @ManyToOne(() => VisaApplication, (visa) => visa.documents_rel)
  @JoinColumn({ name: 'visa_id' })
  visaApplication: VisaApplication;
}

@Entity('visa_history')
export class VisaHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  id: string;

  @Column({ length: 50 })
  status: string;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('uuid', { name: 'visa_id' })
  visaId: string;

  @Column('uuid', { name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => VisaApplication, (visa) => visa.history)
  @JoinColumn({ name: 'visa_id' })
  visaApplication: VisaApplication;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  user: User;
}

@Entity('visa_reminder')
export class VisaReminder {
  @PrimaryGeneratedColumn('uuid', { name: 'reminder_id' })
  id: string;

  @Column({ name: 'reminder_type', length: 100 })
  reminderType: string;

  @Column({ name: 'remind_date', type: 'date' })
  remindDate: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('uuid', { name: 'visa_id' })
  visaId: string;

  @ManyToOne(() => VisaApplication, (visa) => visa.reminders)
  @JoinColumn({ name: 'visa_id' })
  visaApplication: VisaApplication;
}
