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
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SIGNED = 'signed',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

export enum MouType {
  ACADEMIC_COOPERATION = 'academic_cooperation',
  RESEARCH_COLLABORATION = 'research_collaboration',
  STUDENT_EXCHANGE = 'student_exchange',
  FACULTY_EXCHANGE = 'faculty_exchange',
  TRAINING_COOPERATION = 'training_cooperation',
  JOINT_PROGRAM = 'joint_program',
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

  @Column({ length: 300 })
  title: string;

  @Column({ name: 'partner_organization', length: 300 })
  partnerOrganization: string;

  @Column({ name: 'partner_country', length: 100 })
  partnerCountry: string;

  @Column({ name: 'partner_contact_person', length: 200, nullable: true })
  partnerContactPerson?: string;

  @Column({ name: 'partner_email', length: 200, nullable: true })
  partnerEmail?: string;

  @Column({ name: 'partner_phone', length: 20, nullable: true })
  partnerPhone?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: MouType,
    default: MouType.OTHER,
  })
  type: MouType;

  @Column({
    type: 'enum',
    enum: MouPriority,
    default: MouPriority.MEDIUM,
  })
  priority: MouPriority;

  @Column({
    type: 'enum',
    enum: MouStatus,
    default: MouStatus.DRAFT,
  })
  status: MouStatus;

  @Column({ name: 'proposed_date', type: 'date', nullable: true })
  proposedDate?: Date;

  @Column({ name: 'signed_date', type: 'date', nullable: true })
  signedDate?: Date;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  objectives?: string;

  @Column({ type: 'text', nullable: true })
  scope?: string;

  @Column({ type: 'text', nullable: true })
  benefits?: string;

  @Column({ type: 'text', nullable: true })
  terms?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ length: 100, nullable: true })
  department?: string;

  @Column({ length: 100, nullable: true })
  faculty?: string;

  @Column('uuid', { name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @Column('uuid', { name: 'reviewed_by', nullable: true })
  reviewedBy?: string;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @Column({ name: 'review_comments', type: 'text', nullable: true })
  reviewComments?: string;

  @Column('uuid', { name: 'approved_by', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column('uuid', { name: 'rejected_by', nullable: true })
  rejectedBy?: string;

  @Column({ name: 'rejected_at', type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignee?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approver?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'rejected_by' })
  rejector?: User;

  @OneToMany(() => MouDocument, (document) => document.mou)
  documents: MouDocument[];

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

  @ManyToOne(() => Mou, (mou) => mou.documents)
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
