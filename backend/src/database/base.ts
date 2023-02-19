import { aql } from 'arangojs';
import { CreateContextContext } from '../context';
import { ID } from './models';
import { Paginated, paginateResult, paginationToQuery } from './utils';

export type SearchOptionsMap = {
  ID: {
    eq?: ID | null;
    neq?: ID | null;
    in?: readonly ID[] | null;
    nin?: readonly ID[] | null;
  };
  String: {
    eq?: string | null;
    neq?: string | null;
    in?: readonly string[] | null;
    nin?: readonly string[] | null;
  };
};

export type SearchOptions<Type extends keyof SearchOptionsMap> =
  SearchOptionsMap[Type];

export type GetSortable<Model> = string &
  keyof {
    [K in keyof Model as Model[K] extends {
      sortable: true;
    }
      ? K
      : never]: true;
  };

export type SearchArgs<Model> = {
  offset?: number | null;
  limit?: number | null;
  sort?:
    | readonly {
        by: GetSortable<Model>;
        direction: 'ASC' | 'DESC';
      }[]
    | null;
  filter?:
    | {
        [K in string & keyof Model as Model[K] extends {
          searchable: true;
        }
          ? K
          : never]?: Model[K] extends {
          type: infer Type extends keyof SearchOptionsMap;
        }
          ? SearchOptions<Type> | null
          : 'Unknown type!';
      }
    | null;
};
