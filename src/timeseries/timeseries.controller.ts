import {
  Body,
  Controller,
  Post,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { TimeseriesService } from './services/timeseries.service';
import {
  createTimeseries,
  updateTimeseries,
  deleteTimeseries,
} from './dtos/timeseries.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';

@Controller('timeseries')
@ApiTags('Timeseries')
export class TimeseriesController {
  constructor(
    /**
     * inject timeseries service
     */
    private readonly timeseriesService: TimeseriesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add timeseries data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly add timeseries data',
  })
  @UsePipes(new ValidationPipe())
  async createTimeseries(@Body() data: createTimeseries) {
    return await this.timeseriesService.createTimeseries(data);
  }

  @Put()
  @ApiOperation({
    summary: 'Update timeseries data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly update timeseries data',
  })
  @UsePipes(new ValidationPipe())
  async updateTimeseries(@Body() data: updateTimeseries) {
    return await this.timeseriesService.updateTimeseries(data);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete timeseries data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly delete timeseries data',
  })
  @UsePipes(new ValidationPipe())
  async deleteTime(@Body() data: deleteTimeseries) {
    return await this.timeseriesService.deleteTimeseries(data);
  }

  @Get()
  @ApiOperation({
    summary: 'get all timeseries data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfuly get timeseries data',
  })
  async getTimeseries(@Query() timeseriesQuery: PaginationQueryDto) {
    return await this.timeseriesService.getTimeseries(timeseriesQuery);
  }
}
