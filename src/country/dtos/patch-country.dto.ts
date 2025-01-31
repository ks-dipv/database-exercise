import { PartialType } from '@nestjs/mapped-types';
import { CountriesListDto } from './add-country.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchCountryDto extends PartialType(CountriesListDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
