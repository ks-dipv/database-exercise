import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './services/country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { TimeSeries } from '../timeseries/timeseries.entity';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries]), PaginationModule],
})
export class CountryModule {}
