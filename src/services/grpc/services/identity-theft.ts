import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import {
  IdentityTheft,
  IdentityTheftService,
} from '#/services/interfaces/identity-theft';
import { IdentityTheftServiceClient } from '@dsh/protocols/dsh/services/identity_theft/v1/service';

export class IdentityTheftServiceGrpcService
  extends GrpcService<IdentityTheftServiceClient>
  implements IdentityTheftService
{
  list(options: ListOptions): Promise<ListResult<WithId<IdentityTheft>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<IdentityTheft> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<IdentityTheft> | null)[]> {
    throw new Error('Method not implemented.');
  }

  create(data: IdentityTheft): Promise<WithId<IdentityTheft>> {
    throw new Error('Method not implemented.');
  }

  update(
    id: string,
    data: Partial<IdentityTheft>
  ): Promise<WithId<IdentityTheft>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<IdentityTheft>> {
    throw new Error('Method not implemented.');
  }
}
