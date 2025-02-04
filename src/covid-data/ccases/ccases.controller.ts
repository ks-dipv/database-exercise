import { Controller, Get, Query } from '@nestjs/common';
import { CcasesService } from './services/ccases.service';
import { GetCasesDto } from './dtos/get-cases-detail.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('ccases')
@ApiTags('Cases')
export class CcasesController {
  constructor(private readonly casesService: CcasesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get overview of cases from all countries',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries data fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'fromDate',
    type: 'string',
    required: false,
    description: 'return countries data based on query',
    example: '2020-01-11',
  })
  @ApiQuery({
    name: 'toDate',
    type: 'string',
    required: false,
    description: 'return countries data based on query',
    example: '2020-01-25',
  })
  @ApiQuery({
    name: 'countryCode',
    type: 'string',
    required: false,
    description: 'return country based on the code given in query',
    example: 'IN',
  })
  public getCases(@Query() getCases: GetCasesDto) {
    const { fromDate, toDate, countryCode } = getCases;
    return this.casesService.getCases(fromDate, toDate, countryCode);
  }
}
