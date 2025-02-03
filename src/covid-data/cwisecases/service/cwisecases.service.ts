import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from 'src/timeseries/timeseries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CwisecasesService {
  constructor(
    /**
     * Inject timeseries Repository
     */
    @InjectRepository(TimeSeries)
    private readonly timeseriesRepo: Repository<TimeSeries>,
  ) {}

  public async getCountryCase(
    fromDate?: string,
    toDate?: string,
    confirmedGte?: number,
    confirmedLte?: number,
  ) {
    const response = [];

    const timeseriesData = await this.timeseriesRepo.find();

    const from = fromDate ? new Date(fromDate) : new Date('2000-01-01');
    const to = toDate ? new Date(toDate) : new Date();

    const groupedByCountry = timeseriesData.reduce((acc, entry) => {
      const entryDate = new Date(entry.date);
      if (entryDate >= from && entryDate <= to) {
        if (!acc[entry.name]) {
          acc[entry.name] = [];
        }
        acc[entry.name].push(entry);
      }
      return acc;
    }, {});

    for (const [country, data] of Object.entries(groupedByCountry)) {
      const totals = (data as TimeSeries[]).reduce(
        (acc, curr) => {
          acc.confirmed += curr.confirmed;
          acc.deaths += curr.deaths;
          acc.recovered += curr.recovered;
          return acc;
        },
        { confirmed: 0, deaths: 0, recovered: 0 },
      );

      if (
        (confirmedGte !== undefined && totals.confirmed < confirmedGte) ||
        (confirmedLte !== undefined && totals.confirmed > confirmedLte)
      ) {
        continue;
      }

      response.push({
        country,
        totals,
      });
    }

    return response;
  }
}
