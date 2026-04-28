import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255, unique: true })
  email!: string;

  @Column('varchar', { length: 100 })
  password!: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => Report, (report) => report.user)
  reports!: Report[];
}
