import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import {
  Schoolyear,
  SchoolyearService,
} from '#/services/interfaces/schoolyear';
import { SchoolyearServiceClient } from '@dsh/protocols/dsh/services/schoolyear/v1/service';

export class SchoolyearServiceGrpcService
  extends GrpcService<SchoolyearServiceClient>
  implements SchoolyearService
{
  list(options: ListOptions): Promise<ListResult<WithId<Schoolyear>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<Schoolyear> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<Schoolyear> | null)[]> {
    throw new Error('Method not implemented.');
  }

  create(data: Schoolyear): Promise<WithId<Schoolyear>> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Schoolyear>): Promise<WithId<Schoolyear>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<Schoolyear>> {
    throw new Error('Method not implemented.');
  }
}
