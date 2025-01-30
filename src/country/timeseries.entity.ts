import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  cName: string;

  @Column()
  confirmed: number;

  @Column()
  deaths: number;

  @Column()
  recovered: number;
}
