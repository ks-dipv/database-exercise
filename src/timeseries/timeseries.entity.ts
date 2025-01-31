import { Country } from 'src/country/country.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({
    type: 'varchar',
  })
  cName: string;

  @Column({
    type: 'int4',
  })
  confirmed: number;

  @Column({
    type: 'int4',
  })
  deaths: number;

  @Column({
    type: 'int4',
  })
  recovered: number;

  @ManyToOne(() => Country, (country) => country.timeseries)
  country: Country;
}
