import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from '../../../timeseries/timeseries.entity';
import { Repository } from 'typeorm';
import { Workbook } from 'exceljs';
import { Country } from '../../../country/country.entity';

@Injectable()
export class ExcelService {
  constructor(
    /**
     * Inject timeseries Repository
     */
    @InjectRepository(TimeSeries)
    private readonly timeseriesRepo: Repository<TimeSeries>,

    /**
     * Inject country Repository
     */
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {}

  async generateExcel(isoCodes?: string[], year?: number) {
    const countries = await this.countryRepo.find();
    const filteredCountries = isoCodes
      ? countries.filter((country) => isoCodes.includes(country.code))
      : countries;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('COVID Data');

    worksheet.columns = [
      { header: 'Country', key: 'country', width: 30 },
      { header: 'Year-Month', key: 'monthYear', width: 15 },
      { header: 'Total Confirmed', key: 'confirmed', width: 20 },
      { header: 'Total Deaths', key: 'deaths', width: 20 },
      { header: 'Total Recovered', key: 'recovered', width: 20 },
    ];

    for (const country of filteredCountries) {
      const data = await this.timeseriesRepo.find({
        where: { name: country.cName },
      });

      const monthlyData: {
        [key: string]: { confirmed: number; deaths: number; recovered: number };
      } = {};

      data.forEach(({ date, confirmed, deaths, recovered }) => {
        const dateObj = new Date(date);
        const yearFromDate = dateObj.getFullYear();

        if (year && yearFromDate !== year) return;

        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const key = `${yearFromDate}-${month}`;

        if (!monthlyData[key]) {
          monthlyData[key] = { confirmed: 0, deaths: 0, recovered: 0 };
        }

        monthlyData[key].confirmed += confirmed;
        monthlyData[key].deaths += deaths;
        monthlyData[key].recovered += recovered;
      });

      Object.entries(monthlyData).forEach(([monthYear, stats]) => {
        worksheet.addRow({
          country: country.cName,
          monthYear,
          confirmed: stats.confirmed,
          deaths: stats.deaths,
          recovered: stats.recovered,
        });
      });
    }

    return workbook;
  }
}
