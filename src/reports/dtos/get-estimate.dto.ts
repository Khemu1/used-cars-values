import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year!: number;

  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage!: number;

  @Transform(({ value }) => parseFloat(value as string))
  @IsLongitude()
  lng!: number;

  @Transform(({ value }) => parseFloat(value as string))
  @IsLatitude()
  lat!: number;
}
