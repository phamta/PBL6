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

export enum VisitorGender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum VisitorPurpose {
  ACADEMIC_EXCHANGE = 'Academic Exchange',
  RESEARCH_COLLABORATION = 'Research Collaboration',
  CONFERENCE = 'Conference',
  WORKSHOP = 'Workshop',
  TRAINING = 'Training',
  BUSINESS_MEETING = 'Business Meeting',
  CULTURAL_EXCHANGE = 'Cultural Exchange',
  OTHER = 'Other',
}

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 100 })
  nationality: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  passportNumber: string;

  @Column({ type: 'enum', enum: VisitorGender })
  gender: VisitorGender;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ type: 'varchar', length: 255 })
  organization: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'timestamp' })
  arrivalDateTime: Date;

  @Column({ type: 'timestamp' })
  departureDateTime: Date;

  @Column({ type: 'enum', enum: VisitorPurpose })
  purpose: VisitorPurpose;

  @Column({ type: 'text', nullable: true })
  purposeDetails: string;

  @Column({ type: 'varchar', length: 255 })
  invitingUnit: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  passportScanPath: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentPath: string;

  @Column({ type: 'varchar', length: 50 })
  visitorCode: string; // Auto-generated code

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
