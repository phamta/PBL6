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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
