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

export enum TranslationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
}

export enum TranslationType {
  OFFICIAL_TRANSLATION = 'official_translation',
  CERTIFIED_TRANSLATION = 'certified_translation',
  NOTARIZED_TRANSLATION = 'notarized_translation',
  ACADEMIC_TRANSLATION = 'academic_translation',
  LEGAL_TRANSLATION = 'legal_translation',
  TECHNICAL_TRANSLATION = 'technical_translation',
  OTHER = 'other',
}

export enum DocumentType {
  DIPLOMA = 'diploma',
  TRANSCRIPT = 'transcript',
  CERTIFICATE = 'certificate',
  CONTRACT = 'contract',
  PASSPORT = 'passport',
  BIRTH_CERTIFICATE = 'birth_certificate',
  MARRIAGE_CERTIFICATE = 'marriage_certificate',
  LEGAL_DOCUMENT = 'legal_document',
  MEDICAL_RECORD = 'medical_record',
  OTHER = 'other',
}

export enum LanguagePair {
  EN_TO_VI = 'en_to_vi',
  VI_TO_EN = 'vi_to_en',
  EN_TO_FR = 'en_to_fr',
  FR_TO_EN = 'fr_to_en',
  VI_TO_FR = 'vi_to_fr',
  FR_TO_VI = 'fr_to_vi',
  OTHER = 'other',
}

@Entity('translation_requests')
export class TranslationRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  id: string;

  @Column({ length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TranslationType,
    default: TranslationType.OFFICIAL_TRANSLATION,
  })
  translationType: TranslationType;

  @Column({
    type: 'enum',
    enum: DocumentType,
    nullable: true,
  })
  documentType: DocumentType;

  @Column({
    type: 'enum',
    enum: LanguagePair,
    default: LanguagePair.VI_TO_EN,
  })
  languagePair: LanguagePair;

  @Column({ length: 10, nullable: true })
  sourceLanguage: string;

  @Column({ length: 10, nullable: true })
  targetLanguage: string;

  @Column({ type: 'int', nullable: true })
  numberOfPages: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalCost: number;

  @Column({ type: 'text', nullable: true })
  specialRequirements: string;

  @Column({ type: 'date', nullable: true })
  requestedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'text', nullable: true })
  clientNotes: string;

  @Column({ type: 'text', nullable: true })
  specialistNotes: string;

  @Column({ type: 'text', nullable: true })
  managerNotes: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.DRAFT,
  })
  status: TranslationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  // Relations
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column('uuid', { name: 'reviewed_by', nullable: true })
  reviewedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column('uuid', { name: 'approved_by', nullable: true })
  approvedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column('uuid', { name: 'assigned_to', nullable: true })
  assignedTo: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedSpecialist: User;

  @OneToMany(() => TranslationFile, (file) => file.request)
  files: TranslationFile[];

  @OneToMany(() => TranslationHistory, (history) => history.request)
  history: TranslationHistory[];
}

// Để tương thích với code cũ
export const Translation = TranslationRequest;

@Entity('translation_files')
export class TranslationFile {
  @PrimaryGeneratedColumn('uuid', { name: 'file_id' })
  id: string;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'file_type', length: 100 })
  fileType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ name: 'is_original', type: 'boolean', default: true })
  isOriginal: boolean;

  @Column({ name: 'is_translated', type: 'boolean', default: false })
  isTranslated: boolean;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  // Relations
  @Column('uuid', { name: 'request_id' })
  requestId: string;

  @ManyToOne(() => TranslationRequest, (request) => request.files)
  @JoinColumn({ name: 'request_id' })
  request: TranslationRequest;

  @Column('uuid', { name: 'uploaded_by' })
  uploadedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}

@Entity('translation_history')
export class TranslationHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  id: string;

  @Column({ 
    type: 'enum',
    enum: TranslationStatus,
  })
  fromStatus: TranslationStatus;

  @Column({ 
    type: 'enum',
    enum: TranslationStatus,
  })
  toStatus: TranslationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @Column('uuid', { name: 'request_id' })
  requestId: string;

  @ManyToOne(() => TranslationRequest, (request) => request.history)
  @JoinColumn({ name: 'request_id' })
  request: TranslationRequest;

  @Column('uuid', { name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  user: User;
}
