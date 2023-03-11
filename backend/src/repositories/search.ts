import * as aql from 'arangojs/aql';
import { Filter } from './filters';
import { Sort } from './sort';

export interface Paginated<T> {
  nodes: T[];
  total: number;
}

export interface MakeSearchQuery<Name extends string, Base> {
  filter?: Filter<Name>;
  sort?: readonly Sort<Base>[];
  limit?: number;
  offset?: number;
}

export const DEFAULT_LIMIT = 25;

export function searchQueryToArangoQuery(
  documentName: string,
  query: MakeSearchQuery<string, unknown>
): aql.GeneratedAqlQuery {
  const { filter, sort } = query;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const offset = query.offset ?? 0;

  const documentNameLiteral = aql.literal(documentName);

  const filterQuery = filtersToArangoQuery(documentNameLiteral, filter);
  const sortQuery = sortsToArangoQuery(documentNameLiteral, sort);

  return aql.aql`
    ${filterQuery}
    ${sortQuery}
    LIMIT ${offset}, ${limit}
  `;
}

export function filtersToArangoQuery(
  documentNameMaybeLiteral: string | aql.AqlLiteral,
  filter?: Filter<unknown>
): aql.GeneratedAqlQuery | undefined {
  if (!filter) return undefined;

  const documentNameLiteral =
    typeof documentNameMaybeLiteral === 'string'
      ? aql.literal(documentNameMaybeLiteral)
      : documentNameMaybeLiteral;

  return aql.aql`FILTER ${filter.apply(documentNameLiteral)}`;
}

export function sortsToArangoQuery(
  documentNameMaybeLiteral: string | aql.AqlLiteral,
  sort?: readonly Sort<unknown>[]
): aql.GeneratedAqlQuery | undefined {
  if (!sort?.length) return undefined;

  const documentNameLiteral =
    typeof documentNameMaybeLiteral === 'string'
      ? aql.literal(documentNameMaybeLiteral)
      : documentNameMaybeLiteral;

  return aql.join(sort.map((s) => s.apply(documentNameLiteral)));
}
