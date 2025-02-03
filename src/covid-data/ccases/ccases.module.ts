import { Module } from '@nestjs/common';
import { CcasesController } from './ccases.controller';
import { CcasesService } from './services/ccases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/country/country.entity';
import { TimeSeries } from 'src/timeseries/timeseries.entity';

@Module({
  controllers: [CcasesController],
  providers: [CcasesService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class CcasesModule {}
