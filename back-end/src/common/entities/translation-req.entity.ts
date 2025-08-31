import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TranslationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

@Entity('translation_request')
export class TranslationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'request_number', unique: true })
  requestNumber: string;

  @Column({ name: 'document_title' })
  documentTitle: string;

  @Column({ type: 'enum', enum: TranslationStatus, default: TranslationStatus.PENDING })
  status: TranslationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
