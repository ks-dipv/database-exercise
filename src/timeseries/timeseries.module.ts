import { Module } from '@nestjs/common';
import { TimeseriesController } from './timeseries.controller';
import { TimeseriesService } from './services/timeseries.service';

@Module({
  controllers: [TimeseriesController],
  providers: [TimeseriesService]
})
export class TimeseriesModule {}
