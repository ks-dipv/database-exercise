import { IsString } from 'class-validator';

export class CountriesListDto {
  @IsString()
  cName: string;

  @IsString()
  flag: string;

  @IsString()
  code: string;
}
