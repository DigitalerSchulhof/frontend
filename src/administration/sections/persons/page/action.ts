'use server';

import { requireLogin } from '#/auth/action';
import { AndFilter, Filter } from '#/services/interfaces/base';
import type { Person, PersonType } from '#/services/interfaces/person';
import { wrapAction } from '#/utils/action';
import type { Parse } from 'vality';
import { v } from 'vality';

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
      filter: createFiltersFromFilter(filter) ?? undefined,
      offset,
      limit: limit !== -1 ? limit : undefined,
    });

    return {
      items: persons.items.map((person) => ({
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
): AndFilter<Person> | null {
  const filters: Filter<Person>[] = [];

  if (filter.lastname) {
    filters.push(new Filter('lastname', 'like', filter.lastname));
  }

  if (filter.firstname) {
    filters.push(new Filter('firstname', 'like', filter.firstname));
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
): Filter<Person> | null {
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
    return new Filter('type', 'in', types);
  }

  return null;
}
