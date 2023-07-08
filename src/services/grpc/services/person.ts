import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import { Person, PersonService } from '#/services/interfaces/person';
import {
  BatchGetPersonsRequest,
  CreatePersonRequest,
  DeletePersonRequest,
  DeletePersonsWhereRequest,
  GetPersonRequest,
  ListPersonsRequest,
  PersonServiceClient,
  UpdatePersonRequest,
  UpdatePersonsWhereRequest,
} from '@dsh/protocols/dsh/services/person/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  personFromJs,
  personToJs,
} from '../converters/dsh/services/person/v1/resources';
import { GrpcService, filtersToGrpc } from './base';

export class PersonServiceGrpcService
  extends GrpcService<PersonServiceClient>
  implements PersonService
{
  generateTeacherCodeSuggestion(lastname: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  async search(
    options: SearchOptions<Person>
  ): Promise<ListResult<WithId<Person>>> {
    const res = await this.client.ListPersons(
      new ListPersonsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filtersToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.persons.map(personToJs),
    };
  }

  async get(id: string): Promise<WithId<Person> | null> {
    const res = await this.client.GetPerson(new GetPersonRequest({ id }));

    return personToJs(res.person);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Person> | null)[]> {
    const res = await this.client.BatchGetPersons(
      new BatchGetPersonsRequest({ ids })
    );

    return res.persons.map(personToJs);
  }

  async create(data: Person): Promise<WithId<Person>> {
    const res = await this.client.CreatePerson(
      new CreatePersonRequest({
        data: personFromJs(data),
      })
    );

    return personToJs(res.person);
  }

  async update(id: string, data: Partial<Person>): Promise<WithId<Person>> {
    const res = await this.client.UpdatePerson(
      new UpdatePersonRequest({
        id,
        data: personFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return personToJs(res.person);
  }

  async updateWhere(
    filter: TypeFilter<Person>,
    data: Partial<Person>
  ): Promise<WithId<Person>[]> {
    const res = await this.client.UpdatePersonsWhere(
      new UpdatePersonsWhereRequest({
        filter: filtersToGrpc(filter),
        data: personFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.persons.map(personToJs);
  }

  async delete(id: string): Promise<WithId<Person>> {
    const res = await this.client.DeletePerson(new DeletePersonRequest({ id }));

    return personToJs(res.person);
  }

  async deleteWhere(filter: TypeFilter<Person>): Promise<WithId<Person>[]> {
    const res = await this.client.DeletePersonsWhere(
      new DeletePersonsWhereRequest({
        filter: filtersToGrpc(filter),
      })
    );

    return res.persons.map(personToJs);
  }
}
