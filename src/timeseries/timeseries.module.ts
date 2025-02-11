import { Module } from '@nestjs/common';
import { TimeseriesController } from './timeseries.controller';
import { TimeseriesService } from './services/timeseries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../country/country.entity';
import { TimeSeries } from './timeseries.entity';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  controllers: [TimeseriesController],
  providers: [TimeseriesService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries]), PaginationModule],
})
export class TimeseriesModule {}
