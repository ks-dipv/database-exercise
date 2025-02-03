import { Controller, Get, Query } from '@nestjs/common';
import { GetTopCountries } from './dtos/get-top-countries.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TopcasesService } from './services/topcases.service';

@Controller('topcases')
@ApiTags('Top N countries')
export class TopcasesController {
  constructor(private readonly topCases: TopcasesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get top N countries with highest confirmed cases',
  })
  @ApiResponse({
    status: 200,
    description:
      'Response contains top N countries with highest number of confirmed cases',
  })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    required: false,
    description: 'return top N countries data based on query',
    example: '2020-01-11',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    required: false,
    description: 'return top N countries data based on query',
    example: '2020-01-25',
  })
  @ApiQuery({
    name: 'top',
    type: 'number',
    required: false,
    description: 'return top N countries data based on in query',
    example: 5,
  })
  public getCases(@Query() getMonthCases: GetTopCountries) {
    const { fromDate, toDate, top } = getMonthCases;
    return this.topCases.getCountryCase(fromDate, toDate, top);
  }
}
