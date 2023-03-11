import * as aql from 'arangojs/aql';
import { Filter } from './filters';
import { Sort } from './sort';

export interface Paginated<T> {
  nodes: T[];
  total: number;
}

export interface MakeSearchQuery<Base> {
  filters?: Filter<Base>[];
  sort?: Sort<Base>[];
  limit?: number;
  offset?: number;
}

export const DEFAULT_LIMIT = 25;

export function searchQueryToArangoQuery(
  documentName: string,
  query: MakeSearchQuery<unknown>
): aql.GeneratedAqlQuery {
  const { filters, sort } = query;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const offset = query.offset ?? 0;

  const documentNameLiteral = aql.literal(documentName);

  const filterQuery = filtersToArangoQuery(documentNameLiteral, filters);
  const sortQuery = sortsToArangoQuery(documentNameLiteral, sort);

  return aql.aql`
    ${filterQuery}
    ${sortQuery}
    LIMIT ${offset}, ${limit}
  `;
}

export function filtersToArangoQuery(
  documentNameMaybeLiteral: string | aql.AqlLiteral,
  filters?: Filter<unknown>[]
): aql.GeneratedAqlQuery | undefined {
  if (!filters?.length) return undefined;

  const documentNameLiteral =
    typeof documentNameMaybeLiteral === 'string'
      ? aql.literal(documentNameMaybeLiteral)
      : documentNameMaybeLiteral;

  return aql.join(filters.map((f) => f.apply(documentNameLiteral)));
}

export function sortsToArangoQuery(
  documentNameMaybeLiteral: string | aql.AqlLiteral,
  sort?: Sort<unknown>[]
): aql.GeneratedAqlQuery | undefined {
  if (!sort?.length) return undefined;

  const documentNameLiteral =
    typeof documentNameMaybeLiteral === 'string'
      ? aql.literal(documentNameMaybeLiteral)
      : documentNameMaybeLiteral;

  return aql.join(sort.map((s) => s.apply(documentNameLiteral)));
}
