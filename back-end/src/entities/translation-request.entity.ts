import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../modules/user/entities/user.entity';

export enum TranslationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  NEEDS_REVISION = 'needs_revision',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum DocumentType {
  ACADEMIC_PAPER = 'academic_paper',
  RESEARCH_REPORT = 'research_report',
  PATENT = 'patent',
  THESIS = 'thesis',
  DISSERTATION = 'dissertation',
  CONFERENCE_PAPER = 'conference_paper',
  JOURNAL_ARTICLE = 'journal_article',
  BOOK_CHAPTER = 'book_chapter',
  TECHNICAL_MANUAL = 'technical_manual',
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  TRANSCRIPT = 'transcript',
  CONTRACT = 'contract',
  AGREEMENT = 'agreement',
  LEGAL_DOCUMENT = 'legal_document',
  FINANCIAL_REPORT = 'financial_report',
  BUSINESS_PLAN = 'business_plan',
  MARKETING_MATERIAL = 'marketing_material',
  INSTRUCTION_MANUAL = 'instruction_manual',
  SPECIFICATION = 'specification',
  OTHER = 'other',
}

export enum LanguagePair {
  EN_VI = 'en_vi',
  VI_EN = 'vi_en',
  CN_VI = 'cn_vi',
  VI_CN = 'vi_cn',
  JP_VI = 'jp_vi',
  VI_JP = 'vi_jp',
  KR_VI = 'kr_vi',
  VI_KR = 'vi_kr',
  FR_VI = 'fr_vi',
  VI_FR = 'vi_fr',
  DE_VI = 'de_vi',
  VI_DE = 'vi_de',
  ES_VI = 'es_vi',
  VI_ES = 'vi_es',
  RU_VI = 'ru_vi',
  VI_RU = 'vi_ru',
  OTHER = 'other',
}

@Entity('translation_requests')
export class TranslationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  requestCode: string;

  @Column()
  originalDocumentTitle: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Column({
    type: 'enum',
    enum: LanguagePair,
  })
  languagePair: LanguagePair;

  @Column('text')
  purpose: string;

  @Column()
  submittingUnit: string;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.PENDING,
  })
  status: TranslationStatus;

  @Column({ nullable: true })
  originalFilePath?: string;

  @Column({ nullable: true })
  translatedFilePath?: string;

  @Column({ nullable: true })
  confirmationDocumentPath?: string;

  @Column({ type: 'int', default: 0 })
  revisionCount: number;

  @Column('text', { nullable: true })
  reviewComments?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @Column()
  submittedById: string;

  @Column({ nullable: true })
  reviewedById?: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'submittedById' })
  submittedBy: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'reviewedById' })
  reviewedBy?: User;
}
