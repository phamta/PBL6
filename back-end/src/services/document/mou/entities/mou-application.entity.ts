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

export enum MouType {
  COOPERATION = 'cooperation',
  RESEARCH = 'research',
  EDUCATION = 'education',
  EXCHANGE = 'exchange',
  PARTNERSHIP = 'partnership',
  OTHER = 'other',
}

export enum MouStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('mou_applications')
export class MouApplication {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'partner_organization', length: 255 })
  partnerOrganization: string;

  @Column({ name: 'partner_country', length: 100 })
  partnerCountry: string;

  @Column({
    name: 'mou_type',
    type: 'enum',
    enum: MouType,
    default: MouType.COOPERATION,
  })
  mouType: MouType;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'proposed_start_date', type: 'date' })
  proposedStartDate: Date;

  @Column({ name: 'proposed_end_date', type: 'date', nullable: true })
  proposedEndDate: Date;

  @Column({ name: 'expected_outcomes', type: 'text', nullable: true })
  expectedOutcomes: string;

  @Column({ name: 'contact_person_name', length: 255, nullable: true })
  contactPersonName: string;

  @Column({ name: 'contact_person_email', length: 255, nullable: true })
  contactPersonEmail: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MouStatus,
    default: MouStatus.DRAFT,
  })
  status: MouStatus;

  @Column({ name: 'document_paths', type: 'text', array: true, nullable: true })
  documentPaths: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

// Legacy entity for old mou table
@Entity('mou')
export class Mou {
  @PrimaryGeneratedColumn('uuid', { name: 'mou_id' })
  id: string;

  @Column({ name: 'org_name', length: 255, nullable: true })
  orgName: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'status', length: 50 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => MouDocument, (doc) => doc.mou)
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

  @Column({ name: 'uploaded_at', type: 'timestamp' })
  uploadedAt: Date;

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

  @Column({ name: 'status', length: 50 })
  status: string;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

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
