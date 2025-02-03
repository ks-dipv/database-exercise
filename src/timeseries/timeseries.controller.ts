import {
  Body,
  Controller,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TimeseriesService } from './services/timeseries.service';
import { createTimeseries, updateTimeseries } from './dtos/timeseries.dto';

@Controller('timeseries')
export class TimeseriesController {
  constructor(
    /**
     * inject timeseries service
     */
    private readonly timeseriesService: TimeseriesService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createTimeseries(@Body() data: createTimeseries) {
    return await this.timeseriesService.createTimeseries(data);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  async updateTimeseries(@Body() data: updateTimeseries) {
    return await this.timeseriesService.updateTimeseries(data);
  }
}
