import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Country } from '../country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createCountry, updateCountry } from '../dtos/add-country.dto';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { PaginationProvider } from 'src/pagination/providers/pagination.provider';

@Injectable()
export class CountryService {
  constructor(
    /**
     * inject countryRepository
     */

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    /**
     * injecting pagination provider
     */
    private readonly paginationProvider: PaginationProvider,

    /**
     * Inject Datasource
     */
    private readonly dataSource: DataSource,
  ) {}

  public async addCountry(countryData: createCountry) {
    //crate Query runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      //Connect Query Runner to datasource
      await queryRunner.connect();

      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Could not connect to the database',
        error,
      );
    }

    try {
      await this.countryRepository.findOne({
        where: { code: countryData.code },
      });

      const newCountry = await queryRunner.manager.create(Country, countryData);
      return await queryRunner.manager.save(newCountry);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        'Data is already available for given Country and ISO code',
        {
          description: String(error),
        },
      );
    } finally {
      try {
        // Release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }
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

  public async getAllCountry(countryQuery: PaginationQueryDto) {
    const country = await this.paginationProvider.paginateQuery(
      {
        limit: countryQuery.limit,
        page: countryQuery.page,
      },
      this.countryRepository,
    );
    return country;
  }
}
