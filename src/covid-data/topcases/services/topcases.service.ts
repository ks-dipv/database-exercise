import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from 'src/timeseries/timeseries.entity';
import { Repository } from 'typeorm';
import { parse } from 'date-fns';

@Injectable()
export class TopcasesService {
  constructor(
    /**
     * Inject timeseries Repository
     */
    @InjectRepository(TimeSeries)
    private readonly timeseriesRepo: Repository<TimeSeries>,
  ) {}

  async getCountryCase(fromDate?: string, toDate?: string, top?: number) {
    const result = [];

    const fromParsed = fromDate
      ? parse(fromDate, 'yyyy-MM-dd', new Date())
      : null;
    const toParsed = toDate ? parse(toDate, 'yyyy-MM-dd', new Date()) : null;

    const timeseriesData = await this.timeseriesRepo.find();

    const countryDataMap = new Map<
      string,
      { confirmed: number; deaths: number; recovered: number }
    >();

    timeseriesData.forEach((entry) => {
      const date = parse(entry.date, 'yyyy-MM-dd', new Date());

      if ((fromParsed && date < fromParsed) || (toParsed && date > toParsed))
        return;

      if (!countryDataMap.has(entry.name)) {
        countryDataMap.set(entry.name, {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        });
      }

      const countryData = countryDataMap.get(entry.name)!;
      countryData.confirmed += entry.confirmed;
      countryData.deaths += entry.deaths;
      countryData.recovered += entry.recovered;
    });

    countryDataMap.forEach((data, country) => {
      if (data.confirmed > 0) {
        result.push({
          country,
          totalConfirmed: data.confirmed,
          totalDeaths: data.deaths,
          totalRecovered: data.recovered,
        });
      }
    });

    return result
      .sort((a, b) => b.totalConfirmed - a.totalConfirmed)
      .slice(0, top);
  }
}
