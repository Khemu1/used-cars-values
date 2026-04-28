import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => User, (user) => user.reports, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column('double precision', { precision: 10, scale: 2 })
  price!: number;

  @Column('double precision', { precision: 10, scale: 2 })
  mileage!: number;

  @Column('double precision', { precision: 10, scale: 2 })
  longitude!: number;

  @Column('double precision', { precision: 10, scale: 2 })
  latitude!: number;

  @Column('varchar', { length: 255 })
  make!: string;

  @Column('varchar', { length: 255 })
  model!: string;

  @Column('integer')
  year!: number;

  @Column('boolean', { default: false })
  approved!: boolean;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
