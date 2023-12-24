'use server';

import { requireLogin } from '#/auth/action';
import { PersonGender, PersonType } from '#/services/interfaces/person';
import { wrapAction } from '#/utils/action';
import type { Parse } from 'vality';
import { v } from 'vality';

export interface LoadPersonsPerson {
  id: string;
  rev: string;
  type: 'student' | 'teacher' | 'parent' | 'admin' | 'other';
  gender: 'male' | 'female' | 'other';
  firstname: string;
  lastname: string;
  hasAccount: boolean;
}

const filterSchema = {
  lastname: v.string,
  firstname: v.string,
  class: v.string,
  type: v.number,
};

export type LoadPersonsFilter = Parse<typeof filterSchema>;

export default wrapAction(
  [filterSchema, v.number, v.number],
  async (
    filter,
    offset,
    limit
  ): Promise<{ items: LoadPersonsPerson[]; total: number }> => {
    const context = await requireLogin();

    const persons = await context.services.person.searchPersons({
      filter,
      offset,
      limit: limit !== -1 ? limit : undefined,
    });

    return {
      items: persons.items.map((person) => ({
        id: person.id,
        rev: person.rev,
        firstname: person.firstname,
        lastname: person.lastname,
        type: (
          {
            [PersonType.Student]: 'student',
            [PersonType.Teacher]: 'teacher',
            [PersonType.Parent]: 'parent',
            [PersonType.Admin]: 'admin',
            [PersonType.Other]: 'other',
          } as const
        )[person.type],
        gender: (
          {
            [PersonGender.Male]: 'male',
            [PersonGender.Female]: 'female',
            [PersonGender.Other]: 'other',
          } as const
        )[person.gender],
        hasAccount: person.account !== null,
      })) satisfies LoadPersonsPerson[],
      total: persons.total,
    };
  }
);
