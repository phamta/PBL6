import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TranslationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MANAGER_APPROVAL = 'pending_manager_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum TranslationType {
  ACADEMIC_TRANSCRIPT = 'academic_transcript',
  DIPLOMA_CERTIFICATE = 'diploma_certificate',
  RESEARCH_PAPER = 'research_paper',
  OFFICIAL_DOCUMENT = 'official_document',
  CONTRACT_AGREEMENT = 'contract_agreement',
  LEGAL_DOCUMENT = 'legal_document',
  OTHER = 'other'
}

@Entity('translation_requests')
export class TranslationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'document_title', length: 255 })
  documentTitle: string;

  @Column({
    type: 'enum',
    enum: TranslationType,
    name: 'translation_type'
  })
  translationType: TranslationType;

  @Column({ name: 'source_language', length: 10 })
  sourceLanguage: string;

  @Column({ name: 'target_language', length: 10 })
  targetLanguage: string;

  @Column({ name: 'source_language_other', length: 100, nullable: true })
  sourceLanguageOther?: string;

  @Column({ name: 'target_language_other', length: 100, nullable: true })
  targetLanguageOther?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ name: 'urgency_level', length: 20, nullable: true })
  urgencyLevel?: string;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  specialRequirements?: string;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.DRAFT
  })
  status: TranslationStatus;

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
