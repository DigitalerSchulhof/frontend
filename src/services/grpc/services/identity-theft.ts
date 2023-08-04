import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type {
  IdentityTheft,
  IdentityTheftService,
} from '#/services/interfaces/identity-theft';
import type { IdentityTheftServiceClient } from '@dsh/protocols/dsh/services/identity_theft/v1/service';
import {
  BatchGetIdentityTheftsRequest,
  CreateIdentityTheftRequest,
  DeleteIdentityTheftRequest,
  DeleteIdentityTheftsWhereRequest,
  GetIdentityTheftRequest,
  ListIdentityTheftsRequest,
  ReportIdentityTheftRequest,
  UpdateIdentityTheftRequest,
  UpdateIdentityTheftsWhereRequest,
} from '@dsh/protocols/dsh/services/identity_theft/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  identityTheftFromJs,
  identityTheftToJs,
} from '../converters/dsh/services/identity_theft/v1/resources';
import { GrpcService } from './base';

export class GrpcIdentityTheftService
  extends GrpcService<IdentityTheftServiceClient>
  implements IdentityTheftService
{
  async search(
    options: SearchOptions<WithId<IdentityTheft>>
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

  async report(personId: string): Promise<void> {
    await this.client.ReportIdentityTheft(
      new ReportIdentityTheftRequest({ person_id: personId })
    );
  }
}

function filterToGrpc(
  filter: TypeFilter<IdentityTheft> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<IdentityTheft> | undefined
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
      return { property: 'updated_at', operator, value };
    case 'createdAt':
      return { property: 'created_at', operator, value };
    case 'personId':
      return { property: 'person_id', operator, value };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
