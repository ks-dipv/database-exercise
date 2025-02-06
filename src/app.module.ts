import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeseriesModule } from './timeseries/timeseries.module';
import { CountrylistModule } from './covid-data/countrylist/countrylist.module';
import { CcasesModule } from './covid-data/ccases/ccases.module';
import { CwisecasesModule } from './covid-data/cwisecases/cwisecases.module';
import { MwisecasesModule } from './covid-data/mwisecases/mwisecases.module';
import { TopcasesModule } from './covid-data/topcases/topcases.module';
import { ExcelModule } from './covid-data/excel/excel.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    CountryModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        autoLoadEntities: true,
        synchronize: true,
        port: 5432,
        username: 'user',
        password: 'password',
        database: 'country',
      }),
    }),
    TimeseriesModule,
    CountrylistModule,
    CcasesModule,
    CwisecasesModule,
    MwisecasesModule,
    TopcasesModule,
    ExcelModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
