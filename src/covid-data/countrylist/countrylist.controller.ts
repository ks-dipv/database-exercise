import { Controller, Get, Query } from '@nestjs/common';
import { GetCountriesList } from './dtos/get-country-list.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountrylistService } from './services/countrylist.service';

@Controller('countrylist')
@ApiTags('Countries List')
export class CountrylistController {
  constructor(private readonly countriesService: CountrylistService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetches a list of Countries',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'return countries based on query',
    example: 'India',
  })
  @ApiQuery({
    name: 'code',
    type: 'string',
    required: false,
    description: 'return country based on the code given in query',
    example: 'In',
  })
  public getCountries(@Query() getCountriesList: GetCountriesList) {
    const { name, code } = getCountriesList;
    return this.countriesService.getCountries(name, code);
  }
}
