import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import { Session, SessionService } from '#/services/interfaces/session';
import { SessionServiceClient } from '@dsh/protocols/dsh/services/session/v1/service';

export class SessionServiceGrpcService
  extends GrpcService<SessionServiceClient>
  implements SessionService
{
  search(options: ListOptions): Promise<ListResult<WithId<Session>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<Session> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<Session> | null)[]> {
    throw new Error('Method not implemented.');
  }

  create(data: Session): Promise<WithId<Session>> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Session>): Promise<WithId<Session>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<Session>> {
    throw new Error('Method not implemented.');
  }
}
