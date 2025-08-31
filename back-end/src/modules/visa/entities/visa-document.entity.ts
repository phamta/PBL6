import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VisaApplication } from './visa-application.entity';

@Entity('visa_document')
export class VisaDocument {
  @PrimaryGeneratedColumn('uuid', { name: 'doc_id' })
  id: string;

  @Column('uuid', { name: 'visa_id' })
  visaId: string;

  @Column({ name: 'doc_type', length: 100 })
  docType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  // Relations
  @ManyToOne(() => VisaApplication, (visaApp) => visaApp.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visa_id' })
  visaApplication: VisaApplication;
}
