import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import { Class, ClassService } from '#/services/interfaces/class';
import { ClassServiceClient } from '@dsh/protocols/dsh/services/class/v1/service';

export class ClassServiceGrpcService
  extends GrpcService<ClassServiceClient>
  implements ClassService
{
  list(options: ListOptions): Promise<ListResult<WithId<Class>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<Class> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<Class> | null)[]> {
    throw new Error('Method not implemented.');
  }
  create(data: Class): Promise<WithId<Class>> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Class>): Promise<WithId<Class>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<Class>> {
    throw new Error('Method not implemented.');
  }
}
