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

export enum VisitorStatus {
  PLANNING = 'planning',
  SCHEDULED = 'scheduled',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('visitor_group')
export class VisitorGroup {
  @PrimaryGeneratedColumn('uuid', { name: 'group_id' })
  id: string;

  @Column({ name: 'org_name', length: 300 })
  orgName: string;

  @Column({ length: 100 })
  country: string;

  @Column({ name: 'arrival_date', type: 'date' })
  arrivalDate: Date;

  @Column({ name: 'departure_date', type: 'date' })
  departureDate: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: VisitorStatus.PLANNING,
  })
  status: VisitorStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @Column('uuid', { name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => VisitorMember, (member) => member.group)
  members: VisitorMember[];

  @OneToMany(() => VisitorReport, (report) => report.group)
  reports: VisitorReport[];
}

// Để tương thích với code cũ
export const Visitor = VisitorGroup;

@Entity('visitor_member')
export class VisitorMember {
  @PrimaryGeneratedColumn('uuid', { name: 'member_id' })
  id: string;

  @Column({ name: 'full_name', length: 200 })
  fullName: string;

  @Column({ name: 'passport_no', length: 50 })
  passportNo: string;

  @Column({ length: 100, nullable: true })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @Column('uuid', { name: 'group_id' })
  groupId: string;

  @ManyToOne(() => VisitorGroup, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: VisitorGroup;
}

@Entity('visitor_report')
export class VisitorReport {
  @PrimaryGeneratedColumn('uuid', { name: 'report_id' })
  id: string;

  @Column({ name: 'report_type', length: 100 })
  reportType: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @Column('uuid', { name: 'group_id' })
  groupId: string;

  @ManyToOne(() => VisitorGroup, (group) => group.reports)
  @JoinColumn({ name: 'group_id' })
  group: VisitorGroup;
}
