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

export enum MOUStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum MOUType {
  ACADEMIC_COOPERATION = 'academic_cooperation',
  RESEARCH_COLLABORATION = 'research_collaboration',
  STUDENT_EXCHANGE = 'student_exchange',
  FACULTY_EXCHANGE = 'faculty_exchange',
  JOINT_PROGRAM = 'joint_program',
  OTHER = 'other'
}

@Entity('mou_applications')
export class MOUApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'partner_organization', length: 255 })
  partnerOrganization: string;

  @Column({ name: 'partner_country', length: 100 })
  partnerCountry: string;

  @Column({
    type: 'enum',
    enum: MOUType,
    name: 'mou_type'
  })
  mouType: MOUType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'proposed_start_date', type: 'date' })
  proposedStartDate: Date;

  @Column({ name: 'proposed_end_date', type: 'date', nullable: true })
  proposedEndDate?: Date;

  @Column({ name: 'expected_outcomes', type: 'text', nullable: true })
  expectedOutcomes?: string;

  @Column({ name: 'contact_person_name', length: 255, nullable: true })
  contactPersonName?: string;

  @Column({ name: 'contact_person_email', length: 255, nullable: true })
  contactPersonEmail?: string;

  @Column({
    type: 'enum',
    enum: MOUStatus,
    default: MOUStatus.DRAFT
  })
  status: MOUStatus;

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
