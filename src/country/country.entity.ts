import { TimeSeries } from 'src/timeseries/timeseries.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['code'])
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  cName: string;

  @Column({
    type: 'varchar',
  })
  flag: string;

  @Column({
    type: 'varchar',
  })
  code: string;

  @OneToMany(() => TimeSeries, (time) => time.country)
  timeseries: TimeSeries[];
}
