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
import { InvalidInputError, wrapAction } from '#/utils/action';
import { v, validate } from 'vality';

export type LoadPersonsFilter = {
  lastname: string;
  firstname: string;
  class: string;
  typeStudent: boolean;
  typeTeacher: boolean;
  typeParent: boolean;
  typeAdmin: boolean;
  typeOther: boolean;
};

export type LoadPersonsResponse = {
  items: LoadPersonsPerson[];
  total: number;
};

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

export const loadPersons = wrapAction<
  [filter: LoadPersonsFilter, offset: number, limit: number],
  LoadPersonsResponse
>(async (filter, offset, limit) => {
  if (typeof offset !== 'number' || typeof limit !== 'number') {
    throw new InvalidInputError();
  }

  const validatedFilters = validate(filterSchema, filter);

  if (!validatedFilters.valid) {
    throw new InvalidInputError();
  }

  const context = await requireLogin();

  const persons = await context.services.person.search({
    filter: createFiltersFromFilter(validatedFilters.data),
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
    })),
    total: persons.total,
  };
});

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
