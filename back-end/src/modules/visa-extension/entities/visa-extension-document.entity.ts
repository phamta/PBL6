import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { VisaExtension } from './visa-extension.entity';

export enum DocumentType {
  PASSPORT = 'passport',
  CURRENT_VISA = 'current_visa',
  PHOTO = 'photo',
  INTRODUCTION_LETTER = 'introduction_letter',
  STUDY_CERTIFICATE = 'study_certificate',
  FINANCIAL_PROOF = 'financial_proof',
  ACCOMMODATION_PROOF = 'accommodation_proof',
  HEALTH_INSURANCE = 'health_insurance',
  OTHER = 'other',
}

@Entity('visa_extension_documents')
export class VisaExtensionDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    enumName: 'document_type_enum',
    name: 'document_type',
  })
  documentType: DocumentType;

  @Column({ name: 'is_required', default: true })
  isRequired: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verification_notes', type: 'text', nullable: true })
  verificationNotes?: string;

  @ManyToOne(() => VisaExtension, (visaExtension) => visaExtension.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'visa_extension_id' })
  visaExtension: VisaExtension;

  @Column({ name: 'visa_extension_id' })
  visaExtensionId: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
