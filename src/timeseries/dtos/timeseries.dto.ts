import { IsDateString, IsInt, IsString } from 'class-validator';

export class TimeSeriesDto {
  @IsString()
  cName: string;

  @IsDateString()
  date: Date;

  @IsInt()
  confirmed: number;

  @IsInt()
  deaths: number;

  @IsInt()
  recovered: number;
}
