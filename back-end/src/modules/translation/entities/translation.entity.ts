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
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}

export enum DocumentType {
  CERTIFICATE = 'certificate',
  TRANSCRIPT = 'transcript',
  CONTRACT = 'contract',
  OTHER = 'other',
}

@Entity('translation_request')
export class TranslationRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  id: string;

  @Column({ length: 300 })
  title: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: TranslationStatus.PENDING,
  })
  status: TranslationStatus;

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

  @OneToMany(() => TranslationFile, (file) => file.request)
  files: TranslationFile[];

  @OneToMany(() => TranslationHistory, (history) => history.request)
  history: TranslationHistory[];
}

// Để tương thích với code cũ
export const Translation = TranslationRequest;

@Entity('translation_file')
export class TranslationFile {
  @PrimaryGeneratedColumn('uuid', { name: 'file_id' })
  id: string;

  @Column({ name: 'file_type', length: 100 })
  fileType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  // Relations
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

  @Column({ length: 50 })
  status: string;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
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
