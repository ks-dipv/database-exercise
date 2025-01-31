import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TimeseriesService } from './services/timeseries.service';
import { createTimeseries } from './dtos/timeseries.dto';

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
}
