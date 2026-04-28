import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(100000)
  mileage!: number;
  @IsLongitude()
  longitude!: number;
  @IsLatitude()
  latitude!: number;
  @IsString()
  make!: string;
  @IsString()
  model!: string;
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year!: number;
  @IsNumber()
  @Min(0)
  @Max(100000)
  price!: number;
}
