import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from '../country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CountriesListDto } from '../dtos/add-country.dto';
import { PatchCountryDto } from '../dtos/patch-country.dto';
import { TimeSeries } from '../../timeseries/timeseries.entity';

@Injectable()
export class CountryService {
  constructor(
    /**
     * inject countryRepository
     */

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    /**
     * inject timeSeriesRepository
     */
    @InjectRepository(TimeSeries)
    private readonly timeSeriesRepository: Repository<TimeSeries>,
  ) {}

  public async addCountry(countryData: CountriesListDto) {
    await this.countryRepository.findOne({
      where: { code: countryData.code },
    });

    const newCountry = await this.countryRepository.create(countryData);
    return await this.countryRepository.save(newCountry);
  }

  public async updateCountry(updateCountryDataDto: PatchCountryDto) {
    //find the country
    const existantCountry = await this.countryRepository.findOneBy({
      id: updateCountryDataDto.id,
    });

    //update country
    existantCountry.cName = updateCountryDataDto.cName ?? existantCountry.cName;
    existantCountry.code = updateCountryDataDto.code ?? existantCountry.code;
    existantCountry.flag = updateCountryDataDto.flag ?? existantCountry.flag;

    //save updated country
    return await this.countryRepository.save(existantCountry);
  }

  public async deleteCountry(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.countryRepository.remove(country);
  }
}
