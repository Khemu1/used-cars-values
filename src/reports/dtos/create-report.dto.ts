import { IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  mileage!: number;
  @IsNumber()
  longitude!: number;
  @IsNumber()
  latitude!: number;
  @IsString()
  make!: string;
  @IsString()
  model!: string;
  @IsNumber()
  year!: number;
  @IsNumber()
  price!: number;
}
