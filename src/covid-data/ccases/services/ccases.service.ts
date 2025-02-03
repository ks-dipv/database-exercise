import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/country/country.entity';
import { TimeSeries } from 'src/timeseries/timeseries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CcasesService {
  constructor(
    /**
     * Inject country repository
     */
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    /**
     * Inject timeseries Repository
     */
    @InjectRepository(TimeSeries)
    private readonly timeseriesRepo: Repository<TimeSeries>,
  ) {}

  public async getCases(
    fromDate?: string,
    toDate?: string,
    countryCode?: string,
  ) {
    let allData = [];

    const timeseries = await this.timeseriesRepo.find();

    if (!countryCode && !fromDate && !toDate) {
      const total = timeseries.reduce(
        (acc, record) => {
          acc.confirmed += record.confirmed;
          acc.deaths += record.deaths;
          acc.recovered += record.recovered;
          return acc;
        },
        { confirmed: 0, deaths: 0, recovered: 0 },
      );

      return total;
    }

    if (countryCode) {
      const country = await this.countryRepo.findOne({
        where: {
          code: countryCode,
        },
      });

      if (country) {
        const countryName = country.cName;

        let countryData = await this.timeseriesRepo.find({
          where: {
            name: countryName,
          },
        });

        if (fromDate || toDate) {
          const from = fromDate ? new Date(fromDate) : new Date('2000-01-01');
          const to = toDate ? new Date(toDate) : new Date();

          countryData = countryData.filter((record) => {
            const recordDate = new Date(record.date);
            return recordDate >= from && recordDate <= to;
          });
        }

        const total = countryData.reduce(
          (acc, record) => {
            acc.confirmed += record.confirmed;
            acc.deaths += record.deaths;
            acc.recovered += record.recovered;
            return acc;
          },
          { confirmed: 0, deaths: 0, recovered: 0 },
        );

        return total;
      }
    }

    const countryDataPromises = timeseries.map(async (country) => {
      const countryData = await this.timeseriesRepo.find({
        where: {
          name: country.name,
        },
      });

      const from = fromDate ? new Date(fromDate) : new Date();
      const to = toDate ? new Date(toDate) : new Date();

      // Filter data based on the date range
      const dataInRange = countryData.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= from && recordDate <= to;
      });

      return dataInRange;
    });

    const filteredDataArrays = await Promise.all(countryDataPromises);

    allData = filteredDataArrays.flat();

    const total = allData.reduce(
      (acc, record) => {
        acc.confirmed += record.confirmed;
        acc.deaths += record.deaths;
        acc.recovered += record.recovered;
        return acc;
      },
      { confirmed: 0, deaths: 0, recovered: 0 },
    );

    return total;
  }
}
