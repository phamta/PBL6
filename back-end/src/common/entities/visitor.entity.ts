import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VisitorStatus {
  SCHEDULED = 'scheduled',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupName: string;

  @Column()
  organizationName: string;

  @Column()
  country: string;

  @Column({ type: 'int' })
  numberOfMembers: number;

  @Column()
  contactPerson: string;

  @Column()
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: 'date' })
  arrivalDate: Date;

  @Column({ type: 'date' })
  departureDate: Date;

  @Column({ type: 'text' })
  purpose: string;

  @Column({
    type: 'enum',
    enum: VisitorStatus,
    default: VisitorStatus.SCHEDULED,
  })
  status: VisitorStatus;

  @Column({ type: 'text', nullable: true })
  itinerary: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  membersList: string[];

  // Additional fields for individual visitor tracking
  @Column({ nullable: true })
  visitorCode: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  passportNumber: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  invitingUnit: string;

  @Column({ nullable: true })
  passportScanPath: string;

  @Column({ nullable: true })
  documentPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
