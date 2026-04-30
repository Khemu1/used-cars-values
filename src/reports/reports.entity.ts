import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => User, (user) => user.reports, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column('numeric', { precision: 10, scale: 2 })
  price!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  mileage!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  longitude!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  latitude!: number;

  @Column('varchar', { length: 255 })
  make!: string;

  @Column('varchar', { length: 255 })
  model!: string;

  @Column('integer')
  year!: number;

  @Column('boolean', { default: false })
  approved!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
