import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type {
  Schoolyear,
  SchoolyearService,
} from '#/services/interfaces/schoolyear';
import type { SchoolyearServiceClient } from '@dsh/protocols/dsh/services/schoolyear/v1/service';
import {
  BatchGetSchoolyearsRequest,
  CreateSchoolyearRequest,
  DeleteSchoolyearRequest,
  DeleteSchoolyearsWhereRequest,
  GetSchoolyearRequest,
  ListSchoolyearsRequest,
  UpdateSchoolyearRequest,
  UpdateSchoolyearsWhereRequest,
} from '@dsh/protocols/dsh/services/schoolyear/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  schoolyearFromJs,
  schoolyearToJs,
} from '../converters/dsh/services/schoolyear/v1/resources';
import { GrpcService } from './base';

export class GrpcSchoolyearService
  extends GrpcService<SchoolyearServiceClient>
  implements SchoolyearService
{
  async search(
    options: SearchOptions<WithId<Schoolyear>>
  ): Promise<ListResult<WithId<Schoolyear>>> {
    const res = await this.client.ListSchoolyears(
      new ListSchoolyearsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.schoolyears.map(schoolyearToJs),
    };
  }

  async get(id: string): Promise<WithId<Schoolyear> | null> {
    const res = await this.client.GetSchoolyear(
      new GetSchoolyearRequest({ id })
    );

    return schoolyearToJs(res.schoolyear);
  }

  async getByIds(
    ids: readonly string[]
  ): Promise<(WithId<Schoolyear> | null)[]> {
    const res = await this.client.BatchGetSchoolyears(
      new BatchGetSchoolyearsRequest({ ids })
    );

    return res.schoolyears.map(schoolyearToJs);
  }

  async create(data: Schoolyear): Promise<WithId<Schoolyear>> {
    const res = await this.client.CreateSchoolyear(
      new CreateSchoolyearRequest({
        data: schoolyearFromJs(data),
      })
    );

    return schoolyearToJs(res.schoolyear);
  }

  async update(
    id: string,
    data: Partial<Schoolyear>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Schoolyear>> {
    const res = await this.client.UpdateSchoolyear(
      new UpdateSchoolyearRequest({
        id,
        data: schoolyearFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
      })
    );

    return schoolyearToJs(res.schoolyear);
  }

  async updateWhere(
    filter: TypeFilter<Schoolyear>,
    data: Partial<Schoolyear>
  ): Promise<WithId<Schoolyear>[]> {
    const res = await this.client.UpdateSchoolyearsWhere(
      new UpdateSchoolyearsWhereRequest({
        filter: filterToGrpc(filter),
        data: schoolyearFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.schoolyears.map(schoolyearToJs);
  }

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Schoolyear>> {
    const res = await this.client.DeleteSchoolyear(
      new DeleteSchoolyearRequest({ id, if_rev: options?.ifRev })
    );

    return schoolyearToJs(res.schoolyear);
  }

  async deleteWhere(
    filter: TypeFilter<Schoolyear>
  ): Promise<WithId<Schoolyear>[]> {
    const res = await this.client.DeleteSchoolyearsWhere(
      new DeleteSchoolyearsWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.schoolyears.map(schoolyearToJs);
  }
}

function filterToGrpc(
  filter: TypeFilter<Schoolyear> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<Schoolyear> | undefined
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

  switch (property) {
    case 'id':
      return { property: 'id', operator, value };
    case 'rev':
      return { property: 'rev', operator, value };
    case 'updatedAt':
      return {
        property: 'updated_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'createdAt':
      return {
        property: 'created_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'name':
      return { property: 'name', operator, value };
    case 'start':
      return { property: 'start', operator, value: (value as Date).getTime() };
    case 'end':
      return { property: 'end', operator, value: (value as Date).getTime() };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
