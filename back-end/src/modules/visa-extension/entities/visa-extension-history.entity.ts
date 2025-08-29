import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { VisaExtension, VisaExtensionStatus } from './visa-extension.entity';
import { User } from '../../user/entities/user.entity';

@Entity('visa_extension_history')
export class VisaExtensionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: VisaExtensionStatus,
    name: 'from_status',
  })
  fromStatus: VisaExtensionStatus;

  @Column({
    type: 'enum',
    enum: VisaExtensionStatus,
    name: 'to_status',
  })
  toStatus: VisaExtensionStatus;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ManyToOne(() => VisaExtension, (visaExtension) => visaExtension.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'visa_extension_id' })
  visaExtension: VisaExtension;

  @Column({ name: 'visa_extension_id' })
  visaExtensionId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'changed_by_id' })
  changedBy: User;

  @Column({ name: 'changed_by_id' })
  changedById: string;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
