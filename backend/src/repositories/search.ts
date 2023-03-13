import * as aql from 'arangojs/aql';
import { Filter as FilterBase } from './filters';
import { Sort } from './sort';

export interface Paginated<T> {
  nodes: T[];
  total: number;
}

export interface MakeSearchQuery<Base, Filter extends FilterBase<unknown>> {
  filter?: Filter;
  sort?: readonly Sort<Base>[];
  limit?: number;
  offset?: number;
}

export const DEFAULT_LIMIT = 25;

export function searchQueryToArangoQuery(
  documentNameLiteral: aql.AqlLiteral,
  query: MakeSearchQuery<unknown, FilterBase<unknown>>
): aql.GeneratedAqlQuery {
  const { filter, sort } = query;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const offset = query.offset ?? 0;

  const filterQuery = filterToArangoQuery(documentNameLiteral, filter);
  const sortQuery = sortsToArangoQuery(documentNameLiteral, sort);

  return aql.aql`
    ${filterQuery}
    ${sortQuery}
    LIMIT ${offset}, ${limit}
  `;
}

export function filterToArangoQuery(
  documentNameLiteral: aql.AqlLiteral,
  filter?: FilterBase<unknown>
): aql.GeneratedAqlQuery | undefined {
  if (!filter) return undefined;

  return aql.aql`FILTER ${filter.apply(documentNameLiteral)}`;
}

export function sortsToArangoQuery(
  documentNameLiteral: aql.AqlLiteral,
  sort?: readonly Sort<unknown>[]
): aql.GeneratedAqlQuery | undefined {
  if (!sort?.length) return undefined;

  return aql.aql`SORT ${aql.join(
    sort.map((s) => s.apply(documentNameLiteral)),
    ', '
  )}`;
}
