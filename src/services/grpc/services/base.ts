import { AndFilter, OrFilter, TypeFilter } from '#/services/interfaces/base';
import type * as grpc from '@grpc/grpc-js';

export abstract class GrpcService<Client extends grpc.Client> {
  constructor(protected readonly client: Client) {}
}

export function filtersToGrpc(
  filter: TypeFilter<object> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  // Buffer has a `toJSON` method, so we're fine to JSON.stringify it
  return JSON.stringify(filtersToGrpcWorker(filter));
}

function filtersToGrpcWorker(
  filter: TypeFilter<object> | undefined
): object | undefined {
  if (!filter) return undefined;

  if (filter instanceof AndFilter) {
    return {
      and: filter.getFilters().map(filtersToGrpc),
    };
  }

  if (filter instanceof OrFilter) {
    return {
      or: filter.getFilters().map(filtersToGrpc),
    };
  }

  return {
    filter: [filter.getProperty(), filter.getOperator(), filter.getValue()],
  };
}
