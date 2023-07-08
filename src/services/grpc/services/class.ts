import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import { Class, ClassService } from '#/services/interfaces/class';
import {
  BatchGetClassesRequest,
  ClassServiceClient,
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
import { GrpcService, filtersToGrpc } from './base';

export class ClassServiceGrpcService
  extends GrpcService<ClassServiceClient>
  implements ClassService
{
  async search(
    options: SearchOptions<Class>
  ): Promise<ListResult<WithId<Class>>> {
    const res = await this.client.ListClasses(
      new ListClassesRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filtersToGrpc(options.filter),
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

  async update(id: string, data: Partial<Class>): Promise<WithId<Class>> {
    const res = await this.client.UpdateClass(
      new UpdateClassRequest({
        id,
        data: classFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
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
        filter: filtersToGrpc(filter),
        data: classFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.classes.map(classToJs);
  }

  async delete(id: string): Promise<WithId<Class>> {
    const res = await this.client.DeleteClass(
      new DeleteClassRequest({ id })
    );

    return classToJs(res.class);
  }

  async deleteWhere(filter: TypeFilter<Class>): Promise<WithId<Class>[]> {
    const res = await this.client.DeleteClassesWhere(
      new DeleteClassesWhereRequest({
        filter: filtersToGrpc(filter),
      })
    );

    return res.classes.map(classToJs);
  }
}
