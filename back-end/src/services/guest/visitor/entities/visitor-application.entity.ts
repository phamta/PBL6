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

export enum VisitPurpose {
  ACADEMIC_COLLABORATION = 'academic_collaboration',
  RESEARCH_COOPERATION = 'research_cooperation',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  TRAINING = 'training',
  CULTURAL_EXCHANGE = 'cultural_exchange',
  BUSINESS_MEETING = 'business_meeting',
  OTHER = 'other',
}

export enum VisitorStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('visitor_applications')
export class VisitorApplication {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'group_name', length: 255 })
  groupName: string;

  @Column({ name: 'organization', length: 255 })
  organization: string;

  @Column({ name: 'organization_country', length: 100 })
  organizationCountry: string;

  @Column({
    name: 'visit_purpose',
    type: 'enum',
    enum: VisitPurpose,
    default: VisitPurpose.ACADEMIC_COLLABORATION,
  })
  visitPurpose: VisitPurpose;

  @Column({ name: 'visit_start_date', type: 'date' })
  visitStartDate: Date;

  @Column({ name: 'visit_end_date', type: 'date' })
  visitEndDate: Date;

  @Column({ name: 'number_of_people', type: 'int' })
  numberOfPeople: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'contact_person_name', length: 255, nullable: true })
  contactPersonName: string;

  @Column({ name: 'contact_person_email', length: 255, nullable: true })
  contactPersonEmail: string;

  @Column({ name: 'contact_person_phone', length: 50, nullable: true })
  contactPersonPhone: string;

  @Column({ name: 'accommodation', length: 500, nullable: true })
  accommodation: string;

  @Column({ name: 'transportation', length: 500, nullable: true })
  transportation: string;

  @Column({ name: 'members', type: 'jsonb', nullable: true })
  members: any;

  @Column({
    name: 'status',
    type: 'enum',
    enum: VisitorStatus,
    default: VisitorStatus.DRAFT,
  })
  status: VisitorStatus;

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

// Legacy entities for old visitor tables
@Entity('visitor_group')
export class VisitorGroup {
  @PrimaryGeneratedColumn('uuid', { name: 'group_id' })
  id: string;

  @Column({ name: 'org_name', length: 255, nullable: true })
  orgName: string;

  @Column({ name: 'country', length: 100 })
  country: string;

  @Column({ name: 'arrival_date', type: 'date' })
  arrivalDate: Date;

  @Column({ name: 'departure_date', type: 'date' })
  departureDate: Date;

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
}

@Entity('visitor_member')
export class VisitorMember {
  @PrimaryGeneratedColumn('uuid', { name: 'member_id' })
  id: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ name: 'passport_no', length: 50 })
  passportNo: string;

  @Column({ name: 'role', length: 100, nullable: true })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('uuid', { name: 'group_id' })
  groupId: string;

  @ManyToOne(() => VisitorGroup)
  @JoinColumn({ name: 'group_id' })
  group: VisitorGroup;
}

@Entity('visitor_report')
export class VisitorReport {
  @PrimaryGeneratedColumn('uuid', { name: 'report_id' })
  id: string;

  @Column({ name: 'report_type', length: 100 })
  reportType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('uuid', { name: 'group_id' })
  groupId: string;

  @ManyToOne(() => VisitorGroup)
  @JoinColumn({ name: 'group_id' })
  group: VisitorGroup;
}
