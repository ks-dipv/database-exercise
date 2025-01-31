import { BadRequestException, Injectable } from '@nestjs/common';
import { TimeSeries } from '../timeseries.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createTimeseries,
  deleteTimeseries,
  updateTimeseries,
} from '../dtos/timeseries.dto';

@Injectable()
export class TimeseriesService {
  constructor(
    /**
     * inject timeseries repository
     */

    @InjectRepository(TimeSeries)
    private readonly timeseriesRepository: Repository<TimeSeries>,
  ) {}

  public async createTimeseries(data: createTimeseries) {
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
      const newData = await this.timeseriesRepository.create(timeData);
      await this.timeseriesRepository.save(newData);
    }
    return 'Data is added.';
  }

  public async updateTimeseries(data: updateTimeseries) {
    const existingData = await this.timeseriesRepository.findOne({
      where: { name: data.name, date: data.date },
    });
    if (!existingData)
      throw new BadRequestException(
        'Data is not available for given date and country.',
      );
    Object.assign(existingData, data);
    return await this.timeseriesRepository.save(existingData);
  }

  public async deleteTimeseries(data: deleteTimeseries) {
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
