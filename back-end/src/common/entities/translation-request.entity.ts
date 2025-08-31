import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum TranslationStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  UNDER_REVIEW = "under_review", 
  NEEDS_REVISION = "needs_revision",
  REVIEWED = "reviewed",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed"
}

export enum DocumentType {
  CERTIFICATE = "certificate",
  TRANSCRIPT = "transcript", 
  DIPLOMA = "diploma",
  ACADEMIC_PAPER = "academic_paper",
  CONTRACT = "contract",
  OTHER = "other"
}

export enum LanguagePair {
  EN_VI = "english_vietnamese",
  VI_EN = "vietnamese_english"
}

@Entity("translation_request")
export class TranslationRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "request_number", unique: true })
  requestNumber: string;

  @Column({ name: "request_code", unique: true, nullable: true })
  requestCode: string;

  @Column({ name: "document_title" })
  documentTitle: string;

  @Column({ name: "original_document_title", nullable: true })
  originalDocumentTitle: string;

  @Column({ name: "document_type", nullable: true })
  documentType: string;

  @Column({ name: "language_pair", nullable: true })
  languagePair: string;

  @Column({ name: "original_file_path", nullable: true })
  originalFilePath: string;

  @Column({ name: "translated_file_path", nullable: true })
  translatedFilePath: string;

  @Column({ name: "confirmation_document_path", nullable: true })
  confirmationDocumentPath: string;

  @Column({ name: "submitting_unit", nullable: true })
  submittingUnit: string;

  @Column({ name: "submitted_by_id", nullable: true })
  submittedById: string;

  @Column({ name: "reviewed_by_id", nullable: true })
  reviewedById: string;

  @Column({ name: "revision_count", default: 0 })
  revisionCount: number;

  @Column({ name: "approved_at", type: "timestamp", nullable: true })
  approvedAt: Date;

  @Column({ name: "rejected_at", type: "timestamp", nullable: true })
  rejectedAt: Date;

  @Column({ name: "review_comments", type: "text", nullable: true })
  reviewComments: string;

  @Column({ type: "enum", enum: TranslationStatus, default: TranslationStatus.PENDING })
  status: TranslationStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
