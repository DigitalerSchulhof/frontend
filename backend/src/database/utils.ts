import * as aql from 'arangojs/aql';
import { ArrayCursor } from 'arangojs/cursor';
import { MaybePromise } from '../utils';

const EMPTY_AQL = aql.aql``;

export function filterToQuery(
  filters?:
    | {
        [K in string]?: {
          eq?: string | number | boolean | Date | null;
          neq?: string | number | boolean | Date | null;
          gt?: number | Date | null;
          gte?: number | Date | null;
          lt?: number | Date | null;
          lte?: number | Date | null;
          in?: ReadonlyArray<string | number | boolean | Date> | null;
          nin?: ReadonlyArray<string | number | boolean | Date> | null;
        } | null;
      }
    | null
): aql.GeneratedAqlQuery {
  if (!filters || !Object.keys(filters).length) return EMPTY_AQL;

  const filterClauses = Object.entries(filters)
    .map(([key, filter]) => {
      if (!filter) return EMPTY_AQL;

      return Object.entries(filter).map(([op, value]) => {
        if (value === null || value === undefined) return EMPTY_AQL;

        switch (op) {
          case 'eq':
            return aql.aql`${aql.literal(key)} == ${aql.aql`${value}`}`;
          case 'neq':
            return aql.aql`${aql.literal(key)} != ${aql.aql`${value}`}`;
          case 'gt':
            return aql.aql`${aql.literal(key)} > ${aql.aql`${value}`}`;
          case 'gte':
            return aql.aql`${aql.literal(key)} >= ${aql.aql`${value}`}`;
          case 'lt':
            return aql.aql`${aql.literal(key)} < ${aql.aql`${value}`}`;
          case 'lte':
            return aql.aql`${aql.literal(key)} <= ${aql.aql`${value}`}`;
          case 'in':
            return aql.aql`${aql.literal(key)} IN ${aql.aql`${value}`}`;
          case 'nin':
            return aql.aql`${aql.literal(key)} NOT IN ${aql.aql`${value}`}`;
        }
      });
    })
    .flat();

  return aql.join(filterClauses);
}

const sortDirectionMap = {
  ASC: aql.aql`ASC`,
  DESC: aql.aql`DESC`,
};

export function sortToQuery(
  sorts:
    | ReadonlyArray<{
        by: string;
        direction: keyof typeof sortDirectionMap;
      }>
    | null
    | undefined
): aql.GeneratedAqlQuery {
  if (!sorts || !sorts.length) return EMPTY_AQL;

  const sortClauses = sorts.map(
    (sort) =>
      aql.aql`${aql.literal(sort.by)} ${sortDirectionMap[sort.direction]}`
  );

  return aql.aql`
    SORT ${(aql.join(sortClauses), ', ')}
  `;
}

export const DEFAULT_LIMIT = 25;

export function paginationToQuery(args: {
  limit?: number | null;
  offset?: number | null;
  filters?:
    | {
        [K in string]?: {
          eq?: string | number | boolean | Date | null;
          neq?: string | number | boolean | Date | null;
          gt?: number | Date | null;
          gte?: number | Date | null;
          lt?: number | Date | null;
          lte?: number | Date | null;
          in?: readonly (string | number | boolean | Date)[] | null;
          nin?: readonly (string | number | boolean | Date)[] | null;
        } | null;
      }
    | null;
  sort?:
    | readonly {
        by: string;
        direction: keyof typeof sortDirectionMap;
      }[]
    | null;
}) {
  const { filters, sort } = args;
  const limit = args.limit ?? DEFAULT_LIMIT;
  const offset = args.offset ?? 0;

  const filterQuery = filterToQuery(filters);
  const sortQuery = sortToQuery(sort);

  // Always add a limit of 1 more than the requested limit to determine if there is a next page
  return aql.aql`
    ${filterQuery}
    ${sortQuery}
    LIMIT ${aql.aql`${offset}, ${limit + 1}`}
  `;
}

export interface Paginated<T> {
  edges: {
    node: T;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageOffset: number | null;
    previousPageOffset: number | null;
    totalPages: number;
  };
}

export async function paginateResult<T>(
  res: MaybePromise<ArrayCursor<T>>,
  args: {
    limit?: number | null;
    offset?: number | null;
  }
): Promise<Paginated<T>> {
  const limit = args.limit ?? DEFAULT_LIMIT;
  const offset = args.offset ?? 0;

  const cursor = await res;

  const nodes = await cursor.all();
  const hasNextPage = nodes.length > limit;
  const hasPreviousPage = offset > 0;

  if (cursor.extra.stats?.fullCount === undefined) {
    throw new Error('Pagination requires fullCount to be set');
  }

  return {
    // We query for one more than the limit to determine if there is a next page
    edges: nodes.slice(0, limit).map((node) => ({
      node,
    })),
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      nextPageOffset: hasNextPage ? offset + limit : null,
      previousPageOffset: hasPreviousPage ? offset - limit : null,
      totalPages: cursor.extra.stats.fullCount,
    },
  };
}
