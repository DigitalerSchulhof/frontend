import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import { Session, SessionService } from '#/services/interfaces/session';
import {
  BatchGetSessionsRequest,
  CreateSessionRequest,
  DeleteSessionRequest,
  DeleteSessionsWhereRequest,
  GetSessionRequest,
  ListSessionsRequest,
  SessionServiceClient,
  UpdateSessionRequest,
  UpdateSessionsWhereRequest,
} from '@dsh/protocols/dsh/services/session/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  sessionFromJs,
  sessionToJs,
} from '../converters/dsh/services/session/v1/resources';
import { GrpcService, filterToGrpc } from './base';

export class SessionServiceGrpcService
  extends GrpcService<SessionServiceClient>
  implements SessionService
{
  async search(
    options: SearchOptions<Session>
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

  async update(id: string, data: Partial<Session>): Promise<WithId<Session>> {
    const res = await this.client.UpdateSession(
      new UpdateSessionRequest({
        id,
        data: sessionFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
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

  async delete(id: string): Promise<WithId<Session>> {
    const res = await this.client.DeleteSession(
      new DeleteSessionRequest({ id })
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
