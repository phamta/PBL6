import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user-role.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'role_id' })
  id: string;

  @Column({ name: 'role_name', length: 100, unique: true })
  roleName: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  // Relation với UserRole entity  
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
