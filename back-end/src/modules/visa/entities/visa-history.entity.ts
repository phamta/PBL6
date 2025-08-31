import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VisaApplication } from './visa-application.entity';
import { User } from '../../user/entities/user.entity';

@Entity('visa_history')
export class VisaHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  id: string;

  @Column('uuid', { name: 'visa_id' })
  visaId: string;

  @Column({ length: 50 })
  status: string;

  @Column('uuid', { name: 'updated_by' })
  updatedBy: string;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VisaApplication, (visaApp) => visaApp.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visa_id' })
  visaApplication: VisaApplication;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;
}
