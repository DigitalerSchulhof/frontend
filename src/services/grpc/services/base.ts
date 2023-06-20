import { ListOptions, ListResult } from '#/services/interfaces/base';
import type * as grpc from '@grpc/grpc-js';

export function transformListResponse<K extends string, TGrpc, TJs>(
  key: K,
  tToObject: (t: TGrpc) => TJs,
  res: Record<K, readonly TGrpc[]> & {
    meta: {
      total_count: number;
    };
  }
): ListResult<TJs> {
  return {
    total: res.meta.total_count,
    items: res[key].map(tToObject),
  };
}

export function createListRequest<C>(
  constructor: new (opt: {
    limit?: number;
    offset?: number;
    filter?: string;
    order_by?: string;
  }) => C,
  options: ListOptions
): C {
  return new constructor({
    limit: options.limit,
    offset: options.offset,
    filter: options.filter,
    order_by: options.order,
  });
}

export abstract class GrpcService<Client extends grpc.Client> {
  constructor(protected readonly client: Client) {}
}