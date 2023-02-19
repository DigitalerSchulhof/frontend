import { aql } from 'arangojs';
import { CreateContextContext } from '../../../context';
import { SearchArgs } from '../../base';
import { Paginated, paginateResult, paginationToQuery } from '../../utils';
import { School, SchoolModel } from './models';

export const school = (context: CreateContextContext) => ({
  async get(id: string): Promise<School | null> {
    const res = await context.db.query<School | null>(
      aql`
        RETURN DOCUMENT("schools", ${id})
      `,
      { fullCount: true }
    );

    return (await res.next()) ?? null;
  },
  async searchWithPagination(
    args: SearchArgs<SchoolModel>
  ): Promise<Paginated<School>> {
    const res = context.db.query<School>(
      aql`
        FOR doc IN schools
          ${paginationToQuery({
            ...args,
            // Add a limit of 1 more than the requested limit to determine if there is a next page
            limit: typeof args.limit === 'number' ? args.limit + 1 : args.limit,
          })}

          RETURN doc
      `,
      { fullCount: true }
    );

    return paginateResult(res, args);
  },
});
