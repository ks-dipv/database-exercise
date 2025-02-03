import { Country } from 'src/country/country.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  date: string;

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
  @JoinColumn({ name: "name", referencedColumnName: "cName"})
  country: Country;
}
