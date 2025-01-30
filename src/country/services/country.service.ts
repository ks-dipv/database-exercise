import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from '../country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CountriesListDto } from '../dtos/add-country.dto';

@Injectable()
export class CountryService {
  constructor(
    /**
     * inject countryRepository
     */

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  public async addCountry(countryData: CountriesListDto) {
    const existingCountry = await this.countryRepository.findOne({
      where: { code: countryData.code },
    });
    if (existingCountry) {
      throw new ConflictException('ISO Code already exists');
    }
    const newCountry = await this.countryRepository.create(countryData);
    return await this.countryRepository.save(newCountry);
  }
}
