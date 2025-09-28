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

export enum TranslationType {
  OFFICIAL_TRANSLATION = 'official_translation',
  CERTIFIED_TRANSLATION = 'certified_translation',
  NOTARIZED_TRANSLATION = 'notarized_translation',
  ACADEMIC_TRANSLATION = 'academic_translation',
  LEGAL_TRANSLATION = 'legal_translation',
  TECHNICAL_TRANSLATION = 'technical_translation',
  OTHER = 'other',
}

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

@Entity('translation_requests')
export class TranslationRequestNew {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'document_title', length: 255 })
  documentTitle: string;

  @Column({
    name: 'translation_type',
    type: 'enum',
    enum: TranslationType,
    default: TranslationType.OFFICIAL_TRANSLATION,
  })
  translationType: TranslationType;

  @Column({ name: 'source_language', length: 50 })
  sourceLanguage: string;

  @Column({ name: 'target_language', length: 50 })
  targetLanguage: string;

  @Column({ name: 'source_language_other', length: 100, nullable: true })
  sourceLanguageOther: string;

  @Column({ name: 'target_language_other', length: 100, nullable: true })
  targetLanguageOther: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'deadline', type: 'date' })
  deadline: Date;

  @Column({ name: 'urgency_level', length: 50, nullable: true })
  urgencyLevel: string;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  specialRequirements: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.DRAFT,
  })
  status: TranslationStatus;

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

// Legacy entities for old translation tables
@Entity('translation_request')
export class TranslationRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  id: string;

  @Column({ name: 'title', length: 300 })
  title: string;

  @Column({ name: 'status', length: 50 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => TranslationFile, (file) => file.request)
  files: TranslationFile[];

  @OneToMany(() => TranslationHistory, (history) => history.request)
  history: TranslationHistory[];
}

@Entity('translation_file')
export class TranslationFile {
  @PrimaryGeneratedColumn('uuid', { name: 'file_id' })
  id: string;

  @Column({ name: 'file_type', length: 100 })
  fileType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'uploaded_at', type: 'timestamp' })
  uploadedAt: Date;

  @Column('uuid', { name: 'request_id' })
  requestId: string;

  @ManyToOne(() => TranslationRequest, (request) => request.files)
  @JoinColumn({ name: 'request_id' })
  request: TranslationRequest;
}

@Entity('translation_history')
export class TranslationHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  id: string;

  @Column({ name: 'status', length: 50 })
  status: string;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column('uuid', { name: 'request_id' })
  requestId: string;

  @Column('uuid', { name: 'updated_by' })
  updatedBy: string;

  @ManyToOne(() => TranslationRequest, (request) => request.history)
  @JoinColumn({ name: 'request_id' })
  request: TranslationRequest;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  user: User;
}

// Export alias for backward compatibility
export const Translation = TranslationRequestNew;
