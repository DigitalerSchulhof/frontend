import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type { Session, SessionService } from '#/services/interfaces/session';
import type { SessionServiceClient } from '@dsh/protocols/dsh/services/session/v1/service';
import {
  BatchGetSessionsRequest,
  CreateSessionRequest,
  DeleteSessionRequest,
  DeleteSessionsWhereRequest,
  GetSessionRequest,
  ListSessionsRequest,
  UpdateSessionRequest,
  UpdateSessionsWhereRequest,
} from '@dsh/protocols/dsh/services/session/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  sessionFromJs,
  sessionToJs,
} from '../converters/dsh/services/session/v1/resources';
import { GrpcService } from './base';

export class GrpcSessionService
  extends GrpcService<SessionServiceClient>
  implements SessionService
{
  async search(
    options: SearchOptions<WithId<Session>>
  ): Promise<ListResult<WithId<Session>>> {
    const res = await this.client.ListSessions(
      new ListSessionsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.sessions.map(sessionToJs),
    };
  }

  async get(id: string): Promise<WithId<Session> | null> {
    const res = await this.client.GetSession(new GetSessionRequest({ id }));

    return sessionToJs(res.session);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Session> | null)[]> {
    const res = await this.client.BatchGetSessions(
      new BatchGetSessionsRequest({ ids })
    );

    return res.sessions.map(sessionToJs);
  }

  async create(data: Session): Promise<WithId<Session>> {
    const res = await this.client.CreateSession(
      new CreateSessionRequest({
        data: sessionFromJs(data),
      })
    );

    return sessionToJs(res.session);
  }

  async update(
    id: string,
    data: Partial<Session>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Session>> {
    const res = await this.client.UpdateSession(
      new UpdateSessionRequest({
        id,
        data: sessionFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
      })
    );

    return sessionToJs(res.session);
  }

  async updateWhere(
    filter: TypeFilter<Session>,
    data: Partial<Session>
  ): Promise<WithId<Session>[]> {
    const res = await this.client.UpdateSessionsWhere(
      new UpdateSessionsWhereRequest({
        filter: filterToGrpc(filter),
        data: sessionFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.sessions.map(sessionToJs);
  }

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Session>> {
    const res = await this.client.DeleteSession(
      new DeleteSessionRequest({ id, if_rev: options?.ifRev })
    );

    return sessionToJs(res.session);
  }

  async deleteWhere(filter: TypeFilter<Session>): Promise<WithId<Session>[]> {
    const res = await this.client.DeleteSessionsWhere(
      new DeleteSessionsWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.sessions.map(sessionToJs);
  }
}

function filterToGrpc(
  filter: TypeFilter<Session> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<Session> | undefined
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
    case 'issuedAt':
      return { property: 'issued_at', operator, value };
    case 'didShowLastLogin':
      return { property: 'did_show_last_login', operator, value };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
