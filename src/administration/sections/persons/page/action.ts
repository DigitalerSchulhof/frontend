'use server';

import { requireLogin } from '#/auth/action';
import { PersonType } from '#/backend/repositories/content/person';
import {
  PersonFirstnameFilter,
  PersonLastnameFilter,
  PersonTypeFilter,
} from '#/backend/repositories/content/person/filters';
import { AndFilter, Filter } from '#/backend/repositories/filters';
import {
  InFilterOperator,
  LikeFilterOperator,
} from '#/backend/repositories/filters/operators';
import { wrapAction } from '#/utils/action';
import { Parse, v } from 'vality';

export type LoadPersonsPerson = {
  id: string;
  type: 'student' | 'teacher' | 'parent' | 'admin' | 'other';
  gender: 'male' | 'female' | 'other';
  firstname: string;
  lastname: string;
  hasAccount: boolean;
};

const filterSchema = {
  lastname: v.string,
  firstname: v.string,
  class: v.string,
  typeStudent: v.boolean,
  typeTeacher: v.boolean,
  typeParent: v.boolean,
  typeAdmin: v.boolean,
  typeOther: v.boolean,
};

export type LoadPersonsFilter = Parse<typeof filterSchema>;

export default wrapAction(
  [filterSchema, v.number, v.number],
  async (filter, offset, limit) => {
    const context = await requireLogin();

    const persons = await context.services.person.search({
      filter: createFiltersFromFilter(filter),
      offset,
      limit: limit !== -1 ? limit : undefined,
    });

    return {
      items: persons.nodes.map((person) => ({
        id: person.id,
        type: person.type,
        firstname: person.firstname,
        lastname: person.lastname,
        gender: person.gender,
        hasAccount: person.accountId !== null,
      })) satisfies LoadPersonsPerson[],
      total: persons.total,
    };
  }
);

function createFiltersFromFilter(
  filter: LoadPersonsFilter
): Filter<'persons'> | null {
  const filters: (Filter<'persons'> | null)[] = [];

  if (filter.lastname) {
    filters.push(
      new PersonLastnameFilter(new LikeFilterOperator(filter.lastname))
    );
  }

  if (filter.firstname) {
    filters.push(
      new PersonFirstnameFilter(new LikeFilterOperator(filter.firstname))
    );
  }

  if (filter.class) {
    // TODO: Implement class relations and filter
  }

  const typeFilter = createTypeFilterFromFilter(filter);

  if (typeFilter) {
    filters.push(typeFilter);
  }

  if (filters.length) {
    return new AndFilter(...filters);
  }

  return null;
}

function createTypeFilterFromFilter(
  filter: LoadPersonsFilter
): Filter<'persons'> | null {
  const types: PersonType[] = [];

  if (filter.typeStudent) {
    types.push('student');
  }

  if (filter.typeTeacher) {
    types.push('teacher');
  }

  if (filter.typeParent) {
    types.push('parent');
  }

  if (filter.typeAdmin) {
    types.push('admin');
  }

  if (filter.typeOther) {
    types.push('other');
  }

  if (types.length) {
    return new PersonTypeFilter(new InFilterOperator(types));
  }

  return null;
}
