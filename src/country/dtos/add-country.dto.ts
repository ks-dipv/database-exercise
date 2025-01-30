import { IsString } from 'class-validator';

export class CountriesListDto {
  @IsString()
  cname: string;

  @IsString()
  flag: string;

  @IsString()
  code: string;
}
