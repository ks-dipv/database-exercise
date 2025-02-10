import { Module } from '@nestjs/common';
import { CwisecasesController } from './cwisecases.controller';
import { CwisecasesService } from './service/cwisecases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSeries } from '../../timeseries/timeseries.entity';

@Module({
  controllers: [CwisecasesController],
  providers: [CwisecasesService],
  imports: [TypeOrmModule.forFeature([TimeSeries])],
})
export class CwisecasesModule {}
