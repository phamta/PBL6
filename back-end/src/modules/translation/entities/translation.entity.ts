import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TranslationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum DocumentType {
  CERTIFICATE = 'certificate',
  TRANSCRIPT = 'transcript',
  CONTRACT = 'contract',
  OTHER = 'other',
}

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentTitle: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  documentType: DocumentType;

  @Column()
  originalLanguage: string;

  @Column()
  targetLanguage: string;

  @Column()
  translatedBy: string;

  @Column({ type: 'date' })
  translationDate: Date;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.PENDING,
  })
  status: TranslationStatus;

  @Column({ nullable: true })
  originalDocument: string;

  @Column({ nullable: true })
  translatedDocument: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ type: 'date', nullable: true })
  verificationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
