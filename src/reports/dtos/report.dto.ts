import { Expose, Transform } from 'class-transformer';
import { Report } from '../reports.entity';
export class ReportDto {
  @Expose()
  id!: number;
  @Transform(({ obj }) => (obj as Report).user?.id)
  @Expose()
  user_id!: number;
  @Expose()
  price!: number;
  @Expose()
  mileage!: number;
  @Expose()
  longitude!: number;
  @Expose()
  latitude!: number;
  @Expose()
  make!: string;
  @Expose()
  model!: string;
  @Expose()
  year!: number;
  @Expose()
  approved!: boolean;
  @Expose()
  created_at!: Date;
  @Expose()
  updated_at!: Date;
}
