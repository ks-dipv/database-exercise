import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from '../country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createCountry, updateCountry } from '../dtos/add-country.dto';

@Injectable()
export class CountryService {
  constructor(
    /**
     * inject countryRepository
     */

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  public async addCountry(countryData: createCountry) {
    await this.countryRepository.findOne({
      where: { code: countryData.code },
    });

    const newCountry = await this.countryRepository.create(countryData);
    return await this.countryRepository.save(newCountry);
  }

  public async updateCountry(updateCountryDataDto: updateCountry) {
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

  public async getCountry(id: number) {
    const country = await this.countryRepository.findOne({
      where: { id: id },
    });

    if (!country) throw new NotFoundException('Coutnry is not found.');
    const data = await this.countryRepository.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    return data;
  }
}
