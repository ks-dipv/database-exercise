import { Module } from '@nestjs/common';
import { CountrylistController } from './countrylist.controller';
import { CountrylistService } from './services/countrylist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/country/country.entity';

@Module({
  controllers: [CountrylistController],
  providers: [CountrylistService],
  imports: [TypeOrmModule.forFeature([Country])],
})
export class CountrylistModule {}
