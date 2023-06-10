'use server';

import { requireLogin } from '#/auth/action';
import {
  PERSON_GENDERS,
  PERSON_TYPES,
} from '#/backend/repositories/content/person';
import { LoggedInBackendContext } from '#/context';
import { InvalidInputError, wrapAction } from '#/utils/action';
import { Parse, v } from 'vality';

const personSchema = {
  type: PERSON_TYPES,
  firstname: v.string,
  lastname: v.string,
  gender: PERSON_GENDERS,
  teacherCode: [v.string, null],
};

export type PersonInput = Parse<typeof personSchema>;

export default wrapAction(
  [[v.string, null], [v.string, null], personSchema],
  async (personId, ifRev, data) => {
    if (typeof personId !== typeof ifRev) {
      throw new InvalidInputError();
    }

    const context = await requireLogin();

    if (personId === null) {
      return createPerson(context, data);
    } else {
      return editPerson(context, personId, ifRev!, data);
    }
  }
);

async function createPerson(
  context: LoggedInBackendContext,
  data: PersonInput
) {
  await context.services.person.create({
    ...data,
    accountId: null,
  });
}

async function editPerson(
  context: LoggedInBackendContext,
  personId: string,
  ifRev: string,
  data: PersonInput
) {
  const person = await context.services.person.getById(personId);

  if (!person) {
    throw new InvalidInputError();
  }

  await context.services.person.update(personId, data, {
    ifRev,
  });
}

export const generateTeacherCode = wrapAction([v.string], async (base) => {
  const context = await requireLogin();

  return (
    (await context.services.person.generateTeacherCodeSuggestion(base)) ?? ''
  );
});
