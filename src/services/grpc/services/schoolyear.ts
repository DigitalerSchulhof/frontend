import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import {
  Schoolyear,
  SchoolyearService,
} from '#/services/interfaces/schoolyear';
import {
  BatchGetSchoolyearsRequest,
  CreateSchoolyearRequest,
  DeleteSchoolyearRequest,
  DeleteSchoolyearsWhereRequest,
  GetSchoolyearRequest,
  ListSchoolyearsRequest,
  SchoolyearServiceClient,
  UpdateSchoolyearRequest,
  UpdateSchoolyearsWhereRequest,
} from '@dsh/protocols/dsh/services/schoolyear/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  schoolyearFromJs,
  schoolyearToJs,
} from '../converters/dsh/services/schoolyear/v1/resources';
import { GrpcService, filterToGrpc } from './base';

export class GrpcSchoolyearService
  extends GrpcService<SchoolyearServiceClient>
  implements SchoolyearService
{
  async search(
    options: SearchOptions<Schoolyear>
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
