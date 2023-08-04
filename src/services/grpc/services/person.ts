import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type { Person, PersonService } from '#/services/interfaces/person';
import type { PersonServiceClient } from '@dsh/protocols/dsh/services/person/v1/service';
import {
  BatchGetPersonsRequest,
  CreatePersonRequest,
  DeletePersonRequest,
  DeletePersonsWhereRequest,
  GetPersonRequest,
  ListPersonsRequest,
  UpdatePersonRequest,
  UpdatePersonsWhereRequest,
} from '@dsh/protocols/dsh/services/person/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  personFromJs,
  personToJs,
} from '../converters/dsh/services/person/v1/resources';
import { GrpcService } from './base';

export class GrpcPersonService
  extends GrpcService<PersonServiceClient>
  implements PersonService
{
  generateTeacherCodeSuggestion(lastname: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  async search(
    options: SearchOptions<WithId<Person>>
  ): Promise<ListResult<WithId<Person>>> {
    const res = await this.client.ListPersons(
      new ListPersonsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
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

  async update(
    id: string,
    data: Partial<Person>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Person>> {
    const res = await this.client.UpdatePerson(
      new UpdatePersonRequest({
        id,
        data: personFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
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
        filter: filterToGrpc(filter),
        data: personFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.persons.map(personToJs);
  }

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Person>> {
    const res = await this.client.DeletePerson(
      new DeletePersonRequest({ id, if_rev: options?.ifRev })
    );

    return personToJs(res.person);
  }

  async deleteWhere(filter: TypeFilter<Person>): Promise<WithId<Person>[]> {
    const res = await this.client.DeletePersonsWhere(
      new DeletePersonsWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.persons.map(personToJs);
  }
}

function filterToGrpc(
  filter: TypeFilter<Person> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<Person> | undefined
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
      return {
        property: 'updated_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'createdAt':
      return {
        property: 'created_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'firstname':
      return { property: 'firstname', operator, value };
    case 'lastname':
      return { property: 'lastname', operator, value };
    case 'type':
      return { property: 'type', operator, value };
    case 'gender':
      return { property: 'gender', operator, value };
    case 'teacherCode':
      return { property: 'teacher_code', operator, value };
    case 'accountId':
      return { property: 'account_id', operator, value };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
