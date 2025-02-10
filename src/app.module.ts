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
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    CountryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env.development'],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
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
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
