import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import { Level, LevelService } from '#/services/interfaces/level';
import { LevelServiceClient } from '@dsh/protocols/dsh/services/level/v1/service';

export class LevelServiceGrpcService
  extends GrpcService<LevelServiceClient>
  implements LevelService
{
  list(options: ListOptions): Promise<ListResult<WithId<Level>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<Level> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<Level> | null)[]> {
    throw new Error('Method not implemented.');
  }

  create(data: Level): Promise<WithId<Level>> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Level>): Promise<WithId<Level>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<Level>> {
    throw new Error('Method not implemented.');
  }
}
