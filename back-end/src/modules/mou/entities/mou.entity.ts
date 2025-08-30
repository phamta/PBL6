import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum MouStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  // Temporary for backward compatibility
  PROPOSING = 'proposing',
  REVIEWING = 'reviewing',
  PENDING_SUPPLEMENT = 'pending_supplement',
  APPROVED = 'approved',
  SIGNED = 'signed',
  REJECTED = 'rejected',
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

@Entity('mou')
export class Mou {
  @PrimaryGeneratedColumn('uuid', { name: 'mou_id' })
  id: string;

  @Column({ name: 'org_name', length: 300 })
  orgName: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: MouStatus.DRAFT,
  })
  status: MouStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Temporary properties for backward compatibility
  title?: string;
  partnerOrganization?: string;
  partnerCountry?: string;
  partnerContact?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  description?: string;
  type?: MouType;
  priority?: MouPriority;
  proposedDate?: Date;
  signedDate?: Date;
  effectiveDate?: Date;
  expiryDate?: Date;
  documents?: string[];
  terms?: string;
  objectives?: string;
  scope?: string;
  benefits?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComments?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  department?: string;
  faculty?: string;
  assignedTo?: string;

  // Relations
  @Column('uuid', { name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => MouDocument, (document) => document.mou)
  documents_rel: MouDocument[];

  @OneToMany(() => MouHistory, (history) => history.mou)
  history: MouHistory[];
}

@Entity('mou_document')
export class MouDocument {
  @PrimaryGeneratedColumn('uuid', { name: 'doc_id' })
  id: string;

  @Column({ name: 'file_type', length: 100 })
  fileType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  // Relations
  @Column('uuid', { name: 'mou_id' })
  mouId: string;

  @ManyToOne(() => Mou, (mou) => mou.documents_rel)
  @JoinColumn({ name: 'mou_id' })
  mou: Mou;
}

@Entity('mou_history')
export class MouHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  id: string;

  @Column({ length: 50 })
  status: string;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @Column('uuid', { name: 'mou_id' })
  mouId: string;

  @Column('uuid', { name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => Mou, (mou) => mou.history)
  @JoinColumn({ name: 'mou_id' })
  mou: Mou;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  user: User;
}
