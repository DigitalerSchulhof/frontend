import * as aql from 'arangojs/aql';
import { identity } from '../utils';

export type MakeFilters<T, K extends keyof T> = {
  [P in K]?: T[P] extends string
    ? StringSearchFilter
    : T[P] extends number
    ? NumberSearchFilter
    : T[P] extends Date
    ? DateSearchFilter
    : T[P] extends boolean
    ? BooleanSearchFilter
    : never;
};

export type MakeSort<T, K extends keyof T> = readonly {
  by: K;
  direction: 'asc' | 'desc';
}[];

export type SearchFilter =
  | StringSearchFilter
  | NumberSearchFilter
  | DateSearchFilter
  | BooleanSearchFilter;

export interface StringSearchFilter {
  eq?: string;
  neq?: string;
  in?: string[];
  nin?: string[];
}

export interface NumberSearchFilter {
  eq?: number;
  neq?: number;
  in?: number[];
  nin?: number[];
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

export interface DateSearchFilter {
  eq?: number;
  neq?: number;
  in?: number[];
  nin?: number[];
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

export interface BooleanSearchFilter {
  eq?: boolean[];
  neq?: boolean[];
}

export interface Paginated<T> {
  nodes: T[];
  total: number;
}

export interface SearchQuery<
  Base,
  FilterableKeys extends keyof Base,
  SortableKeys extends keyof Base = FilterableKeys
> {
  filters?: MakeFilters<Base, FilterableKeys>;
  sort?: MakeSort<Base, SortableKeys>;
  limit?: number;
  offset?: number;
}

interface AnonymousSearchQuery {
  filters?: Record<string, SearchFilter>;
  sort?: readonly {
    by: string;
    direction: 'asc' | 'desc';
  }[];
  limit?: number;
  offset?: number;
}

const EMPTY_AQL = aql.aql``;
export const DEFAULT_LIMIT = 25;

export function searchQueryToArangoQuery(
  collectionName: string,
  query: AnonymousSearchQuery,
  modelKeyToArangoKey: (key: string) => string = identity
): aql.GeneratedAqlQuery {
  const { filters, sort } = query;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const offset = query.offset ?? 0;

  const filterQuery = searchFiltersToArangoQuery(
    collectionName,
    modelKeyToArangoKey,
    filters
  );
  const sortQuery = searchSortToArangoQuery(
    collectionName,
    modelKeyToArangoKey,
    sort
  );

  return aql.aql`
    ${filterQuery}
    ${sortQuery}
    LIMIT ${offset}, ${limit}
  `;
}

function searchFiltersToArangoQuery(
  collectionName: string,
  modelKeyToArangoKey: (key: string) => string,
  filters: AnonymousSearchQuery['filters']
): aql.GeneratedAqlQuery {
  if (!filters || !Object.keys(filters).length) return EMPTY_AQL;

  const filterClauses = Object.entries(filters)
    .map(([key, filter]) => {
      return Object.entries(filter).map(([op, value]) => {
        if (value === undefined) return EMPTY_AQL;

        const fieldAqlLiteral = aql.literal(
          `${collectionName}.${modelKeyToArangoKey(key)}`
        );
        const valueAql = aql.aql`${value}`;

        switch (op) {
          case 'eq':
            return aql.aql`FILTER ${fieldAqlLiteral} == ${valueAql}`;
          case 'neq':
            return aql.aql`FILTER ${fieldAqlLiteral} != ${valueAql}`;
          case 'gt':
            return aql.aql`FILTER ${fieldAqlLiteral} > ${valueAql}`;
          case 'gte':
            return aql.aql`FILTER ${fieldAqlLiteral} >= ${valueAql}`;
          case 'lt':
            return aql.aql`FILTER ${fieldAqlLiteral} < ${valueAql}`;
          case 'lte':
            return aql.aql`FILTER ${fieldAqlLiteral} <= ${valueAql}`;
          case 'in':
            return aql.aql`FILTER ${fieldAqlLiteral} IN ${valueAql}`;
          case 'nin':
            return aql.aql`FILTER ${fieldAqlLiteral} NOT IN ${valueAql}`;
        }
      });
    })
    .flat();

  return aql.join(filterClauses);
}

const sortDirectionMap = {
  asc: aql.aql`ASC`,
  desc: aql.aql`DESC`,
};

export function searchSortToArangoQuery(
  collectionName: string,
  modelKeyToArangoKey: (key: string) => string,
  sort: AnonymousSearchQuery['sort']
): aql.GeneratedAqlQuery {
  if (!sort?.length) return EMPTY_AQL;

  const sortClauses = sort.map(
    (sort) =>
      aql.aql`${aql.literal(
        `${collectionName}.${modelKeyToArangoKey(sort.by)}`
      )} ${sortDirectionMap[sort.direction]}`
  );

  return aql.aql`
    SORT ${(aql.join(sortClauses), ', ')}
  `;
}
