import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from 'src/timeseries/timeseries.entity';
import { Repository } from 'typeorm';
import { parse, format } from 'date-fns';

@Injectable()
export class MwisecasesService {
  constructor(
    /**
     * Inject timeseries Repository
     */
    @InjectRepository(TimeSeries)
    private readonly timeseriesRepo: Repository<TimeSeries>,
  ) {}

  async getCountryCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    const result = [];

    const timeseriesData = await this.timeseriesRepo.find();

    const monthlyDataByCountry: {
      [country: string]: {
        [month: string]: {
          confirmed: number;
          deaths: number;
          recovered: number;
        };
      };
    } = {};

    timeseriesData.forEach((entry) => {
      const date = parse(entry.date, 'yyyy-MM-dd', new Date());
      const month = format(date, 'yyyy-MM');

      if (fromDate && date < parse(fromDate, 'yyyy-MM-dd', new Date())) return;
      if (toDate && date > parse(toDate, 'yyyy-MM-dd', new Date())) return;

      if (!monthlyDataByCountry[entry.name]) {
        monthlyDataByCountry[entry.name] = {};
      }

      if (!monthlyDataByCountry[entry.name][month]) {
        monthlyDataByCountry[entry.name][month] = {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        };
      }

      monthlyDataByCountry[entry.name][month].confirmed += entry.confirmed;
      monthlyDataByCountry[entry.name][month].deaths += entry.deaths;
      monthlyDataByCountry[entry.name][month].recovered += entry.recovered;
    });

    for (const country in monthlyDataByCountry) {
      if (monthlyDataByCountry.hasOwnProperty(country)) {
        for (const month in monthlyDataByCountry[country]) {
          const { confirmed, deaths, recovered } =
            monthlyDataByCountry[country][month];

          const isWithinRange =
            (confirmedGte === undefined || confirmed >= confirmedGte) &&
            (confirmedLte === undefined || confirmed <= confirmedLte);

          if (isWithinRange) {
            result.push({
              country,
              month,
              confirmed,
              deaths,
              recovered,
            });
          }
        }
      }
    }

    return result;
  }
}
