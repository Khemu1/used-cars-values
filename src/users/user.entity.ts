import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Report } from '../reports/reports.entity';

export enum Role {
  Admin = 'admin',
  User = 'client',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255, unique: true })
  email!: string;

  @Column('varchar', { length: 255, nullable: true })
  name!: string | null;

  @Column('varchar', { length: 255, default: Role.User })
  role!: Role;

  @Column('varchar', { length: 100 })
  password!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Report, (report) => report.user)
  reports!: Report[];
}
