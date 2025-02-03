import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTopCountries {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Enter the starting date',
    example: 'India',
  })
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Enter the ending date',
    example: 'India',
  })
  toDate?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(15)
  @IsNotEmpty()
  @ApiPropertyOptional({
    description:
      'Enter the number fot top N countries with highest number of confirmed cases',
    example: 10,
  })
  top: number;
}
