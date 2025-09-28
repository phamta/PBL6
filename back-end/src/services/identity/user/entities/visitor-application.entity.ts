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

export enum VisitorStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum VisitorPurpose {
  ACADEMIC_CONFERENCE = 'academic_conference',
  RESEARCH_COLLABORATION = 'research_collaboration',
  INSTITUTIONAL_VISIT = 'institutional_visit',
  STUDENT_EXCHANGE = 'student_exchange',
  CULTURAL_EXCHANGE = 'cultural_exchange',
  BUSINESS_MEETING = 'business_meeting',
  OTHER = 'other'
}

@Entity('visitor_applications')
export class VisitorApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'group_name', length: 255 })
  groupName: string;

  @Column({ length: 255 })
  organization: string;

  @Column({ name: 'organization_country', length: 100 })
  organizationCountry: string;

  @Column({
    type: 'enum',
    enum: VisitorPurpose,
    name: 'visit_purpose'
  })
  visitPurpose: VisitorPurpose;

  @Column({ name: 'visit_start_date', type: 'date' })
  visitStartDate: Date;

  @Column({ name: 'visit_end_date', type: 'date' })
  visitEndDate: Date;

  @Column({ name: 'number_of_people', type: 'int' })
  numberOfPeople: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'contact_person_name', length: 255, nullable: true })
  contactPersonName?: string;

  @Column({ name: 'contact_person_email', length: 255, nullable: true })
  contactPersonEmail?: string;

  @Column({ name: 'contact_person_phone', length: 50, nullable: true })
  contactPersonPhone?: string;

  @Column({ length: 255, nullable: true })
  accommodation?: string;

  @Column({ length: 255, nullable: true })
  transportation?: string;

  @Column({ type: 'jsonb', nullable: true })
  members?: Array<{
    fullName: string;
    position?: string;
    nationality?: string;
    passportNo?: string;
  }>;

  @Column({
    type: 'enum',
    enum: VisitorStatus,
    default: VisitorStatus.DRAFT
  })
  status: VisitorStatus;

  @Column({ name: 'document_paths', type: 'text', array: true, nullable: true })
  documentPaths?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
