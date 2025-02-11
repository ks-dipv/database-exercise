import { Module } from '@nestjs/common';
import { CcasesController } from './ccases.controller';
import { CcasesService } from './services/ccases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../country/country.entity';
import { TimeSeries } from '../../timeseries/timeseries.entity';

@Module({
  controllers: [CcasesController],
  providers: [CcasesService],
  imports: [TypeOrmModule.forFeature([Country, TimeSeries])],
})
export class CcasesModule {}
