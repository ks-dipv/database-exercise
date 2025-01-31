import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { CountriesListDto } from './dtos/add-country.dto';
import { PatchCountryDto } from './dtos/patch-country.dto';

@Controller('country')
export class CountryController {
  constructor(
    /**
     * inject country service
     */
    private readonly countryService: CountryService,
  ) {}

  @Post()
  public addCountry(@Body() countryDto: CountriesListDto) {
    return this.countryService.addCountry(countryDto);
  }

  @Patch()
  public updateCountry(@Body() updateCountryDto: PatchCountryDto) {
    return this.countryService.updateCountry(updateCountryDto);
  }
}
