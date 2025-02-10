import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './services/excel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../country/country.entity';
import { TimeSeries } from '../../timeseries/timeseries.entity';

@Module({
  controllers: [ExcelController],
  providers: [ExcelService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class ExcelModule {}
