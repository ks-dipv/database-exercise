import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeseriesModule } from './timeseries/timeseries.module';
import { CountrylistModule } from './covid-data/countrylist/countrylist.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
