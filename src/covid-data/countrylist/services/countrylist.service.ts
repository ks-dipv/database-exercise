import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/country/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountrylistService {
  constructor(
    /**
     * inject country repository
     */
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {}
  public async getCountries(name?: string, code?: string) {
    let result = await this.countryRepo.find();

    if (name) {
      name = name.toLowerCase();
      result = result.filter((country) =>
        country.cName?.toLowerCase().includes(name),
      );
    }

    if (code) {
      code = code.toLowerCase();

      result = result.filter((country) =>
        country.code?.toLowerCase().includes(code),
      );
    }

    return result;
  }
}
