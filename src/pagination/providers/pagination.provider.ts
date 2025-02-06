import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginatioQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (paginatioQuery.page - 1) * paginatioQuery.limit,
      take: paginatioQuery.limit,
    });

    /**
     * calculating page number
     */
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginatioQuery.limit);

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginatioQuery.limit,
        totalItems: totalItems,
        currentPage: paginatioQuery.page,
        totalPages: totalPages,
      },
    };
    return finalResponse;
  }
}
