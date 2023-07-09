import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import {
  IdentityTheft,
  IdentityTheftService,
} from '#/services/interfaces/identity-theft';
import {
  BatchGetIdentityTheftsRequest,
  CreateIdentityTheftRequest,
  DeleteIdentityTheftRequest,
  DeleteIdentityTheftsWhereRequest,
  GetIdentityTheftRequest,
  IdentityTheftServiceClient,
  ListIdentityTheftsRequest,
  UpdateIdentityTheftRequest,
  UpdateIdentityTheftsWhereRequest,
} from '@dsh/protocols/dsh/services/identity_theft/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  identityTheftFromJs,
  identityTheftToJs,
} from '../converters/dsh/services/identity_theft/v1/resources';
import { GrpcService, filterToGrpc } from './base';

export class GrpcIdentityTheftService
  extends GrpcService<IdentityTheftServiceClient>
  implements IdentityTheftService
{
  async search(
    options: SearchOptions<IdentityTheft>
  ): Promise<ListResult<WithId<IdentityTheft>>> {
    const res = await this.client.ListIdentityThefts(
      new ListIdentityTheftsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.identity_thefts.map(identityTheftToJs),
    };
  }

  async get(id: string): Promise<WithId<IdentityTheft> | null> {
    const res = await this.client.GetIdentityTheft(
      new GetIdentityTheftRequest({ id })
    );

    return identityTheftToJs(res.identity_theft);
  }

  async getByIds(
    ids: readonly string[]
  ): Promise<(WithId<IdentityTheft> | null)[]> {
    const res = await this.client.BatchGetIdentityThefts(
      new BatchGetIdentityTheftsRequest({ ids })
    );

    return res.identity_thefts.map(identityTheftToJs);
  }

  async create(data: IdentityTheft): Promise<WithId<IdentityTheft>> {
    const res = await this.client.CreateIdentityTheft(
      new CreateIdentityTheftRequest({
        data: identityTheftFromJs(data),
      })
    );

    return identityTheftToJs(res.identity_theft);
  }

  async update(
    id: string,
    data: Partial<IdentityTheft>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<IdentityTheft>> {
    const res = await this.client.UpdateIdentityTheft(
      new UpdateIdentityTheftRequest({
        id,
        data: identityTheftFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
      })
    );

    return identityTheftToJs(res.identity_theft);
  }

  async updateWhere(
    filter: TypeFilter<IdentityTheft>,
    data: Partial<IdentityTheft>
  ): Promise<WithId<IdentityTheft>[]> {
    const res = await this.client.UpdateIdentityTheftsWhere(
      new UpdateIdentityTheftsWhereRequest({
        filter: filterToGrpc(filter),
        data: identityTheftFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.identity_thefts.map(identityTheftToJs);
  }

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<IdentityTheft>> {
    const res = await this.client.DeleteIdentityTheft(
      new DeleteIdentityTheftRequest({ id, if_rev: options?.ifRev })
    );

    return identityTheftToJs(res.identity_theft);
  }

  async deleteWhere(
    filter: TypeFilter<IdentityTheft>
  ): Promise<WithId<IdentityTheft>[]> {
    const res = await this.client.DeleteIdentityTheftsWhere(
      new DeleteIdentityTheftsWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.identity_thefts.map(identityTheftToJs);
  }
}
