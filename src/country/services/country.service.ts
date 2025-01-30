import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from '../country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CountriesListDto } from '../dtos/add-country.dto';
import { PatchCountryDto } from '../dtos/patch-country.dto';

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
}
