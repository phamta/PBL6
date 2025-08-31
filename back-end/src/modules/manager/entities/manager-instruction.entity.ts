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

export enum InstructionType {
  PRIORITY = 'priority',
  GENERAL = 'general',
  URGENT = 'urgent'
}

export enum InstructionStatus {
  SENT = 'sent',
  READ = 'read',
  ACKNOWLEDGED = 'acknowledged'
}

@Entity('manager_instructions')
export class ManagerInstruction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'sender_id' })
  senderId: string;

  @Column('uuid', { name: 'recipient_id' })
  recipientId: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: InstructionType.GENERAL,
  })
  type: InstructionType;

  @Column({
    type: 'varchar',
    length: 20,
    default: InstructionStatus.SENT,
  })
  status: InstructionStatus;

  @Column('uuid', { name: 'related_entity_id', nullable: true })
  relatedEntityId?: string;

  @Column({ name: 'related_entity_type', length: 50, nullable: true })
  relatedEntityType?: string; // 'visa', 'mou', 'visitor', 'translation'

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ name: 'acknowledged_at', type: 'timestamp', nullable: true })
  acknowledgedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
