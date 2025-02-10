import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { TimeSeries } from '../timeseries.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createTimeseries,
  updateTimeseries,
  deleteTimeseries,
} from '../dtos/timeseries.dto';
import { PaginationQueryDto } from '../../pagination/dtos/pagination-query.dto';
import { PaginationProvider } from '../../pagination/providers/pagination.provider';

@Injectable()
export class TimeseriesService {
  constructor(
    /**
     * inject timeseries repository
     */

    @InjectRepository(TimeSeries)
    private readonly timeseriesRepository: Repository<TimeSeries>,

    /**
     * injecting pagination provider
     */
    private readonly paginationProvider: PaginationProvider,

    /**
     * Inject Datasource
     */
    private readonly dataSource: DataSource,
  ) {}

  public async createTimeseries(data: createTimeseries) {
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
      for (let i = 0; i < data.data.length; i++) {
        const existingData = await this.timeseriesRepository.findOne({
          where: { date: data.data[i].date, name: data.name },
        });

        if (existingData)
          throw new BadRequestException(
            'Data is already available for given Date and Country',
          );

        this.validDate(data.data[i].date);
        const timeData = {
          name: data.name,
          date: data.data[i].date,
          confirmed: data.data[i].confirmed,
          deaths: data.data[i].deaths,
          recovered: data.data[i].recovered,
        };
        const newData = await queryRunner.manager.create(TimeSeries, timeData);
        await queryRunner.manager.save(newData);
      }
      return 'Data is Added';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
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

  public async updateTimeseries(data: updateTimeseries) {
    try {
      const existingData = await this.timeseriesRepository.findOne({
        where: { name: data.name, date: data.date },
      });
      Object.assign(existingData, data);
      return await this.timeseriesRepository.save(existingData);
    } catch (error) {
      throw new NotFoundException(
        'Data is not available for given date and country.',
      );
    }
  }

  public async deleteTimeseries(data: deleteTimeseries) {
    try {
      this.validDate(data.from);
      this.validDate(data.to);
      const fromDate = new Date(data.from).getTime();
      const toDate = new Date(data.to).getTime();
      const countryData = await this.timeseriesRepository.find({
        where: { name: data.name },
      });
      const filterData = await countryData.filter((data) => {
        const date = new Date(data.date).getTime() ?? null;
        if (fromDate <= date && date <= toDate) return data;
      });
      const ids = filterData.map((data) => data.id);
      await this.timeseriesRepository.delete(ids);
      return 'Data is deleted.';
    } catch (error) {
      throw new NotFoundException(
        'data is not available for this country or given date range',
      );
    }
  }

  public async getTimeseries(timeseriesQuery: PaginationQueryDto) {
    try {
      const timeseries = await this.paginationProvider.paginateQuery(
        {
          limit: timeseriesQuery.limit,
          page: timeseriesQuery.page,
        },
        this.timeseriesRepository,
      );
      return timeseries;
    } catch (error) {
      throw new NotFoundException('Data is not available');
    }
  }

  private validDate(date: string) {
    const time = new Date(date).getTime();
    const date_ = new Date(date).getDate();
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    if (isNaN(time) || !date_ || !month || !year)
      throw new BadRequestException('Given Date is not valid');
  }
}
