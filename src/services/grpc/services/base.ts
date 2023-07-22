import type { TypeFilter } from '#/services/interfaces/base';
import { AndFilter, OrFilter } from '#/services/interfaces/base';
import type * as grpc from '@grpc/grpc-js';

export abstract class GrpcService<Client extends grpc.Client> {
  constructor(protected readonly client: Client) {}
}

export function filterToGrpc(
  filter: TypeFilter<object> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  // Buffer has a `toJSON` method, so we're fine to JSON.stringify it
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<object> | undefined
): object | undefined {
  if (!filter) return undefined;

  if (filter instanceof AndFilter) {
    return {
      and: filter.filters.map(filterToGrpcWorker),
    };
  }

  if (filter instanceof OrFilter) {
    return {
      or: filter.filters.map(filterToGrpcWorker),
    };
  }

  const { property, operator, value } = filter;

  return {
    filter: { property, operator, value },
  };
}
