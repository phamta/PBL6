import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VisaApplication } from './visa-application.entity';

@Entity('visa_reminder')
export class VisaReminder {
  @PrimaryGeneratedColumn('uuid', { name: 'reminder_id' })
  id: string;

  @Column('uuid', { name: 'visa_id' })
  visaId: string;

  @Column({ name: 'reminder_type', length: 100 })
  reminderType: string;

  @Column({ name: 'remind_date', type: 'date' })
  remindDate: Date;

  // Relations
  @ManyToOne(() => VisaApplication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visa_id' })
  visaApplication: VisaApplication;
}
