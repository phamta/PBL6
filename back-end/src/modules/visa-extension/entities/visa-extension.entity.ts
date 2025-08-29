import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { VisaExtensionDocument } from './visa-extension-document.entity';
import { VisaExtensionHistory } from './visa-extension-history.entity';

export enum VisaExtensionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ADDITIONAL_REQUIRED = 'additional_required',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXTENDED = 'extended',
}

export enum VisaType {
  TOURIST = 'tourist',
  BUSINESS = 'business',
  STUDENT = 'student',
  WORK = 'work',
  DIPLOMATIC = 'diplomatic',
  TRANSIT = 'transit',
}

export enum StudyProgram {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  POSTGRADUATE = 'postgraduate',
  EXCHANGE = 'exchange',
  SHORT_TERM = 'short_term',
  RESEARCH = 'research',
}

@Entity('visa_extensions')
export class VisaExtension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_number', unique: true })
  applicationNumber: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'passport_number' })
  passportNumber: string;

  @Column({ name: 'passport_issue_date', type: 'date' })
  passportIssueDate: Date;

  @Column({ name: 'passport_expiry_date', type: 'date' })
  passportExpiryDate: Date;

  @Column({ name: 'passport_issue_place' })
  passportIssuePlace: string;

  @Column()
  nationality: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column({ name: 'current_visa_number' })
  currentVisaNumber: string;

  @Column({
    type: 'enum',
    enum: VisaType,
    name: 'visa_type',
  })
  visaType: VisaType;

  @Column({ name: 'visa_issue_date', type: 'date' })
  visaIssueDate: Date;

  @Column({ name: 'visa_expiry_date', type: 'date' })
  visaExpiryDate: Date;

  @Column({ name: 'visa_issue_place' })
  visaIssuePlace: string;

  @Column({
    type: 'enum',
    enum: StudyProgram,
    name: 'study_program',
    nullable: true,
  })
  studyProgram?: StudyProgram;

  @Column({ name: 'university_name', nullable: true })
  universityName?: string;

  @Column({ name: 'program_duration', nullable: true })
  programDuration?: string;

  @Column({ name: 'expected_graduation_date', type: 'date', nullable: true })
  expectedGraduationDate?: Date;

  @Column({ name: 'reason_for_extension', type: 'text' })
  reasonForExtension: string;

  @Column({ name: 'requested_extension_period' })
  requestedExtensionPeriod: string;

  @Column({ name: 'contact_address', type: 'text' })
  contactAddress: string;

  @Column({ name: 'contact_phone' })
  contactPhone: string;

  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({
    type: 'enum',
    enum: VisaExtensionStatus,
    default: VisaExtensionStatus.DRAFT,
  })
  status: VisaExtensionStatus;

  @Column({ name: 'submission_date', type: 'timestamp', nullable: true })
  submissionDate?: Date;

  @Column({ name: 'review_date', type: 'timestamp', nullable: true })
  reviewDate?: Date;

  @Column({ name: 'approval_date', type: 'timestamp', nullable: true })
  approvalDate?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'additional_requirements', type: 'text', nullable: true })
  additionalRequirements?: string;

  @Column({ name: 'official_document_number', nullable: true })
  officialDocumentNumber?: string;

  @Column({ name: 'new_visa_expiry_date', type: 'date', nullable: true })
  newVisaExpiryDate?: Date;

  @Column({ name: 'processing_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  processingFee?: number;

  @Column({ name: 'payment_status', default: 'unpaid' })
  paymentStatus: string;

  @Column({ name: 'payment_date', type: 'timestamp', nullable: true })
  paymentDate?: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column({ name: 'applicant_id' })
  applicantId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer?: User;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId?: string;

  @OneToMany(() => VisaExtensionDocument, (document) => document.visaExtension, {
    cascade: true,
  })
  documents: VisaExtensionDocument[];

  @OneToMany(() => VisaExtensionHistory, (history) => history.visaExtension, {
    cascade: true,
  })
  history: VisaExtensionHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
