import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255,unique: true })
  email!: string;

  @Column('varchar', { length: 100 })
  password!: string;
}
