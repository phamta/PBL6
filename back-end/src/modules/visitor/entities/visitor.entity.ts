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

export enum VisitorStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PLANNING = 'planning',
  SCHEDULED = 'scheduled',
  ARRIVED = 'arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum VisitPurpose {
  ACADEMIC_COOPERATION = 'academic_cooperation',
  RESEARCH_COLLABORATION = 'research_collaboration',
  CULTURAL_EXCHANGE = 'cultural_exchange',
  CONFERENCE = 'conference',
  TRAINING = 'training',
  DELEGATION = 'delegation',
  INSPECTION = 'inspection',
  OTHER = 'other',
}

@Entity('visitor_group')
export class VisitorGroup {
  @PrimaryGeneratedColumn('uuid', { name: 'group_id' })
  id: string;

  @Column({ length: 300 })
  title: string;

  @Column({ name: 'organization_name', length: 300 })
  organizationName: string;

  @Column({ length: 100 })
  country: string;

  @Column({ name: 'contact_person', length: 200, nullable: true })
  contactPerson?: string;

  @Column({ name: 'contact_email', length: 200, nullable: true })
  contactEmail?: string;

  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone?: string;

  @Column({
    type: 'enum',
    enum: VisitPurpose,
    default: VisitPurpose.OTHER,
  })
  purpose: VisitPurpose;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'arrival_date', type: 'date' })
  arrivalDate: Date;

  @Column({ name: 'departure_date', type: 'date' })
  departureDate: Date;

  @Column({ name: 'expected_attendees', type: 'int', default: 1 })
  expectedAttendees: number;

  @Column({ name: 'venue_requirements', type: 'text', nullable: true })
  venueRequirements?: string;

  @Column({ name: 'accommodation_needed', type: 'boolean', default: false })
  accommodationNeeded: boolean;

  @Column({ name: 'transportation_needed', type: 'boolean', default: false })
  transportationNeeded: boolean;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  specialRequirements?: string;

  @Column({
    type: 'enum',
    enum: VisitorStatus,
    default: VisitorStatus.DRAFT,
  })
  status: VisitorStatus;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt?: Date;

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

  @Column({ length: 100, nullable: true })
  department?: string;

  @Column({ length: 100, nullable: true })
  faculty?: string;

  @Column('uuid', { name: 'assigned_to', nullable: true })
  assignedTo?: string;

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

  @OneToMany(() => VisitorMember, (member) => member.group)
  members: VisitorMember[];

  @OneToMany(() => VisitorReport, (report) => report.group)
  reports: VisitorReport[];
}

// Để tương thích với code cũ
export const Visitor = VisitorGroup;

@Entity('visitor_member')
export class VisitorMember {
  @PrimaryGeneratedColumn('uuid', { name: 'member_id' })
  id: string;

  @Column({ name: 'full_name', length: 200 })
  fullName: string;

  @Column({ name: 'passport_no', length: 50 })
  passportNo: string;

  @Column({ length: 100, nullable: true })
  nationality?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ length: 10, nullable: true })
  gender?: string;

  @Column({ name: 'job_title', length: 200, nullable: true })
  jobTitle?: string;

  @Column({ length: 100, nullable: true })
  department?: string;

  @Column({ length: 200, nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'dietary_requirements', type: 'text', nullable: true })
  dietaryRequirements?: string;

  @Column({ name: 'special_needs', type: 'text', nullable: true })
  specialNeeds?: string;

  @Column({ name: 'emergency_contact', length: 200, nullable: true })
  emergencyContact?: string;

  @Column({ name: 'emergency_phone', length: 20, nullable: true })
  emergencyPhone?: string;

  @Column('uuid', { name: 'group_id' })
  groupId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => VisitorGroup, (group) => group.members)
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

  // Relations
  @Column('uuid', { name: 'group_id' })
  groupId: string;

  @ManyToOne(() => VisitorGroup, (group) => group.reports)
  @JoinColumn({ name: 'group_id' })
  group: VisitorGroup;
}
