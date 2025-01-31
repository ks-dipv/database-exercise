import { Module } from '@nestjs/common';
import { TimeseriesController } from './timeseries.controller';
import { TimeseriesService } from './services/timeseries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/country/country.entity';
import { TimeSeries } from './timeseries.entity';

@Module({
  controllers: [TimeseriesController],
  providers: [TimeseriesService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class TimeseriesModule {}
