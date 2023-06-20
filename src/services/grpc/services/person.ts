import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import { Person, PersonService } from '#/services/interfaces/person';
import { PersonServiceClient } from '@dsh/protocols/dsh/services/person/v1/service';

export class PersonServiceGrpcService
  extends GrpcService<PersonServiceClient>
  implements PersonService
{
  list(options: ListOptions): Promise<ListResult<WithId<Person>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<Person> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<Person> | null)[]> {
    throw new Error('Method not implemented.');
  }

  create(data: Person): Promise<WithId<Person>> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Person>): Promise<WithId<Person>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<Person>> {
    throw new Error('Method not implemented.');
  }
}
