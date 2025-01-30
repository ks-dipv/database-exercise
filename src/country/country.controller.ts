import { Body, Controller, Post } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { CountriesListDto } from './dtos/add-country.dto';

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
}
