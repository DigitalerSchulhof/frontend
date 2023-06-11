'use server';

import { requireLogin } from '#/auth/action';
import {
  PERSON_GENDERS,
  PERSON_TYPES,
  PersonGender,
  PersonType,
} from '#/backend/repositories/content/person';
import { LoggedInBackendContext } from '#/context';
import { InvalidInputError, wrapAction, wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export type PersonInput = {
  type: PersonType;
  firstname: string;
  lastname: string;
  gender: PersonGender;
  teacherCode: string | null;
};

export default wrapFormAction(
  {
    id: [v.string, null],
    rev: [v.string, null],
    type: PERSON_TYPES,
    firstname: v.string,
    lastname: v.string,
    gender: PERSON_GENDERS,
    teacherCode: [v.string, null],
  },
  async ({
    id: personId,
    rev: ifRev,
    type,
    firstname,
    lastname,
    gender,
    teacherCode,
  }) => {
    if (typeof personId !== typeof ifRev) {
      throw new InvalidInputError();
    }

    const context = await requireLogin();

    const data = {
      type,
      firstname,
      lastname,
      gender,
      teacherCode: type === 'teacher' ? teacherCode : null,
    };

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
