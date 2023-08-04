import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type { Class, ClassService } from '#/services/interfaces/class';
import type { ClassServiceClient } from '@dsh/protocols/dsh/services/class/v1/service';
import {
  BatchGetClassesRequest,
  CreateClassRequest,
  DeleteClassRequest,
  DeleteClassesWhereRequest,
  GetClassRequest,
  ListClassesRequest,
  UpdateClassRequest,
  UpdateClassesWhereRequest,
} from '@dsh/protocols/dsh/services/class/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  classFromJs,
  classToJs,
} from '../converters/dsh/services/class/v1/resources';
import { GrpcService } from './base';

export class GrpcClassService
  extends GrpcService<ClassServiceClient>
  implements ClassService
{
  async search(
    options: SearchOptions<WithId<Class>>
  ): Promise<ListResult<WithId<Class>>> {
    const res = await this.client.ListClasses(
      new ListClassesRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.classes.map(classToJs),
    };
  }

  async get(id: string): Promise<WithId<Class> | null> {
    const res = await this.client.GetClass(new GetClassRequest({ id }));

    return classToJs(res.class);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Class> | null)[]> {
    const res = await this.client.BatchGetClasses(
      new BatchGetClassesRequest({ ids })
    );

    return res.classes.map(classToJs);
  }

  async create(data: Class): Promise<WithId<Class>> {
    const res = await this.client.CreateClass(
      new CreateClassRequest({
        data: classFromJs(data),
      })
    );

    return classToJs(res.class);
  }

  async update(
    id: string,
    data: Partial<Class>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Class>> {
    const res = await this.client.UpdateClass(
      new UpdateClassRequest({
        id,
        data: classFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
      })
    );

    return classToJs(res.class);
  }

  async updateWhere(
    filter: TypeFilter<Class>,
    data: Partial<Class>
  ): Promise<WithId<Class>[]> {
    const res = await this.client.UpdateClassesWhere(
      new UpdateClassesWhereRequest({
        filter: filterToGrpc(filter),
        data: classFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.classes.map(classToJs);
  }

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Class>> {
    const res = await this.client.DeleteClass(
      new DeleteClassRequest({ id, if_rev: options?.ifRev })
    );

    return classToJs(res.class);
  }

  async deleteWhere(filter: TypeFilter<Class>): Promise<WithId<Class>[]> {
    const res = await this.client.DeleteClassesWhere(
      new DeleteClassesWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.classes.map(classToJs);
  }
}

function filterToGrpc(
  filter: TypeFilter<Class> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<Class> | undefined
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
    case 'levelId':
      return { property: 'level_id', operator, value };
    case 'name':
      return { property: 'name', operator, value };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
